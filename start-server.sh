#!/bin/bash

# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null || true

echo "Starting AI Job Finder server..."
echo "Checking dependencies..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Clear Next.js cache
rm -rf .next

echo "Starting development server..."
echo "Server will be available at: http://localhost:3000"
echo ""

# Start the development server
npm run dev