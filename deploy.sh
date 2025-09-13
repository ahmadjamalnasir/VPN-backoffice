#!/bin/bash
# Quick deployment script for VPN Backoffice

# Install Node.js if not available
if ! command -v node &> /dev/null; then
    if command -v brew &> /dev/null; then
        brew install node
    else
        echo "Install Node.js: https://nodejs.org/"
        exit 1
    fi
fi

# Install dependencies and run
npm install
cp .env.example .env 2>/dev/null || true
echo "🚀 Starting at http://localhost:3000 (Login: admin/admin)"
npm run dev