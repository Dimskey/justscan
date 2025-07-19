# Railway-optimized Dockerfile - Fixed PORT issue
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Copy start script
COPY start.py ./start.py

# Copy backend directory first
COPY backend/ ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p logs uploads

# Expose port 8000 (hardcoded for Railway)
EXPOSE 8000

# Use start script
CMD ["python", "start.py"]