from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from db.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    extracted_data = Column(Text)  # JSON string of structured info
    llm_analysis = Column(Text)    # JSON string of AI feedback
