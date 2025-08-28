#!/usr/bin/env python3
"""
Focused Admin Login Testing for Shield Foundation
Tests specifically the admin login functionality and response structure
"""

import requests
import json
import os
from datetime import datetime
import jwt

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

# Test credentials
TEST_ADMIN_LOGIN = {
    "username": "admin",
    "password": "admin123"
}

class AdminLoginTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {json.dumps(details, indent=2)}")
    
    def test_admin_user_exists(self):
        """Test if admin user exists by attempting login"""
        try:
            response = self.session.post(f"{API_BASE}/admin/login", json=TEST_ADMIN_LOGIN)
            if response.status_code == 200:
                self.log_result("Admin User Exists", True, "Admin user exists in database")
                return True
            elif response.status_code == 401:
                self.log_result("Admin User Exists", False, "Admin user does not exist or credentials are wrong")
                return False
            else:
                self.log_result("Admin User Exists", False, f"Unexpected HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Admin User Exists", False, "Request failed", str(e))
            return False
    
    def test_admin_login_response_structure(self):
        """Test admin login response structure matches LoginResponse model"""
        try:
            response = self.session.post(f"{API_BASE}/admin/login", json=TEST_ADMIN_LOGIN)
            if response.status_code == 200:
                data = response.json()
                
                # Expected fields according to LoginResponse model
                expected_fields = ["message", "success", "user", "token"]
                actual_fields = list(data.keys())
                
                # Check if all expected fields are present
                missing_fields = [field for field in expected_fields if field not in actual_fields]
                extra_fields = [field for field in actual_fields if field not in expected_fields]
                
                if missing_fields:
                    self.log_result("Response Structure", False, 
                                  f"Missing fields: {missing_fields}", 
                                  {"expected": expected_fields, "actual": actual_fields, "response": data})
                    return False, data
                elif extra_fields:
                    self.log_result("Response Structure", True, 
                                  f"Response has extra fields: {extra_fields} (not critical)", 
                                  {"expected": expected_fields, "actual": actual_fields, "response": data})
                    return True, data
                else:
                    self.log_result("Response Structure", True, "Response structure matches LoginResponse model exactly")
                    return True, data
            else:
                self.log_result("Response Structure", False, f"HTTP {response.status_code}", response.text)
                return False, None
        except Exception as e:
            self.log_result("Response Structure", False, "Request failed", str(e))
            return False, None
    
    def test_jwt_token_creation(self, token):
        """Test JWT token creation and basic validation"""
        if not token:
            self.log_result("JWT Token Creation", False, "No token provided")
            return False
        
        try:
            # Decode token without verification to check structure
            decoded = jwt.decode(token, options={"verify_signature": False})
            
            # Check required fields
            required_fields = ["sub", "role", "exp"]
            missing_fields = [field for field in required_fields if field not in decoded]
            
            if missing_fields:
                self.log_result("JWT Token Creation", False, 
                              f"Token missing required fields: {missing_fields}", 
                              {"token_payload": decoded})
                return False
            
            # Check if token is properly formatted
            if decoded.get("sub") == "admin" and decoded.get("role") == "super_admin":
                self.log_result("JWT Token Creation", True, "JWT token created with correct payload")
                return True
            else:
                self.log_result("JWT Token Creation", False, 
                              "JWT token payload incorrect", 
                              {"expected_sub": "admin", "actual_sub": decoded.get("sub"),
                               "expected_role": "super_admin", "actual_role": decoded.get("role")})
                return False
                
        except Exception as e:
            self.log_result("JWT Token Creation", False, "Token decode failed", str(e))
            return False
    
    def test_jwt_token_validation(self, token):
        """Test JWT token validation by making authenticated request"""
        if not token:
            self.log_result("JWT Token Validation", False, "No token provided")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {token}"}
            response = self.session.get(f"{API_BASE}/admin/news", headers=headers)
            
            if response.status_code == 200:
                self.log_result("JWT Token Validation", True, "JWT token validates successfully for protected routes")
                return True
            elif response.status_code == 401:
                self.log_result("JWT Token Validation", False, "JWT token validation failed - token rejected")
                return False
            elif response.status_code == 403:
                self.log_result("JWT Token Validation", False, "JWT token valid but insufficient permissions")
                return False
            else:
                self.log_result("JWT Token Validation", False, f"Unexpected HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("JWT Token Validation", False, "Request failed", str(e))
            return False
    
    def test_user_object_structure(self, user_data):
        """Test user object structure in response"""
        if not user_data:
            self.log_result("User Object Structure", False, "No user data provided")
            return False
        
        # Expected fields according to AdminUser model
        expected_fields = ["id", "username", "name", "role", "created_at", "last_login"]
        actual_fields = list(user_data.keys())
        
        missing_fields = [field for field in expected_fields if field not in actual_fields]
        
        if missing_fields:
            self.log_result("User Object Structure", False, 
                          f"User object missing fields: {missing_fields}", 
                          {"expected": expected_fields, "actual": actual_fields, "user_data": user_data})
            return False
        else:
            # Check specific values
            if user_data.get("username") == "admin" and user_data.get("role") == "super_admin":
                self.log_result("User Object Structure", True, "User object structure and values correct")
                return True
            else:
                self.log_result("User Object Structure", False, 
                              "User object structure correct but values unexpected", 
                              {"user_data": user_data})
                return False
    
    def run_focused_tests(self):
        """Run focused admin login tests"""
        print(f"🔐 Starting Focused Admin Login Tests for Shield Foundation")
        print(f"📍 Testing API at: {API_BASE}")
        print(f"👤 Testing with credentials: {TEST_ADMIN_LOGIN['username']}/{'*' * len(TEST_ADMIN_LOGIN['password'])}")
        print("=" * 70)
        
        # Test 1: Check if admin user exists
        admin_exists = self.test_admin_user_exists()
        
        if not admin_exists:
            print("\n❌ Cannot proceed with further tests - admin user does not exist")
            return False
        
        # Test 2: Test response structure
        structure_ok, response_data = self.test_admin_login_response_structure()
        
        if not structure_ok or not response_data:
            print("\n❌ Cannot proceed with token tests - login response invalid")
            return False
        
        # Extract token and user data for further tests
        token = response_data.get("token")
        user_data = response_data.get("user")
        
        # Test 3: Test user object structure
        self.test_user_object_structure(user_data)
        
        # Test 4: Test JWT token creation
        self.test_jwt_token_creation(token)
        
        # Test 5: Test JWT token validation
        self.test_jwt_token_validation(token)
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 FOCUSED TEST SUMMARY")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n🎯 KEY FINDINGS:")
        if response_data:
            print(f"  • Response includes 'success' field: {'success' in response_data}")
            print(f"  • Response includes 'message' field: {'message' in response_data}")
            print(f"  • Response includes 'user' field: {'user' in response_data}")
            print(f"  • Response includes 'token' field: {'token' in response_data}")
            
            if 'success' not in response_data:
                print("\n⚠️  CRITICAL ISSUE IDENTIFIED:")
                print("   The backend response is missing the 'success' field that the frontend expects!")
                print("   Frontend checks for 'response.success' but backend doesn't return it.")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = AdminLoginTester()
    success = tester.run_focused_tests()