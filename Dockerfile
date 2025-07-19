# Railway-optimized Dockerfile
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
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Copy start script
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Copy backend directory first to use Docker layer caching
COPY backend/ ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p logs uploads

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Run the application using start script
CMD ["./start.sh"]