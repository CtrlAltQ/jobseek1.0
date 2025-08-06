"""
Fallback Flask app for Python < 3.10
Uses simple scraping instead of JobSpy
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from simple_scraper import scrape_remoteok_jobs, generate_mock_jobs
from indeed_scraper import scrape_indeed_jobs
from linkedin_scraper import scrape_linkedin_jobs

app = Flask(__name__)
CORS(app)

@app.route('/api/jobs/search', methods=['GET'])
def search_jobs():
    """Search for jobs using simple scraping"""
    try:
        search_term = request.args.get('search', 'developer')
        location = request.args.get('location', 'Nashville, TN')
        results_wanted = int(request.args.get('limit', 20))
        
        print(f"Searching for: {search_term} in {location}")
        
        jobs = []
        
        # Try multiple real job sources
        print("Fetching jobs from multiple sources...")
        
        # 1. Try Indeed RSS feeds first (most reliable)
        indeed_jobs = scrape_indeed_jobs(search_term, location, results_wanted // 3)
        jobs.extend(indeed_jobs)
        print(f"Found {len(indeed_jobs)} Indeed jobs")
        
        # 2. Try LinkedIn jobs (professional network)
        if len(jobs) < results_wanted:
            remaining = results_wanted - len(jobs)
            linkedin_jobs = scrape_linkedin_jobs(search_term, location, min(remaining, results_wanted // 3))
            jobs.extend(linkedin_jobs)
            print(f"Found {len(linkedin_jobs)} LinkedIn jobs")
        
        # 3. Try RemoteOK for remote jobs
        if len(jobs) < results_wanted:
            remaining = results_wanted - len(jobs)
            remoteok_jobs = scrape_remoteok_jobs(search_term, remaining)
            jobs.extend(remoteok_jobs)
            print(f"Found {len(remoteok_jobs)} RemoteOK jobs")
        
        # 3. Fill remaining with high-quality mock data if needed
        if len(jobs) < results_wanted:
            remaining = results_wanted - len(jobs)
            mock_jobs = generate_mock_jobs(search_term, location, remaining)
            jobs.extend(mock_jobs)
            print(f"Added {len(mock_jobs)} smart mock jobs")
        
        # Sort all jobs by relevance score
        jobs.sort(key=lambda x: x.get('relevanceScore', 0), reverse=True)
        
        real_jobs = len([j for j in jobs if j.get('source') in ['Indeed', 'RemoteOK', 'LinkedIn']])
        mock_jobs = len(jobs) - real_jobs
        
        message_parts = []
        if real_jobs > 0:
            message_parts.append(f"{real_jobs} real jobs")
        if mock_jobs > 0:
            message_parts.append(f"{mock_jobs} demo jobs")
            
        return jsonify({
            "jobs": jobs[:results_wanted],
            "total": len(jobs),
            "message": f"Found {' + '.join(message_parts)} from multiple sources"
        })
        
    except Exception as e:
        print(f"Error searching jobs: {str(e)}")
        
        # Ultimate fallback - pure mock data
        mock_jobs = generate_mock_jobs(
            request.args.get('search', 'developer'),
            request.args.get('location', 'Nashville'),
            int(request.args.get('limit', 20))
        )
        
        return jsonify({
            "jobs": mock_jobs,
            "total": len(mock_jobs),
            "message": "Using mock data - scraping failed",
            "error": str(e)
        })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Fallback JobSpy backend is running",
        "python_version": "< 3.10 (fallback mode)"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)