import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import resume_routes
from db.database import init_db

# Initialize DB
init_db()

# Create app
app = FastAPI(title="Smart Resume Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(resume_routes.router, prefix="/api/resumes")

# Run server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
