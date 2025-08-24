#!/usr/bin/env python3
"""
Test script for analytics and resource management functionality
"""

import asyncio
import aiohttp
import json
from datetime import datetime
import uuid

BASE_URL = "http://localhost:8000/api"

async def test_resource_endpoints():
    """Test resource management endpoints"""
    async with aiohttp.ClientSession() as session:
        print("Testing resource endpoints...")
        
        # Test getting all resources
        async with session.get(f"{BASE_URL}/resources") as resp:
            if resp.status == 200:
                resources = await resp.json()
                print(f"✓ Found {len(resources)} resources")
                
                if resources:
                    resource_id = resources[0]["id"]
                    
                    # Test getting specific resource
                    async with session.get(f"{BASE_URL}/resources/{resource_id}") as resp2:
                        if resp2.status == 200:
                            print("✓ Successfully retrieved specific resource")
                        else:
                            print(f"✗ Failed to get specific resource: {resp2.status}")
                    
                    # Test resource stats
                    async with session.get(f"{BASE_URL}/resources/{resource_id}/stats") as resp3:
                        if resp3.status == 200:
                            stats = await resp3.json()
                            print(f"✓ Resource stats: {stats['total_downloads']} downloads")
                        else:
                            print(f"✗ Failed to get resource stats: {resp3.status}")
            else:
                print(f"✗ Failed to get resources: {resp.status}")

async def test_analytics_endpoints():
    """Test analytics tracking endpoints"""
    async with aiohttp.ClientSession() as session:
        print("\nTesting analytics endpoints...")
        
        session_id = str(uuid.uuid4())
        
        # Test event tracking
        event_data = {
            "event_type": "page_view",
            "element_id": "homepage",
            "session_id": session_id,
            "page_url": "/",
            "metadata": {"test": True}
        }
        
        async with session.post(f"{BASE_URL}/analytics/track", json=event_data) as resp:
            if resp.status == 200:
                result = await resp.json()
                print(f"✓ Event tracked: {result['event_id']}")
            else:
                print(f"✗ Failed to track event: {resp.status}")
        
        # Test link click tracking
        link_data = {
            "session_id": session_id,
            "link_id": "test-button",
            "link_category": "action",
            "metadata": {"button_text": "Test Button"}
        }
        
        async with session.post(f"{BASE_URL}/analytics/link-click", json=link_data) as resp:
            if resp.status == 200:
                result = await resp.json()
                print(f"✓ Link click tracked: {result['interaction_id']}")
            else:
                print(f"✗ Failed to track link click: {resp.status}")
        
        # Test analytics dashboard
        async with session.get(f"{BASE_URL}/analytics/dashboard") as resp:
            if resp.status == 200:
                dashboard = await resp.json()
                print(f"✓ Dashboard data retrieved")
                print(f"  - Total downloads: {dashboard['summary']['total_downloads']}")
                print(f"  - Total interactions: {dashboard['summary']['total_interactions']}")
            else:
                print(f"✗ Failed to get dashboard: {resp.status}")

async def simulate_user_activity():
    """Simulate some user activity for testing"""
    async with aiohttp.ClientSession() as session:
        print("\nSimulating user activity...")
        
        # Simulate multiple sessions
        for i in range(3):
            session_id = str(uuid.uuid4())
            
            # Track page view
            await session.post(f"{BASE_URL}/analytics/track", json={
                "event_type": "page_view",
                "element_id": "homepage",
                "session_id": session_id,
                "page_url": "/"
            })
            
            # Track some link clicks
            for link_id in ["nav-about", "nav-services", "schedule-consultation"]:
                await session.post(f"{BASE_URL}/analytics/link-click", json={
                    "session_id": session_id,
                    "link_id": link_id,
                    "link_category": "navigation" if link_id.startswith("nav") else "action"
                })
        
        print("✓ Simulated user activity")

async def main():
    """Run all tests"""
    try:
        await test_resource_endpoints()
        await test_analytics_endpoints()
        await simulate_user_activity()
        print("\n✓ All tests completed!")
    except aiohttp.ClientConnectorError:
        print("✗ Could not connect to server. Make sure the backend is running on localhost:8000")
    except Exception as e:
        print(f"✗ Test failed with error: {e}")

if __name__ == "__main__":
    asyncio.run(main())