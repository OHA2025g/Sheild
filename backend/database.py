from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'shield_foundation')]

async def init_database():
    """Initialize database with default data"""
    try:
        # Create admin user if doesn't exist
        admin_collection = db.admin_users
        existing_admin = await admin_collection.find_one({"username": "admin"})
        
        if not existing_admin:
            from auth import hash_password
            admin_user = {
                "username": "admin",
                "password": hash_password("admin123"),
                "name": "Shield Admin",
                "role": "super_admin",
                "created_at": datetime.utcnow()
            }
            await admin_collection.insert_one(admin_user)
            logger.info("Default admin user created")
        
        # Initialize impact stats if doesn't exist
        stats_collection = db.impact_stats
        existing_stats = await stats_collection.find_one()
        
        if not existing_stats:
            initial_stats = {
                "youth_trained": 1300,
                "youth_placed": 1000,
                "seniors_supported": 6000,
                "women_empowered": 200,
                "updated_at": datetime.utcnow(),
                "updated_by": "system"
            }
            await stats_collection.insert_one(initial_stats)
            logger.info("Initial impact stats created")
            
        # Create indexes for better performance
        await db.contacts.create_index("email")
        await db.volunteers.create_index("email")
        await db.newsletters.create_index("email", unique=True)
        await db.admin_users.create_index("username", unique=True)
        await db.news.create_index([("created_at", -1)])
        
        logger.info("Database initialization completed")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
