from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pymysql
from google.cloud.sql.connector import Connector
import os
from sqlalchemy import inspect

pymysql.install_as_MySQLdb()

app = Flask(__name__)

# Set environment variable for Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/cdmal/OneDrive/Documents/1cloudsystems/nifty-yeti-429817-d1-5ab9ebaadbe3.json"

# Create a Cloud SQL Connector instance
connector = Connector()

def getconn():
    conn = connector.connect(
        "nifty-yeti-429817-d1:us-central1:pomigosdb",
        "pymysql",
        user="pomigos",
        password="pomigos",
        db="pomigosdb"
    )
    return conn

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql:///"
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "creator": getconn
}

db = SQLAlchemy(app)
CORS(app)

# Task model
class Task(db.Model):
    __tablename__ = 'tasks'
    task_id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.String(255), nullable=False)
    completion = db.Column(db.Boolean, default=False)

# Basic homepage route
@app.route('/')
def home():
    return render_template('index.html')

# Route to show tables
@app.route('/show_tables')
def show_tables():
    try:
        # Use SQLAlchemy's inspection to get table names
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        return render_template('show_tables.html', tables=tables)
    except Exception as e:
        return jsonify({'error': str(e)})

# Route to fetch tasks
@app.route('/tasks')
def get_tasks():
    try:
        tasks = Task.query.all()
        tasks_list = [{'task_id': task.task_id, 'task_name': task.task_name, 'task_description': task.task_description} for task in tasks]
        return jsonify(tasks_list)
    except Exception as e:
        return jsonify({'error': str(e)})

# Route to add a new task
@app.route('/add_task', methods=['POST'])
def add_task():
    try:
        data = request.get_json()
        new_task = Task(task_name=data['task_name'], task_description=data['task_description'])
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'task_id': new_task.task_id, 'task_name': new_task.task_name, 'task_description': new_task.task_description})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
