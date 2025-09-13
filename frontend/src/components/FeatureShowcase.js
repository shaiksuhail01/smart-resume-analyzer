import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { CloudUpload, Insights, TableView, CompareArrows, Star } from '@mui/icons-material';

const features = [
  { title: 'Live Resume Analysis', description: 'Instantly analyze your resume and get AI-driven insights.', icon: <Insights fontSize="large" />, color: '#1976d2' }, // primary
  { title: 'File Upload & Parsing', description: 'Upload PDF resumes. The system extracts and structures your data automatically.', icon: <CloudUpload fontSize="large" />, color: '#9c27b0' }, // secondary
  { title: 'AI Feedback & Ratings', description: 'Receive a rating, improvement areas, and upskilling suggestions.', icon: <Star fontSize="large" />, color: '#ed6c02' }, // warning
  { title: 'Structured Data Display', description: 'View personal info, skills, work experience, education, projects, and certifications.', icon: <TableView fontSize="large" />, color: '#2e7d32' }, // success
  { title: 'Historical Viewer', description: 'Access all previously uploaded resumes in one place.', icon: <TableView fontSize="large" />, color: '#0288d1' }, // info
  { title: 'Resume Comparison', description: 'Compare multiple resumes side by side for skills, ratings, and feedback.', icon: <CompareArrows fontSize="large" />, color: '#d32f2f' } // error
];

const FeatureShowcase = ({ onStart }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8, px: 2 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
        Welcome to Resume Analyzer
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
        {features.map((feature, idx) => (
          <Card
            key={idx}
            variant="outlined"
            sx={{
              flex: '1 1 300px',
              maxWidth: 350,
              borderLeft: 4,
              borderColor: feature.color,
              bgcolor: 'grey.50',
              p: 3,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: `0px 4px 20px ${feature.color}33`, 
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0px 8px 25px ${feature.color}55` 
              }
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2, color: feature.color }}>{feature.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button variant="contained" size="large" onClick={onStart} sx={{ px: 6, py: 1.5, fontWeight: 600 }}>
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default FeatureShowcase;
