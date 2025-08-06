# JobSpy Backend Service

Python Flask backend that scrapes real job data using JobSpy library and serves it to the Next.js frontend.

## Setup

1. **Install Python dependencies:**
```bash
cd python-backend
pip install -r requirements.txt
```

2. **Run the development server:**
```bash
python app.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### GET /api/jobs/search
Search for jobs across multiple job sites.

**Query Parameters:**
- `search` (string): Job search term (default: "frontend developer")
- `location` (string): Location filter ("remote", "nashville", "both", or specific location)
- `limit` (int): Number of results wanted (default: 20)

**Example:**
```
GET /api/jobs/search?search=react developer&location=remote&limit=15
```

### GET /api/health
Health check endpoint to verify the service is running.

## Job Sites Supported
- Indeed
- LinkedIn  
- Glassdoor
- Google Jobs
- ZipRecruiter

## Deployment

The service is ready to deploy to:
- Railway
- Render
- Heroku
- Vercel (as serverless function)

## Environment Variables
- `PORT`: Server port (default: 5000)