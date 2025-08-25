"""
Tests for API endpoints
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime
import json
import os
from pathlib import Path

# Import the app
import sys
sys.path.append(str(Path(__file__).parent.parent))
from server import app

client = TestClient(app)

"""
Contact form endpoint tests removed. Contact submissions are now handled client-side via Web3Forms.
"""


class TestResourceEndpoints:
    """Test resource management endpoints"""
    
    def test_get_resources(self):
        """Test getting all resources"""
        mock_resources = [
            {
                "id": "resource-1",
                "title": "Test Resource",
                "description": "Test description",
                "type": "pdf",
                "category": "white-paper",
                "file_path": "test.pdf",
                "download_count": 5,
                "featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "metadata": {}
            }
        ]
        
        with patch('server.db') as mock_db:
            mock_db.resources.find.return_value.to_list = AsyncMock(return_value=mock_resources)
            
            response = client.get("/api/resources")
            
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 1
            assert data[0]["title"] == "Test Resource"

    def test_get_resources_filtered_by_category(self):
        """Test getting resources filtered by category"""
        mock_resources = [
            {
                "id": "resource-1",
                "title": "White Paper",
                "category": "white-paper",
                "description": "Test",
                "type": "pdf",
                "file_path": "test.pdf",
                "download_count": 0,
                "featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "metadata": {}
            }
        ]
        
        with patch('server.db') as mock_db:
            mock_db.resources.find.return_value.to_list = AsyncMock(return_value=mock_resources)
            
            response = client.get("/api/resources?category=white-paper")
            
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 1
            assert data[0]["category"] == "white-paper"

    def test_get_resources_filtered_by_featured(self):
        """Test getting featured resources"""
        mock_resources = [
            {
                "id": "resource-1",
                "title": "Featured Resource",
                "category": "white-paper",
                "description": "Test",
                "type": "pdf",
                "file_path": "test.pdf",
                "download_count": 0,
                "featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "metadata": {}
            }
        ]
        
        with patch('server.db') as mock_db:
            mock_db.resources.find.return_value.to_list = AsyncMock(return_value=mock_resources)
            
            response = client.get("/api/resources?featured=true")
            
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 1
            assert data[0]["featured"] is True

    def test_get_resource_by_id(self):
        """Test getting specific resource by ID"""
        mock_resource = {
            "id": "resource-1",
            "title": "Test Resource",
            "description": "Test description",
            "type": "pdf",
            "category": "white-paper",
            "file_path": "test.pdf",
            "download_count": 5,
            "featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "metadata": {}
        }
        
        with patch('server.db') as mock_db:
            mock_db.resources.find_one = AsyncMock(return_value=mock_resource)
            
            response = client.get("/api/resources/resource-1")
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == "resource-1"
            assert data["title"] == "Test Resource"

    def test_get_resource_not_found(self):
        """Test getting non-existent resource"""
        with patch('server.db') as mock_db:
            mock_db.resources.find_one = AsyncMock(return_value=None)
            
            response = client.get("/api/resources/non-existent")
            
            assert response.status_code == 404
            assert "Resource not found" in response.json()["detail"]

    def test_create_resource(self):
        """Test creating a new resource"""
        resource_data = {
            "title": "New Resource",
            "description": "New description",
            "type": "pdf",
            "category": "guide",
            "file_path": "new-resource.pdf",
            "featured": False
        }
        
        with patch('server.db') as mock_db:
            mock_db.resources.insert_one = AsyncMock()
            
            response = client.post("/api/resources", json=resource_data)
            
            assert response.status_code == 200
            data = response.json()
            assert data["title"] == "New Resource"
            assert "id" in data
            assert "created_at" in data

    @patch('server.Path')
    def test_download_resource_success(self, mock_path):
        """Test successful resource download"""
        mock_resource = {
            "id": "resource-1",
            "title": "Test Resource",
            "file_path": "test.pdf",
            "category": "white-paper",
            "download_count": 5
        }
        
        # Mock file exists
        mock_file_path = MagicMock()
        mock_file_path.exists.return_value = True
        mock_path.return_value = mock_file_path
        
        with patch('server.db') as mock_db, \
             patch('server.FileResponse') as mock_file_response:
            
            mock_db.resources.find_one = AsyncMock(return_value=mock_resource)
            mock_db.resource_downloads.insert_one = AsyncMock()
            mock_db.link_interactions.insert_one = AsyncMock()
            mock_db.resources.update_one = AsyncMock()
            
            mock_file_response.return_value = "file_response"
            
            response = client.get("/api/resources/resource-1/download")
            
            assert response.status_code == 200

    def test_download_resource_not_found(self):
        """Test downloading non-existent resource"""
        with patch('server.db') as mock_db:
            mock_db.resources.find_one = AsyncMock(return_value=None)
            
            response = client.get("/api/resources/non-existent/download")
            
            assert response.status_code == 404
            assert "Resource not found" in response.json()["detail"]

    @patch('server.Path')
    def test_download_resource_file_not_found(self, mock_path):
        """Test downloading resource when file doesn't exist"""
        mock_resource = {
            "id": "resource-1",
            "title": "Test Resource",
            "file_path": "missing.pdf",
            "category": "white-paper"
        }
        
        # Mock file doesn't exist
        mock_file_path = MagicMock()
        mock_file_path.exists.return_value = False
        mock_path.return_value = mock_file_path
        
        with patch('server.db') as mock_db:
            mock_db.resources.find_one = AsyncMock(return_value=mock_resource)
            
            response = client.get("/api/resources/resource-1/download")
            
            assert response.status_code == 404
            assert "File not found" in response.json()["detail"]

    def test_get_resource_stats(self):
        """Test getting resource download statistics"""
        mock_resource = {
            "id": "resource-1",
            "title": "Test Resource",
            "download_count": 10
        }
        
        mock_downloads = [
            {"resource_id": "resource-1", "timestamp": datetime.utcnow()},
            {"resource_id": "resource-1", "timestamp": datetime.utcnow()}
        ]
        
        with patch('server.db') as mock_db:
            mock_db.resources.find_one = AsyncMock(return_value=mock_resource)
            mock_db.resource_downloads.count_documents = AsyncMock(return_value=15)
            mock_db.resource_downloads.find.return_value.sort.return_value.limit.return_value.to_list = AsyncMock(return_value=mock_downloads)
            
            response = client.get("/api/resources/resource-1/stats")
            
            assert response.status_code == 200
            data = response.json()
            assert data["resource_id"] == "resource-1"
            assert data["total_downloads"] == 15
            assert data["resource_download_count"] == 10
            assert len(data["recent_downloads"]) == 2


