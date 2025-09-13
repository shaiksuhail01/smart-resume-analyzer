import React, { useState } from 'react';
import { Container, Paper } from '@mui/material';
import FeatureShowcase from './components/FeatureShowcase';
import ResumeUploader from './components/ResumeUploader';
import PastResumesTable from './components/PastResumesTable';
import { Box, Tabs, Tab,Typography } from '@mui/material';

const App = () => {
  const [showFeatures, setShowFeatures] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 4 }}>
      {showFeatures ? (
        <FeatureShowcase onStart={() => setShowFeatures(false)} />
      ) : (
        <Container maxWidth="lg">
         <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Resume Analyzer
          </Typography>
          <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: 3 }}>
            <Tabs
              value={tabIndex}
              onChange={(e, newValue) => setTabIndex(newValue)}
              indicatorColor="primary"
              textColor="primary"
              sx={{ mb: 2 }}
            >
              <Tab label="Resume Analysis" />
              <Tab label="Historical Viewer" />
            </Tabs>

            <Box>
              {tabIndex === 0 && <ResumeUploader />}
              {tabIndex === 1 && <PastResumesTable />}
            </Box>
          </Paper>
        </Container>
      )}
    </Box>
  );
};

export default App;
