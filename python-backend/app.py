from flask import Flask, request, jsonify
from flask_cors import CORS
from jobspy import scrape_jobs
import pandas as pd
from datetime import datetime, timedelta
import uuid
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

def convert_jobspy_to_app_format(df):
    """Convert JobSpy DataFrame to our app's Job interface format"""
    jobs = []
    
    for _, row in df.iterrows():
        # Calculate relevance score (we'll enhance this later)
        relevance_score = calculate_basic_relevance(row)
        
        job = {
            "id": str(uuid.uuid4()),
            "title": str(row.get('title', '')),
            "company": str(row.get('company', '')),
            "location": str(row.get('location', '')),
            "salary": format_salary(row),
            "postedDate": format_date(row.get('date_posted')),
            "source": str(row.get('site', '')).title(),
            "description": str(row.get('description', ''))[:500] + '...' if len(str(row.get('description', ''))) > 500 else str(row.get('description', '')),
            "requirements": extract_requirements(row.get('description', '')),
            "isRemote": is_remote_job(row),
            "relevanceScore": relevance_score,
            "applicationStatus": "not_applied",
            "tags": extract_tags(row),
            "url": str(row.get('job_url', ''))
        }
        jobs.append(job)
    
    return jobs

def calculate_basic_relevance(row):
    """Basic relevance scoring - we'll enhance this with the existing AI scoring later"""
    score = 50  # Base score
    
    title = str(row.get('title', '')).lower()
    description = str(row.get('description', '')).lower()
    company = str(row.get('company', '')).lower()
    
    # Jeremy's key skills scoring
    jeremy_skills = ['react', 'javascript', 'python', 'next.js', 'tailwindcss', 'typescript', 'node.js']
    
    for skill in jeremy_skills:
        if skill in title or skill in description:
            score += 8
    
    # Remote preference
    if is_remote_job(row):
        score += 10
    
    # Location preference (Nashville)
    location = str(row.get('location', '')).lower()
    if 'nashville' in location or 'tennessee' in location:
        score += 8
    
    # Job recency
    date_posted = row.get('date_posted')
    if date_posted:
        try:
            posted_date = pd.to_datetime(date_posted)
            days_ago = (datetime.now() - posted_date).days
            if days_ago <= 7:
                score += 10
            elif days_ago <= 30:
                score += 5
        except:
            pass
    
    return min(96, max(70, score))

def format_salary(row):
    """Format salary information"""
    min_salary = row.get('min_amount')
    max_salary = row.get('max_amount')
    
    if pd.notna(min_salary) and pd.notna(max_salary):
        return f"${int(min_salary):,} - ${int(max_salary):,}"
    elif pd.notna(min_salary):
        return f"${int(min_salary):,}+"
    elif pd.notna(max_salary):
        return f"Up to ${int(max_salary):,}"
    else:
        return "Salary not specified"

def format_date(date_str):
    """Format date to ISO string"""
    if pd.isna(date_str):
        return datetime.now().isoformat()
    
    try:
        # Try to parse the date
        parsed_date = pd.to_datetime(date_str)
        return parsed_date.isoformat()
    except:
        return datetime.now().isoformat()

def is_remote_job(row):
    """Determine if job is remote"""
    location = str(row.get('location', '')).lower()
    title = str(row.get('title', '')).lower()
    description = str(row.get('description', '')).lower()
    
    remote_keywords = ['remote', 'work from home', 'wfh', 'distributed', 'anywhere']
    
    for keyword in remote_keywords:
        if keyword in location or keyword in title or keyword in description:
            return True
    
    return False

def extract_requirements(description):
    """Extract requirements/skills from job description"""
    if pd.isna(description):
        return []
    
    description = str(description).lower()
    
    # Common tech skills to look for
    tech_skills = [
        'react', 'javascript', 'python', 'typescript', 'node.js', 'next.js',
        'html', 'css', 'tailwindcss', 'git', 'aws', 'docker', 'sql',
        'mongodb', 'postgresql', 'redis', 'graphql', 'rest api'
    ]
    
    found_skills = []
    for skill in tech_skills:
        if skill in description:
            found_skills.append(skill.title())
    
    return found_skills[:8]  # Limit to 8 skills

def extract_tags(row):
    """Extract tags from job data"""
    tags = []
    
    # Add job type tags
    if is_remote_job(row):
        tags.append('Remote')
    
    # Add experience level tags
    title = str(row.get('title', '')).lower()
    if 'senior' in title:
        tags.append('Senior')
    elif 'junior' in title or 'entry' in title:
        tags.append('Junior')
    elif 'mid' in title or 'intermediate' in title:
        tags.append('Mid-Level')
    
    # Add job type
    if 'full-time' in str(row.get('job_type', '')).lower():
        tags.append('Full-Time')
    elif 'part-time' in str(row.get('job_type', '')).lower():
        tags.append('Part-Time')
    elif 'contract' in str(row.get('job_type', '')).lower():
        tags.append('Contract')
    
    return tags

@app.route('/api/jobs/search', methods=['GET'])
def search_jobs():
    """Search for jobs using JobSpy"""
    try:
        # Get query parameters
        search_term = request.args.get('search', 'frontend developer')
        location = request.args.get('location', 'Nashville, TN')
        results_wanted = int(request.args.get('limit', 20))
        
        # Handle location parameter
        if location == 'remote':
            location = 'Remote'
        elif location == 'nashville':
            location = 'Nashville, TN'
        elif location == 'both':
            location = 'Nashville, TN'  # We'll search Nashville and filter for remote later
        
        print(f"Searching for: {search_term} in {location}")
        
        # Search multiple job sites
        sites = ["indeed", "linkedin", "glassdoor"]
        
        # Scrape jobs
        jobs_df = scrape_jobs(
            site_name=sites,
            search_term=search_term,
            location=location,
            results_wanted=results_wanted,
            hours_old=168,  # Jobs posted in last week
            country_indeed='USA'
        )
        
        if jobs_df.empty:
            return jsonify({
                "jobs": [],
                "total": 0,
                "message": "No jobs found for the given criteria"
            })
        
        # Convert to our app format
        jobs = convert_jobspy_to_app_format(jobs_df)
        
        return jsonify({
            "jobs": jobs,
            "total": len(jobs),
            "message": f"Found {len(jobs)} jobs"
        })
        
    except Exception as e:
        print(f"Error searching jobs: {str(e)}")
        return jsonify({
            "error": str(e),
            "jobs": [],
            "total": 0
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "JobSpy backend is running"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)