import logging
from sqlalchemy.orm import Session

from app.db.session import engine, SessionLocal
from app.models import user, project, scan_result
from app.models.base import Base
import app.models  # Pastikan semua model terdaftar sebelum create_all
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

def init_db() -> None:
    """
    Initialize database tables
    """
    try:
        # Create all tables (sekali saja)
        Base.metadata.create_all(bind=engine)
        
        logger.info("Database tables created successfully")
        
        # Seed initial data
        seed_initial_data()
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

def seed_initial_data() -> None:
    """
    Seed database with initial data
    """
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin_user = db.query(user.User).filter(user.User.username == "admin").first()
        
        if not admin_user:
            # Create admin user
            admin_user = user.User(
                username="admin",
                email="admin@justsploit.local",
                hashed_password=get_password_hash("admin123"),
                full_name="Administrator",
                is_active=True,
                is_superuser=True
            )
            db.add(admin_user)
            db.commit()
            logger.info("Admin user created successfully")
        
        # Check if demo user exists
        demo_user = db.query(user.User).filter(user.User.username == "demo").first()
        
        if not demo_user:
            # Create demo user
            demo_user = user.User(
                username="demo",
                email="demo@justsploit.local",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo User",
                is_active=True,
                is_superuser=False
            )
            db.add(demo_user)
            db.commit()
            logger.info("Demo user created successfully")
        
        # Create sample project for demo user
        sample_project = db.query(project.Project).filter(
            project.Project.name == "Sample Project",
            project.Project.user_id == demo_user.id
        ).first()
        
        if not sample_project:
            sample_project = project.Project(
                name="Sample Project",
                description="A sample penetration testing project",
                scope="example.com, test.example.com",
                user_id=demo_user.id
            )
            db.add(sample_project)
            db.commit()
            logger.info("Sample project created successfully")
            
            # Add sample targets
            sample_targets = [
                project.Target(
                    url="https://example.com",
                    ip_address="93.184.216.34",
                    hostname="example.com",
                    description="Main website",
                    project_id=sample_project.id
                ),
                project.Target(
                    url="https://test.example.com",
                    ip_address="93.184.216.35",
                    hostname="test.example.com",
                    description="Test environment",
                    project_id=sample_project.id
                )
            ]
            
            for target in sample_targets:
                db.add(target)
            
            db.commit()
            logger.info("Sample targets created successfully")
        
    except Exception as e:
        logger.error(f"Database seeding failed: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

def reset_db() -> None:
    """
    Reset database (drop all tables and recreate)
    """
    try:
        # Drop all tables (sekali saja)
        Base.metadata.drop_all(bind=engine)
        
        logger.info("Database tables dropped successfully")
        
        # Recreate tables
        init_db()
        
    except Exception as e:
        logger.error(f"Database reset failed: {str(e)}")
        raise

if __name__ == "__main__":
    init_db() 