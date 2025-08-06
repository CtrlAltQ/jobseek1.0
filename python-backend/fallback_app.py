"""
Fallback Flask app for Python < 3.10
Uses simple scraping instead of JobSpy
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from simple_scraper import scrape_remoteok_jobs, generate_mock_jobs

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
        
        # Try RemoteOK first for remote jobs
        if location in ['remote', 'both']:
            remote_jobs = scrape_remoteok_jobs(search_term, results_wanted // 2)
            jobs.extend(remote_jobs)
            print(f"Found {len(remote_jobs)} RemoteOK jobs")
        
        # Fill remaining with mock data
        remaining = results_wanted - len(jobs)
        if remaining > 0:
            mock_jobs = generate_mock_jobs(search_term, location, remaining)
            jobs.extend(mock_jobs)
            print(f"Added {len(mock_jobs)} mock jobs")
        
        return jsonify({
            "jobs": jobs[:results_wanted],
            "total": len(jobs),
            "message": f"Found {len(jobs)} jobs using fallback scraper"
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
    app.run(host='0.0.0.0', port=port, debug=True)