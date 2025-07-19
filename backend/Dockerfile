FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nmap \
    git \
    ruby \
    ruby-dev \
    build-essential \
    libffi-dev \
    zlib1g-dev \
    libyaml-dev \
    curl \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Install WhatWeb versi terbaru dari source agar support output JSON
RUN git clone https://github.com/urbanadventurer/WhatWeb.git /opt/whatweb \
    && gem install bundler psych stringio \
    && cd /opt/whatweb && bundle install \
    && ln -sf /opt/whatweb/whatweb /usr/local/bin/whatweb

# Set environment variables (bisa di-overwrite dari docker-compose)
ENV NMAP_PATH=/usr/bin/nmap

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p logs uploads && \
    chmod -R 777 logs uploads

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 