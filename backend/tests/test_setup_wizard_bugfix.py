"""
Test Setup Wizard Bug Fix - Iteration 6
Tests for the setup wizard admin creation / post-setup flow fix

Bug Fix Summary:
- SETUP_COMPLETE=true was being set in Step 2 (database config) BEFORE admin was created in Step 3
- If page reloaded between steps, wizard got stuck - couldn't re-run setup (403) and couldn't proceed (no admin)
- Fix: moved SETUP_COMPLETE=true to only be set AFTER admin creation
- Also added intermediate state detection so wizard auto-skips to step 3 if DB is configured but no admin exists

Test Cases:
1. GET /api/setup/status returns correct state flags
2. POST /api/setup/initialize returns 403 when truly complete (admin exists)
3. POST /api/setup/create-admin handles existing admin gracefully (returns success, not 400)
4. POST /api/auth/login still works (admin@erp.com / admin123)
5. No regressions: health endpoint, settings, products, all core APIs still work
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestSetupStatusEndpoint:
    """Test GET /api/setup/status returns correct state flags"""
    
    def test_setup_status_returns_all_flags(self):
        """GET /api/setup/status should return all required flags"""
        response = requests.get(f"{BASE_URL}/api/setup/status")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        
        # Verify all expected fields exist
        required_fields = ["configured", "database_ready", "has_admin", "business_name", "setup_complete"]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
        
        print(f"Setup status response: {data}")
    
    def test_setup_status_configured_true(self):
        """configured flag should be true when Supabase is connected"""
        response = requests.get(f"{BASE_URL}/api/setup/status")
        data = response.json()
        assert data["configured"] == True, f"Expected configured=True, got {data['configured']}"
    
    def test_setup_status_database_ready_true(self):
        """database_ready flag should be true when tables exist"""
        response = requests.get(f"{BASE_URL}/api/setup/status")
        data = response.json()
        assert data["database_ready"] == True, f"Expected database_ready=True, got {data['database_ready']}"
    
    def test_setup_status_has_admin_true(self):
        """has_admin flag should be true when admin user exists"""
        response = requests.get(f"{BASE_URL}/api/setup/status")
        data = response.json()
        assert data["has_admin"] == True, f"Expected has_admin=True, got {data['has_admin']}"
    
    def test_setup_status_setup_complete_true(self):
        """setup_complete should be true when env_flag + db + admin all exist"""
        response = requests.get(f"{BASE_URL}/api/setup/status")
        data = response.json()
        assert data["setup_complete"] == True, f"Expected setup_complete=True, got {data['setup_complete']}"
    
    def test_setup_status_business_name_set(self):
        """business_name should be set and not empty"""
        response = requests.get(f"{BASE_URL}/api/setup/status")
        data = response.json()
        assert data["business_name"], "Business name should not be empty"
        print(f"Business name: {data['business_name']}")


class TestSetupInitializeBlocking:
    """Test POST /api/setup/initialize returns 403 when truly complete"""
    
    def test_setup_initialize_blocked_when_complete(self):
        """POST /api/setup/initialize should return 403 when admin exists"""
        response = requests.post(
            f"{BASE_URL}/api/setup/initialize",
            json={
                "business_name": "Test Business",
                "supabase_url": "https://test.supabase.co",
                "supabase_key": "test_key"
            }
        )
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        # Should mention "already completed" or "cannot re-run"
        detail_lower = data["detail"].lower()
        assert "already completed" in detail_lower or "cannot re-run" in detail_lower, \
            f"Expected 'already completed' or 'cannot re-run' in detail, got: {data['detail']}"
        print(f"Setup initialize correctly blocked: {data['detail']}")


class TestCreateAdminGracefulHandling:
    """Test POST /api/setup/create-admin handles existing admin gracefully"""
    
    def test_create_admin_returns_success_when_admin_exists(self):
        """POST /api/setup/create-admin should return success (not 400) when admin exists"""
        response = requests.post(
            f"{BASE_URL}/api/setup/create-admin",
            json={
                "name": "Test Admin",
                "email": "test_admin@test.com",
                "password": "testpass123"
            }
        )
        # BUG FIX: Should return 200 with existing admin info, not 400
        assert response.status_code == 200, f"Expected 200 (graceful handling), got {response.status_code}: {response.text}"
        data = response.json()
        
        # Should return admin info
        assert "id" in data, "Response should contain admin id"
        assert "role" in data, "Response should contain role"
        assert data["role"] == "admin", f"Expected role=admin, got {data['role']}"
        
        # Email might be "existing" to indicate existing admin was found
        print(f"Create admin graceful response: {data}")


class TestAuthLoginStillWorks:
    """Test POST /api/auth/login still works after bug fix"""
    
    def test_login_with_admin_credentials(self):
        """Login with admin@erp.com / admin123 should succeed"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "admin@erp.com",
                "password": "admin123"
            }
        )
        assert response.status_code == 200, f"Login failed: {response.status_code} - {response.text}"
        data = response.json()
        
        assert "token" in data, "Response should contain token"
        assert "user" in data, "Response should contain user"
        assert data["user"]["email"] == "admin@erp.com"
        assert data["user"]["role"] == "admin"
        print(f"Login successful: {data['user']['email']}")
    
    def test_login_with_invalid_credentials(self):
        """Login with invalid credentials should return 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "invalid@email.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestNoRegressions:
    """Test no regressions in core APIs after bug fix"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for tests"""
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@erp.com", "password": "admin123"}
        )
        if login_response.status_code == 200:
            self.token = login_response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            pytest.skip("Could not authenticate")
    
    def test_health_endpoint(self):
        """GET /api/health should return healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        print(f"Health: {data}")
    
    def test_settings_endpoint(self):
        """GET /api/settings should return settings"""
        response = requests.get(f"{BASE_URL}/api/settings", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        print(f"Settings keys: {list(data.keys())}")
    
    def test_products_endpoint(self):
        """GET /api/products should return products"""
        response = requests.get(f"{BASE_URL}/api/products", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "total" in data
        print(f"Products total: {data['total']}")
    
    def test_locations_endpoint(self):
        """GET /api/locations should return locations"""
        response = requests.get(f"{BASE_URL}/api/locations", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Locations count: {len(data)}")
    
    def test_users_endpoint(self):
        """GET /api/users should return users"""
        response = requests.get(f"{BASE_URL}/api/users", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Users count: {len(data)}")
    
    def test_dashboard_stats_endpoint(self):
        """GET /api/dashboard/stats should return stats"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "today_revenue" in data
        assert "total_products" in data
        print(f"Dashboard stats: {data}")
    
    def test_inventory_endpoint(self):
        """GET /api/inventory should return inventory"""
        response = requests.get(f"{BASE_URL}/api/inventory", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        print(f"Inventory total: {data['total']}")
    
    def test_sales_endpoint(self):
        """GET /api/sales should return sales"""
        response = requests.get(f"{BASE_URL}/api/sales", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        print(f"Sales total: {data['total']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
