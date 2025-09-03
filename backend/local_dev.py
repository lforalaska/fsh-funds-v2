"""Local development server for FastAPI application."""
import os
import sys
import subprocess
from pathlib import Path

def main():
    """Start the FastAPI development server with hot reload."""
    print("🚀 Starting FastAPI Boilerplate Development Server...")
    print("📍 API will be available at: http://localhost:8000")
    print("📖 API Documentation at: http://localhost:8000/docs")
    print("🔄 Hot reload is enabled - changes will restart the server")
    print("-" * 60)
    
    # Set environment variables for development
    os.environ.setdefault("ENVIRONMENT", "development")
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    try:
        # Start uvicorn with hot reload and enhanced logging
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "api.main:app",
            "--reload",
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--log-level", "info",
            "--access-log",
            "--use-colors"
        ])
    except KeyboardInterrupt:
        print("\n👋 Development server stopped.")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()