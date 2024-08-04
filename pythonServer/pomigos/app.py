from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@/pomigosdb?unix_socket=/cloudsql/INSTANCE_CONNECTION_NAME'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Basic homepage route
@app.route('/')
def home():
    return "Welcome to the Flask App"

# Route to show tables
@app.route('/show_tables')
def show_tables():
    try:
        # Create a connection and execute the query
        with db.engine.connect() as connection:
            result = connection.execute('SHOW TABLES')
            tables = [row[0] for row in result]
        return jsonify({'tables': tables})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
