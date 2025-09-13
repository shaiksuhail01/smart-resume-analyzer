# Resume Analyzer

A web-based application that allows users to upload resumes in PDF format, analyze them for key details, and maintain a history of past uploads with options to compare resumes.

---

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=appveyor)]

**Click the badge above to open the fully deployed Resume Analyzer web application.**
---
## 📌 Objective  
The primary objective of this project is to design, build, and deploy a full-stack web application called **Resume Analyzer**.  
This application enables users to:  
- Upload resumes in **PDF format**.  
- Automatically extract key information.  
- Store results in a database.  
- Provide **AI-driven feedback** for improvement.  

---

## 📌 Scope  

The application consists of **two main functional areas**, represented as tabs in the UI:  

1. **Resume Analysis (Tab 1):**  
   - Upload a resume (PDF).  
   - Backend extracts structured data (contact info, skills, work experience, etc.).  
   - Stores data in SQLite.  
   - Sends text to **Google Gemini LLM** for:  
     - Resume rating.  
     - Areas of improvement.  
     - Suggested skills for upskilling.  
   - Displays results in a clean UI.  

2. **Historical Viewer (Tab 2):**  
   - Shows a table of all previously uploaded resumes.  
   - Each row contains key details and a **Details** button.  
   - Opens a modal to view the **full analysis** of that resume.  

3. **Resume Comparison (Extra Feature):**  
   - Allows selecting multiple resumes.  
   - Displays **side-by-side comparisons** of skills, ratings, improvements and upskill suggestions.  

---
## Features

- 📂 **Resume Upload**: Upload PDF resumes for instant processing.  
- 📊 **Resume Analysis**: Extracts candidate details, skills, and experiences.  
- 📜 **Past Resumes History**: View previously uploaded resumes in a clean history list.  
- 🔍 **Resume Details View**: Expand and see detailed analysis of each resume.  
- ⚖️ **Resume Comparison**: Select multiple resumes and compare side by side.  
- 🚨 **Alert Messages**: Friendly alerts for missing or invalid file uploads.  
- 🕒 **No History State**: Clean UI when no resumes have been uploaded yet.  

---

## 📁 Project Structure  

```bash
smart-resume-analyzer/
│
├── backend/                  
│   ├── db/               # Database configuration            
│   ├── routes/           # API routes   
│   ├── services/         # Resume analysis logic  
|   ├── main.py           # FastAPI app entry point
│   └── requirements.txt  # Python dependencies          
│  
├── frontend/                 
│   ├── public
|   ├── src
│   │   ├── components/     # React components  
│   │   │   ├── ResumeUploader.js
│   │   │   ├── PastResumes.js
│   │   │   ├── FeatureShowcase.js
│   │   ├── App.js            
│   │   └── index.js          
│   └── package.json
├── sample_data
├── screenshots
├── README.md                 # Documentation
```

---

## 🔄 Data Flow  

1. **Upload Resume**  
   - User uploads a **PDF** via frontend.  

2. **Backend Processing**  
   - API receives the file.  
   - Extracts **raw text** using pdfplumber with fallback to OCR via pytesseract. 

3. **LLM Analysis**  
   - Sends extracted text to **Google Gemini LLM**.  
   - Receives structured JSON with:  
     - Personal Details  
     - Work Experience, Education, Projects  
     - Skills (Technical + Soft Skills)  
     - AI Feedback (rating + improvement areas + upskilling suggestions).  

4. **Database Storage**  
   - JSON result is stored in **SQLite**.  

5. **Frontend Display**  
   - Analysis results shown in UI.  
   - Past resumes listed in history tab.  
   - Comparison view available for selected resumes.  

---

## Tech Stack

- **Frontend**: React.js, Material-UI  
- **Backend**: Python, FastAPI  
- **Database**: SQLite 
- **API Style**: REST API
- **LLM Integration**:Google Gemini API via @google/generative-ai SDK
- **File Processing**: pdfplumber and pytesseract 
---
## How to Run Locally

1. **Clone the repository**  
```bash
git clone https://github.com/your-username/smart-resume-analyzer.git
cd smart-resume-analyzer
```

2. **Backend Setup**  
```bash
cd backend
python -m venv venv            # Create virtual environment
source venv/bin/activate       # Linux/macOS
venv\Scripts\activate          # Windows
pip install -r requirements.txt  # Install Python dependencies
```

3. **Set environment variables**  
Create `.env` in the backend folder:  
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start the backend server**  
```bash
uvicorn main:app --reload      # FastAPI backend
```

5. **Frontend Setup**  
```bash
cd ../frontend
npm install                     # Install frontend dependencies
npm start                       # Start React app
```
> Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Screenshots

### Landing Page  
`LandingPage`  
![Landing Page](/screenshots/01_landing_page.png)

### Resume Upload Page  
`Uploaded PDF Processing Page`  
![Resume Upload](/screenshots/02_resume_upload_page.png)

### Resume Analysis Modal View
`Resume Analysis ModalView`  
![Resume Analysis Modal View](/screenshots/04a_resume_analysis_modal_view.png)

### Resume Analysis Results (Without Modal View)  
`Resume Analysis Without Modal View`  
![Resume Analysis Without Modal View](/screenshots/04c_resume_analysis_normal_view.png)

### Past Resumes History  
`Past Resumes History`  
![Past Resumes History](/screenshots/05_past_resumes_history.png)

### Past Resume Details View  
`Past Resumes Details View`  
![Past Resume Details](/screenshots/06a_past_resumes_details_modal_view.png)

### Compare Resumes Button (Glow State)  
`Compare Button Glow.png`  
![Compare Resumes Button](/screenshots/07_compare_button_highlight.png)

### Comparison of Selected Resumes  
`Comparision Of Resumes`  
![Comparison of Resumes](/screenshots/08_comparision_of_resumes_modal_view.png)

### Alert Message When PDF Not Selected  
`Alert Message When PDF Not Selected`  
![Alert Message](/screenshots/09_pdf_not_selected_alert.png)

### No History of Resumes  
`No Resume History`  
![No Resumes History](/screenshots/10_no_history_of_resumes.png)

---

## Future Enhancements

- ✅ AI-powered resume scoring  
- ✅ Export analysis reports (PDF/CSV)  
- ✅ Advanced search & filtering for past resumes  


