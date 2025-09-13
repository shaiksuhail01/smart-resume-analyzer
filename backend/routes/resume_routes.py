from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Resume
from services.analysis_service import analyze_resume
import json
import os

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
async def upload_resume(resume: UploadFile = File(...), db: Session = Depends(get_db)):
    if not resume:
        raise HTTPException(status_code=400, detail="No file uploaded")

    temp_file = f"temp_{resume.filename}"
    with open(temp_file, "wb") as f:
        f.write(await resume.read())

    try:
        extracted_data, llm_analysis = analyze_resume(temp_file)
        
        # Merge extracted data with LLM analysis for frontend
        response_data = {**extracted_data, **llm_analysis}
        
        new_resume = Resume(
            filename=resume.filename,
            name=extracted_data.get("name"),
            email=extracted_data.get("email"),
            phone=extracted_data.get("phone"),
            extracted_data=json.dumps(extracted_data),
            llm_analysis=json.dumps(llm_analysis),
        )

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        return {
            "analysis": response_data,
            "llm_analysis": llm_analysis,
            "dbRecord": {"id": new_resume.id, "filename": new_resume.filename},
        }
    except Exception as e:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@router.get("/")
def get_all_resumes(db: Session = Depends(get_db)):
    resumes = db.query(Resume).order_by(Resume.uploaded_at.desc()).all()
    result = []
    for r in resumes:
        # Parse llm_analysis to get rating for frontend
        llm_data = json.loads(r.llm_analysis) if r.llm_analysis else {}
        result.append({
            "id": r.id, 
            "filename": r.filename, 
            "name": r.name, 
            "email": r.email, 
            "phone": r.phone,
            "resume_rating": llm_data.get("resume_rating", 0)
        })
    return result

@router.get("/{resume_id}")
def get_resume_by_id(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Combine extracted data and llm_analysis for frontend
    extracted_data = json.loads(resume.extracted_data) if resume.extracted_data else {}
    llm_analysis = json.loads(resume.llm_analysis) if resume.llm_analysis else {}
    
    response_data = {**extracted_data, **llm_analysis}
    response_data["id"] = resume.id
    response_data["filename"] = resume.filename
    response_data["uploaded_at"] = resume.uploaded_at
    
    return response_data