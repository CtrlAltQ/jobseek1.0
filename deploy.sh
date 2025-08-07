#!/bin/bash

echo "🚀 JobSeek Deployment Helper"
echo "============================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "Choose deployment option:"
echo "1) Railway (Backend) + Vercel (Frontend) - Recommended"
echo "2) Railway (Full Stack)"
echo "3) Render (Manual setup required)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📡 Deploying Python backend to Railway..."
        cd python-backend
        
        # Login to Railway
        railway login
        
        # Create new project
        railway init
        
        # Deploy backend
        railway up
        
        echo ""
        echo "🌐 Deploying Next.js frontend to Vercel..."
        cd ..
        
        # Login to Vercel
        vercel login
        
        # Deploy frontend
        vercel --prod
        
        echo ""
        echo "✅ Deployment complete!"
        echo ""
        echo "📝 Next steps:"
        echo "1. Get your Railway backend URL from: railway dashboard"
        echo "2. Update .env.local with: NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-railway-url"
        echo "3. Redeploy frontend: vercel --prod"
        ;;
    2)
        echo ""
        echo "🚂 Deploying full stack to Railway..."
        railway login
        railway init
        railway up
        
        echo ""
        echo "✅ Deployment complete!"
        echo "Your app will be available at the Railway URL"
        ;;
    3)
        echo ""
        echo "📖 Manual Render Setup:"
        echo "1. Go to https://render.com and connect your GitHub repo"
        echo "2. Create Web Service for Python backend:"
        echo "   - Build: pip install -r python-backend/requirements-fallback.txt"
        echo "   - Start: python python-backend/fallback_app.py"
        echo "3. Create Static Site for Next.js frontend:"
        echo "   - Build: npm run build"
        echo "   - Environment: NEXT_PUBLIC_PYTHON_BACKEND_URL=your-backend-url"
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        ;;
esac