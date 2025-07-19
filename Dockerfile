# Lightweight Railway Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y \
    nmap \
    curl \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NMAP_PATH=/usr/bin/nmap
ENV PYTHONPATH=/app
ENV PORT=8000

# Copy requirements and install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ ./

# Create necessary directories
RUN mkdir -p logs uploads && \
    chmod -R 777 logs uploads

# Expose port
EXPOSE $PORT

# Run the application  
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT