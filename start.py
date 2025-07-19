#!/usr/bin/env python3
"""
Start script for Railway deployment
Handles PORT environment variable and database initialization
"""
import os
import subprocess
import sys

def main():
    # Get port from environment with fallback
    port = os.getenv('PORT', '8000')
    print(f"Railway assigned PORT: {port}")
    
    # Initialize database
    try:
        print("Initializing database...")
        import app.models
        from app.db.session import engine
        from app.models.base import Base
        
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        print("Continuing without database initialization...")
    
    # Start uvicorn
    print(f"🚀 Starting uvicorn on 0.0.0.0:{port}")
    try:
        subprocess.run([
            'uvicorn', 
            'app.main:app', 
            '--host', '0.0.0.0', 
            '--port', str(port)
        ], check=True)
    except Exception as e:
        print(f"❌ Failed to start uvicorn: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()