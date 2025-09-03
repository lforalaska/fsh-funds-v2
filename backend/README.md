# FastAPI Boilerplate

A minimal, reusable FastAPI backend boilerplate with clean architecture patterns.

## Features

- FastAPI with automatic OpenAPI documentation
- Structured project layout with separation of concerns
- Authentication system (placeholder implementation)
- Request/response logging middleware
- CORS support
- Health check endpoints
- Poetry for dependency management
- Code formatting with Black and Ruff
- Type checking with MyPy
- Testing with pytest

## Project Structure

```
backend/
├── api/
│   ├── dependencies/        # Dependency injection
│   │   └── auth.py         # Authentication dependencies
│   ├── routers/            # API route handlers
│   │   ├── auth.py         # Authentication routes
│   │   └── users.py        # User management routes
│   ├── services/           # Business logic layer
│   ├── utils/              # Utility functions
│   │   └── logger.py       # Logging utilities
│   └── main.py             # FastAPI application setup
├── models/                 # SQLModel database models
│   ├── base.py             # Base model class
│   └── user.py             # User model
├── repositories/           # Data access layer
│   └── base.py             # Base repository class
├── tests/                  # Test files
├── pyproject.toml          # Project configuration
├── local_dev.py            # Development server script
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Python 3.9+
- Poetry (for dependency management)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   poetry install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your configuration

### Development

Start the development server:

```bash
python local_dev.py
```

Or using uvicorn directly:

```bash
poetry run uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- Main API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Testing

Run tests:

```bash
poetry run pytest
```

Run tests with coverage:

```bash
poetry run pytest --cov=api --cov-report=html
```

### Code Quality

Format code:

```bash
poetry run black .
poetry run ruff --fix .
```

Type checking:

```bash
poetry run mypy .
```

## API Endpoints

### Core Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout

### Users

- `GET /api/v1/users/` - List users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/{user_id}` - Get user by ID
- `POST /api/v1/users/` - Create user
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user

## Configuration

Environment variables (see `.env.example`):

- `ENVIRONMENT` - Environment name (development/production)
- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - Secret key for JWT tokens
- `JWT_ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `CORS_ORIGINS` - Allowed CORS origins
- `LOG_LEVEL` - Logging level

## Customization

This boilerplate provides a foundation that can be extended with:

1. **Database Integration**: Add SQLAlchemy/SQLModel with real database connection
2. **Real Authentication**: Implement JWT token generation and validation
3. **More Models**: Add business-specific models in the `models/` directory
4. **Business Logic**: Add service classes in the `api/services/` directory
5. **Additional Routes**: Create new routers in the `api/routers/` directory
6. **Middleware**: Add custom middleware for logging, rate limiting, etc.
7. **Background Tasks**: Add Celery or FastAPI background tasks
8. **File Upload**: Add file handling capabilities
9. **Email Service**: Add email notification system
10. **Caching**: Add Redis caching layer

## License

This is a boilerplate template - feel free to use and modify as needed.