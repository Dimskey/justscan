# Railway Ultra-Simple Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Environment
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Copy and install
COPY backend/ ./
RUN pip install --no-cache-dir -r requirements.txt
RUN mkdir -p logs uploads

# Copy startup script
COPY start.py ./

# Railway will set PORT automatically
EXPOSE 8000

# Start with Python script that handles PORT
CMD ["python", "start.py"]