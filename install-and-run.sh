#!/bin/bash

set -e

echo "🚀 VPN Backoffice - Complete Setup & Run"

# Check if Homebrew is available
if command -v brew &> /dev/null; then
    echo "✅ Homebrew detected"
    
    # Install Node.js via Homebrew
    if ! command -v node &> /dev/null; then
        echo "📥 Installing Node.js via Homebrew..."
        brew install node
    else
        echo "✅ Node.js already installed: $(node -v)"
    fi
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing npm dependencies..."
        npm install
    fi
    
    # Create .env
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        cp .env.example .env
    fi
    
    echo ""
    echo "✅ Setup complete!"
    echo "🌐 Starting server at http://localhost:3000"
    echo "🔑 Login credentials: admin/admin"
    echo "📡 Backend should be running on http://localhost:8000"
    echo ""
    
    # Start the server
    npm run dev
    
else
    echo "❌ Homebrew not found. Please install Node.js manually:"
    echo "   1. Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "   2. Install Node.js: brew install node"
    echo "   3. Run this script again"
    exit 1
fi