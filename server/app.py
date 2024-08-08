from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_cors import CORS
import pymysql
import secrets
import string
from google.cloud.sql.connector import Connector
import os
import time
import logging

pymysql.install_as_MySQLdb()

app = Flask(__name__)
socketio = SocketIO(app)

# Set environment variable for Google Cloud credentials
google_credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', './nifty-yeti-429817-d1-5ab9ebaadbe3.json')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials_path

# Create a Cloud SQL Connector instance
connector = Connector()

def getconn():
    try:
        conn = connector.connect(
            "nifty-yeti-429817-d1:us-central1:pomigosdb",
            "pymysql",
            user="pomigos",
            password="pomigos",
            db="pomigosdb"
        )
        logging.info("Database connection established")
        return conn
    except Exception as e:
        logging.error(f"Error connecting to the database: {e}")
        raise

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql:///"
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "creator": getconn
}

db = SQLAlchemy(app)
CORS(app)

class Room(db.Model):
    room_id = db.Column(db.String(100), primary_key=True)

class Task(db.Model):
    __tablename__ = 'task'
    task_id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.String(255), nullable=False)
    completion = db.Column(db.Boolean, default=False)
    board_id = db.Column(db.Integer, db.ForeignKey('board.board_id'), nullable=False)

class Board(db.Model):
    board_id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.String(100), db.ForeignKey('room.room_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    shared = db.Column(db.Boolean, default=False)
    board_name = db.Column(db.String(100), nullable=False)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)

def after_insert_task(mapper, connection, target):
    socketio.emit('task_added', {'task': {
        'task_id': target.task_id,
        'task_name': target.task_name,
        'task_description': target.task_description,
        'board_id': target.board_id
    }})

def after_insert_board(mapper, connection, target):
    socketio.emit('board_added', {'board': {
        'board_id': target.board_id,
        'board_name': target.board_name,
        'user_id': target.user_id,
        'shared' : target.shared
    }})

def after_update_board(mapper, connection, target):
    socketio.emit('board_updated', {'board': {
        'board_id': target.board_id,
        'board_name': target.board_name,
        'user_id': target.user_id,
        'shared' : target.shared
    }})

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/tasks')
def get_tasks():
    try:
        tasks = Task.query.all()
        tasks_list = [{'task_id': task.task_id, 'task_name': task.task_name, 'task_description': task.task_description, 'completion': task.completion, 'board_id': task.board_id} for task in tasks]
        return jsonify(tasks_list)
    except Exception as e:
        logging.error(f"Error fetching tasks: {e}")
        return jsonify({'error': str(e)})

@app.route('/add_task', methods=['POST'])
def add_task():
    try:
        data = request.get_json()
        new_task = Task(task_name=data['task_name'], task_description=data['task_description'], board_id=data['board_id'])
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'task_id': new_task.task_id, 'task_name': new_task.task_name, 'task_description': new_task.task_description})
    except Exception as e:
        logging.error(f"Error adding task: {e}")
        return jsonify({'error': str(e)})

@app.route('/delete_task', methods=['POST'])
def delete_task():
    try:
        data = request.get_json()
        task_id = data['task_id']
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return jsonify({'message': 'Task deleted successfully'})
        return jsonify({'error': 'Task not found'})
    except Exception as e:
        logging.error(f"Error deleting task: {e}")
        return jsonify({'error': str(e)})

@app.route('/complete_task', methods=['POST'])
def complete_task():
    try:
        data = request.get_json()
        task_id = data['task_id']
        task = Task.query.get(task_id)
        if task:
            task.completion = True
            db.session.commit()
            return jsonify({'message': 'Task marked as complete'})
        return jsonify({'error': 'Task not found'})
    except Exception as e:
        logging.error(f"Error marking task as complete: {e}")
        return jsonify({'error': str(e)})

@app.route('/add_board', methods=['POST'])
def add_board():
    try:
        data = request.get_json()
        new_board = Board(
            user_id=data['user_id'],
            board_name=data['board_name'],
            shared=data.get('shared', False)
        )
        db.session.add(new_board)
        db.session.commit()
        return jsonify({
            'board_id': new_board.board_id,
            'user_id': new_board.user_id,
            'board_name': new_board.board_name,
            'shared': new_board.shared
        })
    except Exception as e:
        logging.error(f"Error adding board: {e}")
        return jsonify({'error': str(e)})

@app.route('/session', methods=['POST'])
def save_session():
    try:
        data = request.get_json()
        duration = data['duration']
        timestamp = time.time()
        session = {
            'duration': duration,
            'timestamp': timestamp
        }
        return jsonify({'message': 'Session saved', 'session': session}), 201
    except Exception as e:
        logging.error(f"Error saving session: {e}")
        return jsonify({'error': str(e)})

@app.route('/update_board/<int:board_id>', methods=['PUT'])
def update_board(board_id):
    try:
        data = request.get_json()
        board = Board.query.get(board_id)
        if not board:
            return jsonify({'error': 'Board not found'}), 404
        if 'board_name' in data:
            board.board_name = data['board_name']
        if 'shared' in data:
            board.shared = data['shared']
        db.session.commit()
        return jsonify({
            'board_id': board.board_id,
            'user_id': board.user_id,
            'board_name': board.board_name,
            'shared': board.shared
        })
    except Exception as e:
        logging.error(f"Error updating board: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/add_room', methods=['POST'])
def add_room():
    try:
        roomID = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for i in range(8))
        newRoom = Room(room_id=roomID)
        db.session.add(newRoom)
        db.session.commit()
        return jsonify({'room_id': newRoom.room_id})
    except Exception as e:
        logging.error(f"Error adding room: {e}")
        return jsonify({'error': str(e)})

@app.route('/join_room/<room_id>', methods=['GET'])
def join_room(room_id):
    room = Room.query.filter_by(room_id=room_id).first()
    if room:
        return jsonify({'room_id': room.room_id})
    else:
        return jsonify({'error': 'Room not found'}), 404

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.config['DEBUG'] = True  # Enable debug mode
    logging.basicConfig(level=logging.DEBUG)  # Set logging level to debug
    socketio.run(app, debug=True)
