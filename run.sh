#!/bin/bash

set -e

PROJECT_DIR="/Users/ahmad.nasir/VPN-backoffice"
VENV_DIR="$PROJECT_DIR/venv"

echo "🚀 VPN Backoffice Setup & Run Script"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required but not installed."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Install Node.js via nodeenv if not available
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js in virtual environment..."
    pip install nodeenv
    nodeenv --node=18.18.0 --npm=9.8.1 --force "$VENV_DIR"
    source "$VENV_DIR/bin/activate"
fi

# Navigate to project directory
cd "$PROJECT_DIR"

# Install npm dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

echo "✅ Setup complete!"
echo "🌐 Starting development server..."
echo "📍 Access: http://localhost:3000"
echo "🔑 Login: admin/admin"
echo ""

# Start the development server
npm run dev