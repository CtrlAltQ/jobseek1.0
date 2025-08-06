# 🚀 Real Job API Integration Setup

Your JobSeek app now integrates with **JobSpy** to pull real job data from LinkedIn, Indeed, Glassdoor, and more!

## 🛠 Setup Instructions

### 1. Install Python 3.10+ (Required for JobSpy)

**macOS:**
```bash
# Install Python 3.10 via Homebrew
brew install python@3.10

# Use Python 3.10 specifically
alias python3=/opt/homebrew/bin/python3.10
alias pip3=/opt/homebrew/bin/pip3.10
```

**Windows:**
```bash
# Download Python 3.10+ from python.org
# Or use Windows Package Manager
winget install Python.Python.3.10
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3.10 python3.10-pip
```

### 2. Install Python Backend Dependencies

**Option A: Full JobSpy (Python 3.10+ required)**
```bash
cd python-backend
pip3 install -r requirements.txt
```

**Option B: Fallback Scraper (Any Python 3.7+)**
```bash
cd python-backend
pip3 install -r requirements-fallback.txt
```

### 3. Start the Python Backend

**Option A: Full JobSpy Backend**
```bash
cd python-backend
python app.py
```

**Option B: Fallback Backend (if you used requirements-fallback.txt)**
```bash
cd python-backend
python fallback_app.py
```

The backend will start on `http://localhost:5000`

### 4. Start Your Next.js App

```bash
# From the root directory
npm run dev
```

Your app will be available at `http://localhost:3000`

## 🎯 How It Works

1. **Initial Load**: App searches for "react developer" jobs in Nashville
2. **Real-time Search**: When you search, it queries multiple job sites via JobSpy
3. **AI Scoring**: Each job gets enhanced relevance scoring using your existing AI algorithm
4. **Fallback**: If the Python backend is down, it falls back to mock data

## 🔧 Job Sites Integrated

- **LinkedIn** - Professional network jobs
- **Indeed** - General job listings  
- **Glassdoor** - Company reviews + jobs
- **Google Jobs** - Aggregated listings

## 🎨 New Features Added

- **Loading States**: Spinning loader while searching
- **Error Handling**: Retry button if API fails  
- **Smart Filtering**: Mix of API search + local filtering
- **Enhanced Search**: Triggers new API calls for significant search changes

## 🌐 Deployment

### Python Backend Options:

1. **Railway** (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy from python-backend directory
cd python-backend
railway login
railway init
railway up
```

2. **Render**
- Connect your GitHub repo
- Set build command: `pip install -r requirements.txt`
- Set start command: `gunicorn app:app`

3. **Heroku**
```bash
# Add Procfile to python-backend:
echo "web: gunicorn app:app" > python-backend/Procfile

# Deploy
cd python-backend
heroku create your-jobseek-api
git subtree push --prefix=python-backend heroku main
```

### Update Environment Variables

After deploying, update `.env.local`:
```bash
NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-deployed-backend-url.com
```

## 🚨 Rate Limits & Best Practices

- **Be Respectful**: Don't spam job sites with too many requests
- **Cache Results**: Consider adding Redis caching for production
- **Monitor Usage**: Job sites may block if you exceed limits
- **User Experience**: Always provide fallback to mock data

## 🧪 Testing

1. **Health Check**: Visit `http://localhost:5000/api/health`
2. **Direct API**: `http://localhost:5000/api/jobs/search?search=react&location=remote`
3. **Frontend**: Search for different terms in your app

Your job finder now has **real job data** while maintaining the polished UX! 🎉