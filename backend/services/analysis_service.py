import pdfplumber
import pytesseract
from PIL import Image
import json
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Add it to your .env file.")


genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')


def clean_llm_output(text: str) -> str:
    """Clean LLM output (remove markdown/json wrappers, smart quotes, etc.)."""
    return (
        text.replace("```json", "")
        .replace("```", "")
        .replace("“", '"')  
        .replace("”", '"')  
        .replace("‘", "'")  
        .replace("’", "'")  
        .replace("\u200b", "")
        .strip()
    )

def safe_json_parse(text: str):
    """Safely parse JSON even if LLM returns extra text."""
    cleaned = clean_llm_output(text)
    try:
        return json.loads(cleaned)
    except:
        pass
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except:
            return {}
    return {}

def extract_text(file_path, max_chars=15000):
    """Extract text from PDF, fallback to OCR if needed."""
    texts = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text or len(text.strip()) == 0:
                pil_image = page.to_image(resolution=300).original
                text = pytesseract.image_to_string(pil_image)
            if text:
                text = re.sub(r'\n{2,}', '\n', text)          
                text = re.sub(r'[^\x00-\x7F]+', ' ', text)    
            texts.append(text or "")
    return "\n".join(texts)[:max_chars]

def pre_extract_fields(text):
    """Extract predictable fields via regex."""
    email_match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    phone_match = re.search(r'\+?\d[\d\s\-]{7,}\d', text)
    linkedin_match = re.search(r'(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+', text)
    portfolio_match = re.search(r'(https?://)?[^\s]+(\.com|\.io|\.dev|\.xyz)', text)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin_url": linkedin_match.group(0) if linkedin_match else None,
        "portfolio_url": portfolio_match.group(0) if portfolio_match else None
    }

def analyze_resume(file_path):
    """Extract structured resume data and AI analysis."""
    resume_text = extract_text(file_path)
    pre_fields = pre_extract_fields(resume_text)

   
    extraction_prompt = f"""
You are an expert HR recruiter.
Extract structured resume data from the following resume text.
Return ONLY JSON with this exact schema:

{{
  "name": "...",
  "email": "...",
  "core_skills": ["skill1", "skill2", ...],
  "soft_skills": ["skill1", "skill2", ...],
  "work_experience": [
    {{
      "title": "...",
      "company": "...",
      "duration": "...",
      "location": "...",
      "description": "..."
    }}
  ],
  "education": [
    {{
      "degree": "...",
      "university": "...",
      "duration": "...",
      "location": "...",
      "cgpa": "...",
      "percentage": "...",
      "additional": "..."
    }}
  ],
  "projects": [
    {{
      "name": "...",
      "description": "...",
      "technologies": ["tech1", "tech2", ...]
    }}
  ],
  "certifications": [
    {{
      "name": "...",
      "issuer": "..."
    }}
  ]
}}

Resume Text:
{resume_text}
"""
    try:
        response = model.generate_content(extraction_prompt)
        extracted_text = response.text
        extracted_data = safe_json_parse(extracted_text)
    except Exception as e:
        print(f"Error in extraction: {e}")
        extracted_data = {
            "name": None,
            "email": None,
            "core_skills": [],
            "soft_skills": [],
            "work_experience": [],
            "education": [],
            "projects": [],
            "certifications": [],
        }

    
    extracted_data.update(pre_fields)

    
    analysis_prompt = f"""
You are a career coach.
Based on this resume JSON data:
{json.dumps(extracted_data)}

Return ONLY JSON with this exact schema:
{{
  "resume_rating": <1-10>,
  "improvement_areas": "...",
  "upskill_suggestions": [
    "Skill 1 - reason",
    "Skill 2 - reason", 
    "Skill 3 - reason"
  ]
}}

Provide specific, actionable feedback. For upskill suggestions, recommend 3-5 relevant skills with brief explanations.
"""
    try:
        analysis_response = model.generate_content(analysis_prompt)
        analysis_text = analysis_response.text
        llm_analysis = safe_json_parse(analysis_text)
    except Exception as e:
        print(f"Error in analysis: {e}")
        llm_analysis = {
            "resume_rating": 5,
            "improvement_areas": "Provide clearer structure and quantifiable achievements.",
            "upskill_suggestions": [
                "System Design - improves scalability knowledge",
                "Advanced React - enhances frontend expertise",
                "Data Structures - improves coding interview performance"
            ],
        }

    
    try:
        os.remove(file_path)
    except:
        pass
    print(extracted_data,llm_analysis)
    return extracted_data, llm_analysis