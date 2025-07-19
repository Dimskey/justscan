#!/usr/bin/env python3
"""
Initialize database tables and seed data
"""

def init_database():
    print("Creating database tables...")
    import app.models
    from app.db.session import engine
    from app.models.base import Base
    
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def seed_data():
    print("Seeding initial data...")
    from app.db.init_db import seed_initial_data
    seed_initial_data()
    print("✅ Sample data created successfully!")

if __name__ == "__main__":
    init_database()
    seed_data()
    print("🎉 Database setup complete!")