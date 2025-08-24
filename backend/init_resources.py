#!/usr/bin/env python3
"""
Initialize the resource database with sample resources
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime
import uuid

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample resources data
SAMPLE_RESOURCES = [
    {
        "id": str(uuid.uuid4()),
        "title": "GameVerse Marketplace Security Case Study",
        "description": "Comprehensive analysis of implementing fraud detection and trust & safety measures for a gaming marketplace platform.",
        "type": "pdf",
        "category": "case-studies",
        "file_path": "case-studies/gameverse-case-study.pdf",
        "file_size": 2048000,  # 2MB
        "featured": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "download_count": 0,
        "metadata": {
            "industry": "Gaming",
            "company_size": "Series B Startup",
            "implementation_time": "6 months",
            "fraud_reduction": "85%"
        }
    },
    {
        "id": str(uuid.uuid4()),
        "title": "E-commerce Fraud Detection Implementation",
        "description": "Real-world case study of implementing ML-based fraud detection for a major e-commerce platform.",
        "type": "pdf",
        "category": "case-studies",
        "file_path": "case-studies/ecommerce-fraud-detection.pdf",
        "file_size": 1536000,  # 1.5MB
        "featured": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "download_count": 0,
        "metadata": {
            "industry": "E-commerce",
            "company_size": "Fortune 500",
            "implementation_time": "12 months",
            "fraud_reduction": "92%"
        }
    },
    {
        "id": str(uuid.uuid4()),
        "title": "AI-Powered Fraud Detection Guide",
        "description": "Complete guide to implementing artificial intelligence and machine learning for fraud detection in digital marketplaces.",
        "type": "pdf",
        "category": "whitepapers",
        "file_path": "whitepapers/ai-fraud-detection-guide.pdf",
        "file_size": 3072000,  # 3MB
        "featured": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "download_count": 0,
        "metadata": {
            "pages": 45,
            "topics": ["Machine Learning", "Fraud Detection", "Risk Assessment"],
            "level": "Intermediate to Advanced"
        }
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Marketplace Trust & Safety Playbook",
        "description": "Essential strategies and best practices for building trust and safety systems in online marketplaces.",
        "type": "pdf",
        "category": "guides",
        "file_path": "guides/marketplace-trust-safety-playbook.pdf",
        "file_size": 2560000,  # 2.5MB
        "featured": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "download_count": 0,
        "metadata": {
            "pages": 32,
            "topics": ["Trust & Safety", "Policy Development", "User Protection"],
            "level": "Beginner to Intermediate"
        }
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Scaling Trust & Safety Operations",
        "description": "Presentation on strategies for scaling trust and safety operations in high-growth marketplaces.",
        "type": "pdf",
        "category": "presentations",
        "file_path": "presentations/scaling-trust-safety.pdf",
        "file_size": 5120000,  # 5MB
        "featured": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "download_count": 0,
        "metadata": {
            "slides": 28,
            "event": "Trust & Safety Summit 2024",
            "topics": ["Operations Scaling", "Team Building", "Process Optimization"]
        }
    }
]

async def init_resources():
    """Initialize the database with sample resources"""
    print("Initializing resource database...")
    
    # Clear existing resources (optional - remove in production)
    await db.resources.delete_many({})
    print("Cleared existing resources")
    
    # Insert sample resources
    result = await db.resources.insert_many(SAMPLE_RESOURCES)
    print(f"Inserted {len(result.inserted_ids)} resources")
    
    # Create indexes for better performance
    await db.resources.create_index("category")
    await db.resources.create_index("featured")
    await db.resources.create_index("id", unique=True)
    await db.resource_downloads.create_index("resource_id")
    await db.resource_downloads.create_index("timestamp")
    print("Created database indexes")
    
    print("Resource initialization complete!")

async def main():
    try:
        await init_resources()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())