from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from fastapi import HTTPException, Response, Request
from fastapi.responses import FileResponse
import os
from pathlib import Path
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
# Support either MONGO_URL or MONGODB_URI and provide a safe default for DB_NAME
mongo_url = os.getenv('MONGO_URL') or os.getenv('MONGODB_URI')
if not mongo_url:
    raise RuntimeError("Missing MongoDB connection string. Set MONGO_URL or MONGODB_URI.")

client = AsyncIOMotorClient(mongo_url)
db_name = os.getenv('DB_NAME', 'trustml_db')
db = client[db_name]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

"""
Removed legacy ContactForm models and endpoints; contact submissions are now handled via Web3Forms on the frontend.
"""

# Resource Management Models
class Resource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    type: str  # pdf, video, document, etc.
    category: str  # case-studies, whitepapers, presentations, guides
    file_path: str
    file_size: Optional[int] = None
    download_count: int = 0
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict = Field(default_factory=dict)

class ResourceCreate(BaseModel):
    title: str
    description: str
    type: str
    category: str
    file_path: str
    file_size: Optional[int] = None
    featured: bool = False
    metadata: dict = Field(default_factory=dict)

class ResourceDownload(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    resource_id: str
    session_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class LinkInteraction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: Optional[str] = None
    link_id: str
    link_category: str
    action_type: str  # click, download, view, etc.
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    metadata: dict = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AnalyticsEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    element_id: str
    session_id: Optional[str] = None
    page_url: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    metadata: dict = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "TrustML API is running"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Check database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "service": "trustml-backend",
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unavailable")

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Legacy contact form endpoints removed. All contact submissions should be handled client-side.

# Resource Management Endpoints
@api_router.get("/resources", response_model=List[Resource])
async def get_resources(category: Optional[str] = None, featured: Optional[bool] = None):
    """Get all resources with optional filtering by category and featured status"""
    filter_query = {}
    if category:
        filter_query["category"] = category
    if featured is not None:
        filter_query["featured"] = featured
    
    resources = await db.resources.find(filter_query).to_list(1000)
    return [Resource(**resource) for resource in resources]

@api_router.get("/resources/{resource_id}", response_model=Resource)
async def get_resource(resource_id: str):
    """Get a specific resource by ID"""
    resource = await db.resources.find_one({"id": resource_id})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return Resource(**resource)

@api_router.post("/resources", response_model=Resource)
async def create_resource(resource_data: ResourceCreate):
    """Create a new resource"""
    resource_dict = resource_data.dict()
    resource_obj = Resource(**resource_dict)
    await db.resources.insert_one(resource_obj.dict())
    return resource_obj

@api_router.get("/resources/{resource_id}/download")
async def download_resource(resource_id: str, request: Request, session_id: Optional[str] = None):
    """Download a resource and track the download"""
    # Get resource from database
    resource = await db.resources.find_one({"id": resource_id})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Construct file path
    file_path = Path(ROOT_DIR) / "public" / "resources" / resource["file_path"]
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Extract request information for tracking
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    referrer = request.headers.get("referer")
    
    # Track download
    download_record = ResourceDownload(
        resource_id=resource_id,
        session_id=session_id,
        ip_address=client_ip,
        user_agent=user_agent,
        referrer=referrer
    )
    await db.resource_downloads.insert_one(download_record.dict())
    
    # Track as link interaction
    interaction_record = LinkInteraction(
        session_id=session_id,
        link_id=f"download-{resource_id}",
        link_category="download",
        action_type="download",
        ip_address=client_ip,
        user_agent=user_agent,
        referrer=referrer,
        metadata={
            "resource_title": resource["title"],
            "resource_category": resource["category"],
            "file_size": resource.get("file_size", 0)
        }
    )
    await db.link_interactions.insert_one(interaction_record.dict())
    
    # Increment download counter
    await db.resources.update_one(
        {"id": resource_id},
        {"$inc": {"download_count": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Return file
    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type='application/octet-stream'
    )

@api_router.get("/resources/{resource_id}/stats")
async def get_resource_stats(resource_id: str):
    """Get download statistics for a resource"""
    resource = await db.resources.find_one({"id": resource_id})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Get download count and recent downloads
    total_downloads = await db.resource_downloads.count_documents({"resource_id": resource_id})
    recent_downloads = await db.resource_downloads.find(
        {"resource_id": resource_id}
    ).sort("timestamp", -1).limit(10).to_list(10)
    
    return {
        "resource_id": resource_id,
        "total_downloads": total_downloads,
        "resource_download_count": resource.get("download_count", 0),
        "recent_downloads": recent_downloads
    }

# Analytics and Tracking Endpoints
@api_router.post("/analytics/track")
async def track_event(request: Request, event_data: dict):
    """Track a general analytics event"""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    event = AnalyticsEvent(
        event_type=event_data.get("event_type", "unknown"),
        element_id=event_data.get("element_id", ""),
        session_id=event_data.get("session_id"),
        page_url=event_data.get("page_url"),
        ip_address=client_ip,
        user_agent=user_agent,
        metadata=event_data.get("metadata", {})
    )
    
    await db.analytics_events.insert_one(event.dict())
    
    # Log scheduling events for monitoring
    if event_data.get("event_type") == "scheduling_click":
        logger.info(f"Scheduling click tracked: {event_data.get('metadata', {}).get('service_type', 'unknown')} from {client_ip}")
    
    return {"status": "tracked", "event_id": event.id}

@api_router.post("/analytics/link-click")
async def track_link_click(request: Request, link_data: dict):
    """Track a link click interaction"""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    referrer = request.headers.get("referer")
    
    interaction = LinkInteraction(
        session_id=link_data.get("session_id"),
        link_id=link_data.get("link_id", ""),
        link_category=link_data.get("link_category", "unknown"),
        action_type="click",
        ip_address=client_ip,
        user_agent=user_agent,
        referrer=referrer,
        metadata=link_data.get("metadata", {})
    )
    
    await db.link_interactions.insert_one(interaction.dict())
    return {"status": "tracked", "interaction_id": interaction.id}

@api_router.get("/analytics/dashboard")
async def get_analytics_dashboard():
    """Get analytics dashboard data"""
    # Resource download stats
    total_downloads = await db.resource_downloads.count_documents({})
    popular_resources = await db.resources.find().sort("download_count", -1).limit(5).to_list(5)
    
    # Link interaction stats
    total_interactions = await db.link_interactions.count_documents({})
    interaction_categories = await db.link_interactions.aggregate([
        {"$group": {"_id": "$link_category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]).to_list(10)
    
    # Recent activity
    recent_downloads = await db.resource_downloads.find().sort("timestamp", -1).limit(10).to_list(10)
    recent_interactions = await db.link_interactions.find().sort("timestamp", -1).limit(10).to_list(10)
    
    return {
        "summary": {
            "total_downloads": total_downloads,
            "total_interactions": total_interactions,
            "popular_resources": popular_resources
        },
        "interaction_categories": interaction_categories,
        "recent_activity": {
            "downloads": recent_downloads,
            "interactions": recent_interactions
        }
    }

@api_router.get("/analytics/resources")
async def get_resource_analytics():
    """Get detailed resource analytics"""
    # Downloads by category
    downloads_by_category = await db.resource_downloads.aggregate([
        {
            "$lookup": {
                "from": "resources",
                "localField": "resource_id",
                "foreignField": "id",
                "as": "resource"
            }
        },
        {"$unwind": "$resource"},
        {"$group": {"_id": "$resource.category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]).to_list(10)
    
    # Most downloaded resources
    most_downloaded = await db.resources.find().sort("download_count", -1).limit(10).to_list(10)
    
    # Download trends (last 30 days)
    from datetime import timedelta
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_downloads = await db.resource_downloads.find(
        {"timestamp": {"$gte": thirty_days_ago}}
    ).sort("timestamp", 1).to_list(1000)
    
    return {
        "downloads_by_category": downloads_by_category,
        "most_downloaded": most_downloaded,
        "recent_downloads_count": len(recent_downloads),
        "download_trend": recent_downloads
    }

# Include the router in the main app
app.include_router(api_router)

# Configure CORS for production
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins != '*':
    cors_origins = [origin.strip() for origin in cors_origins.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
