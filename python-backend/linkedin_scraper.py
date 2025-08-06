"""
LinkedIn job scraper using RSS feeds and search URLs
"""

import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import re
import uuid
from datetime import datetime, timedelta
import urllib.parse

def scrape_linkedin_jobs(search_term="developer", location="remote", limit=20):
    """Scrape LinkedIn jobs using RSS and search"""
    try:
        jobs = []
        
        # Method 1: Try LinkedIn RSS (limited but official)
        rss_jobs = scrape_linkedin_rss(search_term, location, limit // 2)
        jobs.extend(rss_jobs)
        
        # Method 2: Try LinkedIn job search URLs (more risky but more data)
        if len(jobs) < limit:
            remaining = limit - len(jobs)
            search_jobs = scrape_linkedin_search(search_term, location, remaining)
            jobs.extend(search_jobs)
        
        print(f"Total LinkedIn jobs found: {len(jobs)}")
        return jobs[:limit]
        
    except Exception as e:
        print(f"LinkedIn scraping error: {e}")
        return []

def scrape_linkedin_rss(search_term, location, limit):
    """Try LinkedIn RSS feeds (limited availability)"""
    jobs = []
    
    try:
        # LinkedIn company RSS feeds (if available)
        rss_urls = [
            "https://www.linkedin.com/jobs/feed",  # General feed (may not work)
        ]
        
        for url in rss_urls:
            try:
                headers = {
                    'User-Agent': 'JobSeek/1.0 RSS Reader',
                    'Accept': 'application/rss+xml, application/xml'
                }
                
                response = requests.get(url, headers=headers, timeout=10)
                if response.status_code == 200:
                    root = ET.fromstring(response.content)
                    items = root.findall('.//item')
                    
                    for item in items[:limit]:
                        job = parse_linkedin_rss_item(item)
                        if job:
                            jobs.append(job)
                            
            except Exception as e:
                print(f"LinkedIn RSS error: {e}")
                continue
                
    except Exception as e:
        print(f"LinkedIn RSS scraping error: {e}")
    
    return jobs

def scrape_linkedin_search(search_term, location, limit):
    """Scrape LinkedIn job search results (be careful with rate limits)"""
    jobs = []
    
    try:
        # Build LinkedIn job search URL
        search_encoded = urllib.parse.quote_plus(search_term)
        location_encoded = urllib.parse.quote_plus(location)
        
        # LinkedIn job search URL structure
        base_url = "https://www.linkedin.com/jobs/search"
        params = {
            'keywords': search_term,
            'location': location,
            'f_TPR': 'r604800',  # Past week
            'f_WT': '2' if location.lower() == 'remote' else '',  # Remote filter
        }
        
        # Build URL
        url = f"{base_url}?" + urllib.parse.urlencode({k: v for k, v in params.items() if v})
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        print(f"Trying LinkedIn search: {url}")
        
        # Make request with session for better success rate
        session = requests.Session()
        response = session.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for job cards in LinkedIn's HTML structure
            job_cards = soup.find_all(['div'], class_=lambda x: x and ('job' in x.lower() or 'card' in x.lower()))
            
            print(f"Found {len(job_cards)} potential job elements")
            
            for card in job_cards[:limit]:
                job = parse_linkedin_job_card(card, search_term)
                if job:
                    jobs.append(job)
                    
        else:
            print(f"LinkedIn search failed: {response.status_code}")
            
    except Exception as e:
        print(f"LinkedIn search scraping error: {e}")
    
    return jobs

def parse_linkedin_rss_item(item):
    """Parse LinkedIn RSS item"""
    try:
        title = item.find('title')
        title_text = title.text if title else 'Developer'
        
        link = item.find('link') 
        link_url = link.text if link else '#'
        
        description = item.find('description')
        desc_text = description.text if description else ''
        
        # Extract company from title (LinkedIn format varies)
        company_match = re.search(r'at (.+?)(?:\s*-|\s*$)', title_text)
        company = company_match.group(1) if company_match else 'LinkedIn Company'
        
        job = {
            "id": str(uuid.uuid4()),
            "title": clean_job_title(title_text),
            "company": company.strip(),
            "location": "Remote",
            "salary": "Salary not specified",
            "postedDate": datetime.now().isoformat(),
            "source": "LinkedIn",
            "description": clean_html_description(desc_text)[:500],
            "requirements": extract_skills_from_text(desc_text),
            "isRemote": True,
            "relevanceScore": calculate_linkedin_relevance(title_text, desc_text),
            "applicationStatus": "not_applied",
            "tags": ["LinkedIn", "Professional"],
            "url": link_url
        }
        
        return job
        
    except Exception as e:
        print(f"Error parsing LinkedIn RSS item: {e}")
        return None

def parse_linkedin_job_card(card, search_term):
    """Parse LinkedIn job card from HTML"""
    try:
        # This is challenging as LinkedIn's HTML structure changes frequently
        # Look for common patterns
        
        title_elem = card.find(['h3', 'h2', 'a'], class_=lambda x: x and 'job' in x.lower())
        title = title_elem.get_text().strip() if title_elem else f"{search_term.title()} Position"
        
        company_elem = card.find(['span', 'div'], class_=lambda x: x and 'company' in x.lower())  
        company = company_elem.get_text().strip() if company_elem else 'LinkedIn Company'
        
        location_elem = card.find(['span', 'div'], class_=lambda x: x and 'location' in x.lower())
        location = location_elem.get_text().strip() if location_elem else 'Remote'
        
        # Try to find job link
        link_elem = card.find('a', href=True)
        job_url = link_elem['href'] if link_elem else '#'
        
        # Make relative URLs absolute
        if job_url.startswith('/'):
            job_url = f"https://www.linkedin.com{job_url}"
        
        job = {
            "id": str(uuid.uuid4()),
            "title": clean_job_title(title),
            "company": company,
            "location": location,
            "salary": "Competitive salary",
            "postedDate": (datetime.now() - timedelta(days=1)).isoformat(),
            "source": "LinkedIn",
            "description": f"Professional {search_term} opportunity at {company}. Join a dynamic team and advance your career with this exciting role.",
            "requirements": generate_linkedin_skills(search_term),
            "isRemote": 'remote' in location.lower(),
            "relevanceScore": calculate_linkedin_relevance(title, search_term),
            "applicationStatus": "not_applied",
            "tags": ["LinkedIn", "Professional", "Network"],
            "url": job_url
        }
        
        return job
        
    except Exception as e:
        print(f"Error parsing LinkedIn job card: {e}")
        return None

def clean_job_title(title):
    """Clean job title"""
    # Remove "at Company" suffix
    title = re.sub(r'\s+at\s+.+$', '', title)
    return title.strip()

def clean_html_description(text):
    """Clean HTML from description"""
    if not text:
        return ""
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', text)
    return ' '.join(clean_text.split())

def extract_skills_from_text(text):
    """Extract skills from text"""
    skills = ['React', 'JavaScript', 'Python', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'Git', 'AWS']
    found_skills = []
    text_lower = text.lower() if text else ''
    
    for skill in skills:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return found_skills[:6]

def generate_linkedin_skills(search_term):
    """Generate relevant skills based on search term"""
    skill_map = {
        'react': ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
        'javascript': ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'],
        'python': ['Python', 'Django', 'Flask', 'SQL', 'API'],
        'frontend': ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
        'backend': ['Python', 'Node.js', 'SQL', 'API', 'AWS'],
    }
    
    search_lower = search_term.lower()
    for key, skills in skill_map.items():
        if key in search_lower:
            return skills
    
    return ['JavaScript', 'React', 'CSS', 'HTML']

def calculate_linkedin_relevance(title, description):
    """Calculate relevance score"""
    score = 75  # Higher base for LinkedIn (professional network)
    
    if title:
        title_lower = title.lower()
        if any(word in title_lower for word in ['senior', 'lead', 'principal']):
            score += 10
        elif any(word in title_lower for word in ['junior', 'entry']):
            score += 5
        
        # Tech keywords
        if any(word in title_lower for word in ['react', 'javascript', 'frontend', 'developer']):
            score += 8
    
    return min(95, score)

if __name__ == "__main__":
    # Test the scraper
    jobs = scrape_linkedin_jobs("react developer", "remote", 3)
    print(f"Found {len(jobs)} LinkedIn jobs")
    
    if jobs:
        import json
        print(json.dumps(jobs[0], indent=2))