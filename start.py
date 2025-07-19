import os
import sys

def main():
    # Get PORT from Railway environment
    port = os.environ.get('PORT', '8000')
    print(f"Starting on port: {port}")
    
    # Validate port is numeric
    try:
        port_num = int(port)
        print(f"Port validated: {port_num}")
    except ValueError:
        print(f"Invalid PORT value: {port}, using 8000")
        port_num = 8000
    
    # Initialize database
    try:
        print("Setting up database...")
        import app.models
        from app.db.session import engine
        from app.models.base import Base
        Base.metadata.create_all(bind=engine)
        print("Database ready")
    except Exception as e:
        print(f"Database setup failed: {e}")
    
    # Start server
    print(f"Starting uvicorn on 0.0.0.0:{port_num}")
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0", 
        port=port_num,
        log_level="info"
    )

if __name__ == "__main__":
    main()