#!/bin/bash

set -e

echo "🚀 VPN Backoffice Simple Setup & Run"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run from project root."
    exit 1
fi

# Try to use system Node.js first
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo "✅ Using system Node.js $(node -v)"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi
    
    # Create .env if needed
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        cp .env.example .env
    fi
    
    echo "🌐 Starting server at http://localhost:3000"
    echo "🔑 Login: admin/admin"
    npm run dev
    
else
    echo "❌ Node.js not found. Please install Node.js 18+ first:"
    echo "   - macOS: brew install node"
    echo "   - Or download from: https://nodejs.org/"
    exit 1
fi