import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showInline, setShowInline] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a PDF file');
    const fd = new FormData();
    fd.append('resume', file);
    setLoading(true);
    try {
      // Updated to use the deployed backend
      const res = await axios.post('http://localhost:8000/api/resumes/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data.analysis);
      console.log(result);
      setShowInline(false);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 7) return 'success';
    if (rating >= 5) return 'warning';
    return 'error';
  };

  const AnalysisContent = ({ data }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'primary.main', bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="h6">Basic Information</Typography>
          <Typography><strong>Name:</strong> {data.name || '-'}</Typography>
          <Typography><strong>Email:</strong> {data.email || '-'}</Typography>
          <Typography><strong>Phone:</strong> {data.phone || '-'}</Typography>
        </CardContent>
      </Card>

      {data.core_skills && data.core_skills.length > 0 && (
        <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'info.main', bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Core Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.core_skills.map((skill, i) => (
                <Chip key={i} label={skill} variant="outlined" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {data.soft_skills && data.soft_skills.length > 0 && (
        <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'secondary.main', bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Soft Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.soft_skills.map((skill, i) => (
                <Chip key={i} label={skill} variant="outlined" color="secondary" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Resume Rating</Typography>
          <Chip label={`${data.resume_rating || '-'}/10`} color={getRatingColor(data.resume_rating || 0)} size="large" />
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'error.main' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Improvement Areas</Typography>
          <Typography>{data.improvement_areas || '-'}</Typography>
        </CardContent>
      </Card>

      {data.upskill_suggestions && data.upskill_suggestions.length > 0 && (
        <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'success.main' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Upskill Suggestions</Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {data.upskill_suggestions.map((s, i) => (
                <Typography key={i} component="li" variant="body1">
                  {s}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, bgcolor: 'white' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Upload Your Resume
        </Typography>

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ borderRadius: 2 }}
          >
            {file ? file.name : 'Select PDF'}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload & Analyze'}
          </Button>
        </Box>

        {!result && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
            Upload your resume to get an instant analysis with improvement areas.
          </Alert>
        )}

        <Dialog
          open={!!result && !showInline}
          onClose={() => setShowInline(true)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'white' }}>
            Resume Analysis Result
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: 'grey.50', py: 2 }}>
            {result && <AnalysisContent data={result} />}
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button onClick={() => setShowInline(true)} variant="contained">
              Close
            </Button>
          </Box>
        </Dialog>

        {result && showInline && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Resume Analysis
            </Typography>
            <AnalysisContent data={result} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
