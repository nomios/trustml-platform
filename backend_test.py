import requests
import sys
from datetime import datetime
import json

class TrustMLAPITester:
    def __init__(self, base_url="https://content-refresh-7.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response Data: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"Response Text: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response Text: {response.text[:500]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        return success

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data=test_data
        )
        
        if success and 'id' in response:
            print(f"Created status check with ID: {response['id']}")
            return response['id']
        return None

    def test_get_status_checks(self):
        """Test getting all status checks"""
        success, response = self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} status checks")
        return success

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "company": "Test Company",
            "role": "Developer",
            "interested_in": "Fraud Detection",
            "message": "This is a test message for the contact form."
        }
        
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "api/contact",
            200,
            data=test_data
        )
        
        if success and 'id' in response:
            print(f"Created contact form with ID: {response['id']}")
            return response['id']
        return None

    def test_get_contact_forms(self):
        """Test getting all contact forms"""
        success, response = self.run_test(
            "Get Contact Forms",
            "GET",
            "api/contact",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} contact forms")
        return success

def main():
    print("🚀 Starting TrustML API Testing...")
    print("=" * 50)
    
    # Setup
    tester = TrustMLAPITester()

    # Test sequence
    print("\n📋 Testing API Endpoints:")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test status check endpoints
    status_id = tester.test_create_status_check()
    tester.test_get_status_checks()
    
    # Test contact form endpoints
    contact_id = tester.test_contact_form_submission()
    tester.test_get_contact_forms()

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results:")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend API is working correctly.")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} test(s) failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())