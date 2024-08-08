# Use the official Python image from the Docker Hub
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/nifty-yeti-429817-d1-5ab9ebaadbe3.json

EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the Flask app
CMD ["flask", "run"]

