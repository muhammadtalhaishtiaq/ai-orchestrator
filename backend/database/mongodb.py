"""
MongoDB connection handler for Project Nebula
Uses Motor (async MongoDB driver) for FastAPI compatibility
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.server_api import ServerApi
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Global database instance
_client: Optional[AsyncIOMotorClient] = None
_database: Optional[AsyncIOMotorDatabase] = None


class Database:
    """Database connection manager"""
    
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    
    @classmethod
    async def connect(cls, mongodb_uri: str, database_name: str = "nebula"):
        """
        Connect to MongoDB Atlas
        
        Args:
            mongodb_uri: MongoDB connection string
            database_name: Name of the database to use
        """
        try:
            cls.client = AsyncIOMotorClient(
                mongodb_uri,
                server_api=ServerApi('1')
            )
            cls.db = cls.client[database_name]
            
            # Verify connection with a ping
            await cls.client.admin.command('ping')
            logger.info(f"✅ Successfully connected to MongoDB! Database: {database_name}")
            
            # Create indexes for better performance
            await cls._create_indexes()
            
            return cls.db
            
        except Exception as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def _create_indexes(cls):
        """Create database indexes for optimal query performance"""
        if cls.db is None:
            return
            
        # Users collection indexes
        await cls.db.users.create_index("email", unique=True)
        
        # Chat sessions indexes
        await cls.db.chat_sessions.create_index("user_id")
        await cls.db.chat_sessions.create_index("created_at")
        
        # Chat messages indexes  
        await cls.db.chat_messages.create_index("session_id")
        await cls.db.chat_messages.create_index("created_at")
        
        logger.info("📊 Database indexes created successfully")
    
    @classmethod
    async def close(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            logger.info("🔌 MongoDB connection closed")
    
    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        """Get database instance"""
        if cls.db is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        return cls.db


# Convenience functions
async def connect_db(mongodb_uri: str, database_name: str = "nebula"):
    """Connect to database"""
    return await Database.connect(mongodb_uri, database_name)


async def close_db():
    """Close database connection"""
    await Database.close()


def get_db() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return Database.get_db()


# Create a proxy object that delegates to Database.db
class DatabaseProxy:
    """
    Proxy that allows using db.users, db.chat_sessions etc.
    Delegates all attribute access to the actual database instance.
    """
    def __getattr__(self, name):
        if Database.db is None:
            raise RuntimeError("Database not connected. Call connect_db() first.")
        return getattr(Database.db, name)
    
    @property
    def client(self):
        return Database.client


# Global db instance for easy imports
db = DatabaseProxy()
