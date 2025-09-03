"""Test main application."""
import pytest
from fastapi.testclient import TestClient
from api.main import app


client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI Boilerplate is running!"}


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "fastapi-boilerplate"