# 🚀 Render Deployment Instructions

## Prerequisites
- GitHub account connected to Render
- Your code pushed to GitHub (✅ already done)

## Step 1: Deploy Python Backend

1. **Go to [render.com](https://render.com) and sign up/login**

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `CtrlAltQ/jobseek1.0`

3. **Configure Backend Service:**
   ```
   Name: jobseek-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: python-backend
   Runtime: Python 3
   Build Command: pip install -r requirements-fallback.txt
   Start Command: python fallback_app.py
   Instance Type: Free
   ```

4. **Environment Variables:**
   ```
   PORT = 10000
   FLASK_ENV = production
   ```

5. **Click "Create Web Service"**
   - Render will build and deploy your backend
   - You'll get a URL like: `https://jobseek-backend.onrender.com`

## Step 2: Deploy Next.js Frontend

1. **Create Another Web Service**
   - Click "New +" → "Web Service" 
   - Same repo: `CtrlAltQ/jobseek1.0`

2. **Configure Frontend Service:**
   ```
   Name: jobseek-frontend
   Region: Oregon (US West)  
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_PYTHON_BACKEND_URL = https://jobseek-backend.onrender.com
   ```

4. **Click "Create Web Service"**

## Step 3: Test Your Live App

- **Frontend URL:** `https://jobseek-frontend.onrender.com`
- **Backend API:** `https://jobseek-backend.onrender.com/api/health`

## 🎉 Your JobSeek app will be live!

**Free tier limitations:**
- Services sleep after 15 mins of inactivity
- First request may take 30-60 seconds to wake up
- Plenty for portfolio/demo purposes

**Custom domains available on paid plans ($7/month)**