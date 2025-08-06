"""
Simple job scraper fallback for Python < 3.10
Uses requests and BeautifulSoup instead of JobSpy
"""

import requests
from bs4 import BeautifulSoup
import json
import uuid
from datetime import datetime, timedelta
import random

def scrape_remoteok_jobs(search_term="developer", limit=20):
    """Scrape jobs from RemoteOK (they have a public API)"""
    try:
        # RemoteOK has a simple JSON API
        url = f"https://remoteok.io/api"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return []
        
        data = response.json()
        jobs = []
        
        for job_data in data[1:limit+1]:  # Skip first item (metadata)
            if not isinstance(job_data, dict):
                continue
                
            # Filter by search term
            title = job_data.get('position', '').lower()
            description = job_data.get('description', '').lower()
            tags = ' '.join(job_data.get('tags', [])).lower()
            
            if search_term.lower() not in (title + ' ' + description + ' ' + tags):
                continue
            
            # Convert to our format
            job = {
                "id": str(uuid.uuid4()),
                "title": job_data.get('position', 'Developer'),
                "company": job_data.get('company', 'Remote Company'),
                "location": "Remote",
                "salary": format_salary_remoteok(job_data.get('salary_min'), job_data.get('salary_max')),
                "postedDate": format_date_remoteok(job_data.get('date')),
                "source": "RemoteOK",
                "description": job_data.get('description', '')[:500] + '...' if len(job_data.get('description', '')) > 500 else job_data.get('description', ''),
                "requirements": job_data.get('tags', [])[:8],
                "isRemote": True,
                "relevanceScore": calculate_relevance_simple(job_data, search_term),
                "applicationStatus": "not_applied",
                "tags": ["Remote"] + job_data.get('tags', [])[:5],
                "url": job_data.get('url', '#')
            }
            jobs.append(job)
            
        return jobs[:limit]
        
    except Exception as e:
        print(f"Error scraping RemoteOK: {e}")
        return []

def generate_mock_jobs(search_term="developer", location="Nashville", limit=20):
    """Generate realistic mock jobs based on search term"""
    
    companies = [
        "TechFlow", "DataCorp", "CodeStream", "DevHouse", "PixelPerfect",
        "CloudNinja", "ReactLabs", "ByteForge", "FullStack Inc", "ScriptCraft"
    ]
    
    job_titles = [
        f"Frontend {search_term.title()}",
        f"Full Stack {search_term.title()}",
        f"React {search_term.title()}",
        f"JavaScript {search_term.title()}",
        f"Python {search_term.title()}",
        f"Senior {search_term.title()}",
        f"Junior {search_term.title()}",
        f"{search_term.title()} Engineer",
        f"{search_term.title()} Specialist"
    ]
    
    skills = ["React", "JavaScript", "Python", "TypeScript", "Node.js", "HTML", "CSS", "Git", "AWS", "Docker"]
    
    jobs = []
    for i in range(limit):
        is_remote = random.choice([True, False, True])  # 66% remote
        salary_min = random.randint(60, 90) * 1000
        salary_max = salary_min + random.randint(10, 30) * 1000
        
        job = {
            "id": str(uuid.uuid4()),
            "title": random.choice(job_titles),
            "company": random.choice(companies),
            "location": "Remote" if is_remote else location,
            "salary": f"${salary_min:,} - ${salary_max:,}",
            "postedDate": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
            "source": "Mock API",
            "description": f"We're looking for a talented {search_term} to join our growing team. Great opportunity to work with modern technologies and make an impact.",
            "requirements": random.sample(skills, random.randint(4, 7)),
            "isRemote": is_remote,
            "relevanceScore": random.randint(75, 95),
            "applicationStatus": "not_applied",
            "tags": ["Remote" if is_remote else "On-site", random.choice(["Full-Time", "Contract"])],
            "url": f"https://example.com/jobs/{uuid.uuid4()}"
        }
        jobs.append(job)
    
    return jobs

def format_salary_remoteok(min_sal, max_sal):
    """Format RemoteOK salary data"""
    if min_sal and max_sal:
        return f"${min_sal:,} - ${max_sal:,}"
    elif min_sal:
        return f"${min_sal:,}+"
    else:
        return "Salary not specified"

def format_date_remoteok(timestamp):
    """Format RemoteOK date"""
    if timestamp:
        try:
            return datetime.fromtimestamp(timestamp).isoformat()
        except:
            pass
    return datetime.now().isoformat()

def calculate_relevance_simple(job_data, search_term):
    """Simple relevance calculation"""
    score = 70  # Base score
    
    title = job_data.get('position', '').lower()
    tags = ' '.join(job_data.get('tags', [])).lower()
    
    # Search term match
    if search_term.lower() in title:
        score += 15
    if search_term.lower() in tags:
        score += 10
    
    # Tech skills
    tech_skills = ['react', 'javascript', 'python', 'typescript']
    for skill in tech_skills:
        if skill in tags or skill in title:
            score += 3
    
    return min(95, score)

if __name__ == "__main__":
    # Test the scraper
    jobs = scrape_remoteok_jobs("react", 5)
    print(f"Found {len(jobs)} RemoteOK jobs")
    
    if jobs:
        print(json.dumps(jobs[0], indent=2))
    else:
        print("Falling back to mock data...")
        mock_jobs = generate_mock_jobs("react", "Nashville", 5)
        print(json.dumps(mock_jobs[0], indent=2))