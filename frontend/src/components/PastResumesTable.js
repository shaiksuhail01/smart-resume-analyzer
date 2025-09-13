import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Chip,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { History, CloudUpload } from '@mui/icons-material';

const PastResumesTable = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [openCompare, setOpenCompare] = useState(false);

  useEffect(() => {
    fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/resumes');
      setRows(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to load history');
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/resumes/${id}`);
      setSelected(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to load details');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 7) return 'success';
    if (rating >= 5) return 'warning';
    return 'error';
  };

  const handleSelectForCompare = async (resume) => {
    if (selectedForCompare.find(r => r.id === resume.id)) {
      setSelectedForCompare(prev => prev.filter(r => r.id !== resume.id));
      return;
    }

    if (selectedForCompare.length >= 2) return;

    try {
      const res = await axios.get(`http://localhost:8000/api/resumes/${resume.id}`);
      setSelectedForCompare(prev => [...prev, res.data]);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch resume details for comparison');
    }
  };

  return (
    <Box>
      {rows.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, color: 'text.secondary' }}>
          <History sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
          <Typography variant="h6" gutterBottom>No Resumes Found</Typography>
          <Typography variant="body2" textAlign="center" sx={{ maxWidth: 400, mb: 3 }}>
            You haven't uploaded any resumes yet. Once you upload and analyze your resume, they'll appear here in your history for quick access.
          </Typography>
          <Button variant="contained" startIcon={<CloudUpload />} onClick={() => (window.location.href = '/resume-uploader')}>
            Upload Resume
          </Button>
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.dark' }}>
                <TableRow>
                  {['Select', 'ID', 'File Name', 'Name', 'Email', 'Rating', 'Actions'].map((head, idx) => (
                    <TableCell key={idx} sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', py: 2 }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={r.id} sx={{
                    backgroundColor: i % 2 === 0 ? 'grey.50' : 'grey.100',
                    '&:hover': { backgroundColor: 'primary.light', boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)' },
                    transition: '0.2s'
                  }}>
                    <TableCell>
                      <Checkbox
                        checked={!!selectedForCompare.find(resume => resume.id === r.id)}
                        onChange={() => handleSelectForCompare(r)}
                        disabled={!selectedForCompare.find(resume => resume.id === r.id) && selectedForCompare.length >= 2}
                      />
                    </TableCell>
                    <TableCell>{r.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{r.filename}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{r.email}</TableCell>
                    <TableCell>
                      <Chip label={`${r.resume_rating}/10`} color={getRatingColor(r.resume_rating)} size="small" sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained" 
                        color="primary"
                        size="small"
                        sx={{ textTransform: 'none' }} 
                        onClick={() => openDetails(r.id)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="secondary"
            disabled={selectedForCompare.length !== 2}
            sx={{ mt: 2 }}
            onClick={() => setOpenCompare(true)}
          >
            Compare Selected Resumes
          </Button>

          {/* Comparison Modal */}
          <Dialog open={openCompare} onClose={() => setOpenCompare(false)} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'white' }}>Resume Comparison</DialogTitle>
            <DialogContent dividers>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'primary.main' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Field</TableCell>
                      {selectedForCompare.map(resume => (
                        <TableCell key={resume.id} sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                          {resume.name || resume.filename}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Core Skills</strong></TableCell>
                      {selectedForCompare.map(resume => (
                        <TableCell key={resume.id}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {resume.core_skills?.map((skill, idx) => (
                              <Chip key={idx} label={skill} size="small" variant="outlined" />
                            )) || '-'}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Soft Skills</strong></TableCell>
                      {selectedForCompare.map(resume => (
                        <TableCell key={resume.id}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {resume.soft_skills?.map((skill, idx) => (
                              <Chip key={idx} label={skill} size="small" variant="outlined" color="secondary" />
                            )) || '-'}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Resume Rating</strong></TableCell>
                      {selectedForCompare.map(resume => (
                        <TableCell key={resume.id} sx={{ textAlign: 'center' }}>
                          <Chip
                            label={`${resume.resume_rating || '-'} /10`}
                            color={getRatingColor(resume.resume_rating)}
                            size="small"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Improvements</strong></TableCell>
                      {selectedForCompare.map(resume => (
                        <TableCell key={resume.id}>{resume.improvement_areas || '-'}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Upskill Suggestions</strong></TableCell>
                      {selectedForCompare.map(resume => (
                        <TableCell key={resume.id}>
                          {resume.upskill_suggestions?.length > 0 ? (
                            <List dense sx={{ py: 0 }}>
                              {resume.upskill_suggestions.map((suggestion, idx) => (
                                <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                                  <ListItemText 
                                    primary={`• ${suggestion}`} 
                                    primaryTypographyProps={{ variant: 'body2' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <Button variant="contained" onClick={() => setOpenCompare(false)}>Close</Button>
            </Box>
          </Dialog>
        </Box>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'white' }}>
          {selected?.name || selected?.filename} - Details
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Info */}
              <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'primary.main', bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                  <Typography><strong>Name:</strong> {selected.name || '-'}</Typography>
                  <Typography><strong>Email:</strong> {selected.email || '-'}</Typography>
                  <Typography><strong>Phone:</strong> {selected.phone || '-'}</Typography>
                </CardContent>
              </Card>

              {/* Core Skills */}
              {selected.core_skills?.length > 0 && (
                <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'info.main', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Core Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selected.core_skills.map((skill, i) => (
                        <Chip key={i} label={skill} variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Soft Skills */}
              {selected.soft_skills?.length > 0 && (
                <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'secondary.main', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Soft Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selected.soft_skills.map((skill, i) => (
                        <Chip key={i} label={skill} variant="outlined" color="secondary" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              {selected.work_experience?.length > 0 && (
                <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'warning.main', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Work Experience</Typography>
                    {selected.work_experience.map((we, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography>
                          {we.title && <strong>{we.title}</strong>}
                          {we.company && ` at ${we.company}`}
                          {we.duration && ` (${we.duration})`}
                          {we.location && ` — ${we.location}`}
                        </Typography>
                        {we.description && <Typography variant="body2">{we.description}</Typography>}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {selected.education?.length > 0 && (
                <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'success.main', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Education</Typography>
                    {selected.education.map((ed, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography>
                          {ed.degree && <strong>{ed.degree}</strong>}
                          {ed.university && `, ${ed.university}`}
                          {ed.duration && ` (${ed.duration})`}
                          {ed.location && ` — ${ed.location}`}
                        </Typography>
                        {ed.cgpa && <Typography variant="body2">CGPA: {ed.cgpa}</Typography>}
                        {ed.percentage && <Typography variant="body2">Percentage: {ed.percentage}</Typography>}
                        {ed.additional && <Typography variant="body2">Additional: {ed.additional}</Typography>}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              {selected.projects?.length > 0 && (
                <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'info.main', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Projects</Typography>
                    {selected.projects.map((project, idx) => (
                      <Box key={idx} sx={{ mb: 3 }}>
                        {project.name && (
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>{project.name}</strong>
                          </Typography>
                        )}
                        {project.description && (
                          <Typography variant="body2" paragraph>
                            {project.description}
                          </Typography>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {project.technologies.map((tech, techIdx) => (
                              <Chip key={techIdx} label={tech} size="small" variant="outlined" color="primary" />
                            ))}
                          </Box>
                        )}
                        {idx < selected.projects.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {selected.certifications?.length > 0 && (
                <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'secondary.main', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Certifications</Typography>
                    <List>
                      {selected.certifications.map((cert, idx) => (
                        <ListItem key={idx} sx={{ py: 1 }}>
                          <ListItemText 
                            primary={cert.name} 
                            secondary={cert.issuer ? `Issued by: ${cert.issuer}` : null}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Feedback */}
              {(selected.resume_rating || selected.improvement_areas || selected.upskill_suggestions?.length > 0) && (
                <Card variant="outlined" sx={{ borderLeft: 4, borderColor: 'error.main', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Feedback</Typography>
                    {selected.resume_rating && (
                      <Typography>
                        <strong>Resume Rating:</strong>{' '}
                        <Chip label={`${selected.resume_rating}/10`} color={getRatingColor(selected.resume_rating)} size="small" />
                      </Typography>
                    )}
                    {selected.improvement_areas && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom><strong>Improvement Areas:</strong></Typography>
                        <Typography variant="body2">{selected.improvement_areas}</Typography>
                      </Box>
                    )}
                    {selected.upskill_suggestions?.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom><strong>Upskill Suggestions:</strong></Typography>
                        <List dense>
                          {selected.upskill_suggestions.map((suggestion, i) => (
                            <ListItem key={i} sx={{ py: 0.5 }}>
                              <ListItemText primary={`• ${suggestion}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={() => setSelected(null)} variant="contained">Close</Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PastResumesTable;