class TestAnalyticsEndpoints:
    """Test analytics and tracking endpoints"""
    
    def test_track_event(self):
        """Test tracking analytics event"""
        event_data = {
            "event_type": "button_click",
            "element_id": "schedule-btn",
            "session_id": "session-123",
            "page_url": "https://example.com",
            "metadata": {
                "button_text": "Schedule Consultation"
            }
        }
        
        with patch('server.db') as mock_db:
            mock_db.analytics_events.insert_one = AsyncMock()
            
            response = client.post("/api/analytics/track", json=event_data)
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "tracked"
            assert "event_id" in data

    def test_track_link_click(self):
        """Test tracking link click"""
        link_data = {
            "link_id": "external-link",
            "link_category": "external",
            "url": "https://example.com",
            "session_id": "session-123",
            "metadata": {
                "source": "footer"
            }
        }
        
        with patch('server.db') as mock_db:
            mock_db.link_interactions.insert_one = AsyncMock()
            
            response = client.post("/api/analytics/link-click", json=link_data)
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "tracked"
            assert "interaction_id" in data

    def test_get_analytics_dashboard(self):
        """Test getting analytics dashboard data"""
        mock_resources = [
            {"title": "Resource 1", "download_count": 10},
            {"title": "Resource 2", "download_count": 5}
        ]
        
        mock_interaction_categories = [
            {"_id": "download", "count": 50},
            {"_id": "external", "count": 30}
        ]
        
        with patch('server.db') as mock_db:
            mock_db.resource_downloads.count_documents = AsyncMock(return_value=100)
            mock_db.resources.find.return_value.sort.return_value.limit.return_value.to_list = AsyncMock(return_value=mock_resources)
            mock_db.link_interactions.count_documents = AsyncMock(return_value=200)
            mock_db.link_interactions.aggregate.return_value.to_list = AsyncMock(return_value=mock_interaction_categories)
            mock_db.resource_downloads.find.return_value.sort.return_value.limit.return_value.to_list = AsyncMock(return_value=[])
            mock_db.link_interactions.find.return_value.sort.return_value.limit.return_value.to_list = AsyncMock(return_value=[])
            
            response = client.get("/api/analytics/dashboard")
            
            assert response.status_code == 200
            data = response.json()
            assert "summary" in data
            assert data["summary"]["total_downloads"] == 100
            assert data["summary"]["total_interactions"] == 200
            assert len(data["interaction_categories"]) == 2

    def test_get_resource_analytics(self):
        """Test getting detailed resource analytics"""
        mock_downloads_by_category = [
            {"_id": "white-paper", "count": 30},
            {"_id": "case-study", "count": 20}
        ]
        
        mock_most_downloaded = [
            {"title": "Popular Resource", "download_count": 50}
        ]
        
        with patch('server.db') as mock_db:
            mock_db.resource_downloads.aggregate.return_value.to_list = AsyncMock(return_value=mock_downloads_by_category)
            mock_db.resources.find.return_value.sort.return_value.limit.return_value.to_list = AsyncMock(return_value=mock_most_downloaded)
            mock_db.resource_downloads.find.return_value.sort.return_value.to_list = AsyncMock(return_value=[])
            
            response = client.get("/api/analytics/resources")
            
            assert response.status_code == 200
            data = response.json()
            assert len(data["downloads_by_category"]) == 2
            assert len(data["most_downloaded"]) == 1
            assert "recent_downloads_count" in data


class TestStatusEndpoints:
    """Test status check endpoints"""
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        response = client.get("/api/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "TrustML API is running"

    def test_create_status_check(self):
        """Test creating status check"""
        status_data = {
            "client_name": "test-client"
        }
        
        with patch('server.db') as mock_db:
            mock_db.status_checks.insert_one = AsyncMock()
            
            response = client.post("/api/status", json=status_data)
            
            assert response.status_code == 200
            data = response.json()
            assert data["client_name"] == "test-client"
            assert "id" in data
            assert "timestamp" in data

    def test_get_status_checks(self):
        """Test getting status checks"""
        mock_status_checks = [
            {
                "id": "status-1",
                "client_name": "test-client",
                "timestamp": datetime.utcnow()
            }
        ]
        
        with patch('server.db') as mock_db:
            mock_db.status_checks.find.return_value.to_list = AsyncMock(return_value=mock_status_checks)
            
            response = client.get("/api/status")
            
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 1
            assert data[0]["client_name"] == "test-client"


class TestErrorHandling:
    """Test API error handling"""
    pass


class TestRequestValidation:
    """Test request validation and sanitization"""
    pass


if __name__ == "__main__":
    pytest.main([__file__])