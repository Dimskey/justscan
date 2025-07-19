#!/bin/bash

# Set default port if PORT env var is not set
export PORT=${PORT:-8000}

# Initialize database tables
echo "Initializing database..."
python -c "
try:
    import app.models
    from app.db.session import engine
    from app.models.base import Base
    print('Creating database tables...')
    Base.metadata.create_all(bind=engine)
    print('Database tables created successfully')
except Exception as e:
    print(f'Database initialization failed: {e}')
    print('Continuing without database initialization...')
"

# Start the application
echo "Starting uvicorn on port $PORT..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT