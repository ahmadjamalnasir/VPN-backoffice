#!/bin/bash

set -e

PROJECT_DIR="/Users/ahmad.nasir/VPN-backoffice"
VENV_DIR="$PROJECT_DIR/venv"

# Create and activate virtual environment
python3 -m venv "$VENV_DIR" 2>/dev/null || true
source "$VENV_DIR/bin/activate"

# Navigate to project directory
cd "$PROJECT_DIR"

# Check if Docker is available and running
if command -v docker &> /dev/null && docker info &> /dev/null; then
    echo "🐳 Using Docker deployment..."
    docker build -f docker/Dockerfile -t vpn-backoffice .
    docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 vpn-backoffice
else
    # Fallback to Node.js deployment
    echo "📦 Using Node.js deployment..."
    
    # Install Node.js if not available
    if ! command -v node &> /dev/null; then
        if command -v brew &> /dev/null; then
            brew install node
        else
            echo "❌ Install Node.js: https://nodejs.org/"
            exit 1
        fi
    fi
    
    # Run the application
    npm install
    cp .env.example .env 2>/dev/null || true
    echo "🚀 Starting at http://localhost:3000 (Login: admin/admin)"
    npm run dev
fi