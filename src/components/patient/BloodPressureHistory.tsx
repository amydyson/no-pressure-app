import { Box, Typography, Card, CardContent, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useContext, useEffect, useState } from "react";
import LanguageContext from "../../LanguageContext";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

interface BloodPressureHistoryProps {
  userInfo: {
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null;
}

const BloodPressureHistory = ({ userInfo }: BloodPressureHistoryProps) => {
  const { language } = useContext(LanguageContext);
  const [readings, setReadings] = useState<Schema["BloodPressureReading"]["type"][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [readingToDelete, setReadingToDelete] = useState<Schema["BloodPressureReading"]["type"] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [readingToEdit, setReadingToEdit] = useState<Schema["BloodPressureReading"]["type"] | null>(null);
  const [editSystolic, setEditSystolic] = useState("");
  const [editDiastolic, setEditDiastolic] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchReadings = async () => {
      if (!userInfo?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await client.models.BloodPressureReading.list({
          filter: {
            userId: {
              eq: userInfo.userId
            }
          }
        });

        if (response.data) {
          // Sort by date (newest first)
          const sortedReadings = response.data.sort((a, b) => {
            const dateA = new Date(a.readingDate);
            const dateB = new Date(b.readingDate);
            return dateB.getTime() - dateA.getTime();
          });
          setReadings(sortedReadings);
          
          // Generate AI assessment if we have multiple readings
          if (sortedReadings.length >= 3) {
            generateAIAssessment(sortedReadings);
          }
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadings();
  }, [userInfo?.userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'pt') {
      return date.toLocaleDateString('pt-BR');
    }
    return date.toLocaleDateString('en-US');
  };

  const handleDeleteClick = (reading: Schema["BloodPressureReading"]["type"]) => {
    setReadingToDelete(reading);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!readingToDelete) return;
    
    setIsDeleting(true);
    try {
      await client.models.BloodPressureReading.delete({ id: readingToDelete.id });
      setReadings(prev => prev.filter(r => r.id !== readingToDelete.id));
      setDeleteDialogOpen(false);
      setReadingToDelete(null);
    } catch (error) {
      console.error('Error deleting reading:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setReadingToDelete(null);
  };

  const handleEditClick = (reading: Schema["BloodPressureReading"]["type"]) => {
    setReadingToEdit(reading);
    setEditSystolic(reading.systolic.toString());
    setEditDiastolic(reading.diastolic.toString());
    setEditDate(reading.readingDate);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!readingToEdit) return;
    
    setIsUpdating(true);
    try {
      const updatedReading = await client.models.BloodPressureReading.update({
        id: readingToEdit.id,
        systolic: parseInt(editSystolic),
        diastolic: parseInt(editDiastolic),
        readingDate: editDate
      });
      
      if (updatedReading.data) {
        setReadings(prev => prev.map(r => 
          r.id === readingToEdit.id ? updatedReading.data! : r
        ));
      }
      
      setEditDialogOpen(false);
      setReadingToEdit(null);
    } catch (error) {
      console.error('Error updating reading:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setReadingToEdit(null);
  };

  const generateAIAssessment = async (readings: Schema["BloodPressureReading"]["type"][]) => {
    setIsAnalyzing(true);
    try {
      // Simple trend analysis
      const recent = readings.slice(0, 3);
      const older = readings.slice(3, 6);
      
      const recentAvgSys = recent.reduce((sum, r) => sum + r.systolic, 0) / recent.length;
      const recentAvgDia = recent.reduce((sum, r) => sum + r.diastolic, 0) / recent.length;
      
      let assessment = "";
      
      if (older.length > 0) {
        const olderAvgSys = older.reduce((sum, r) => sum + r.systolic, 0) / older.length;
        const olderAvgDia = older.reduce((sum, r) => sum + r.diastolic, 0) / older.length;
        
        const sysTrend = recentAvgSys - olderAvgSys;
        const diaTrend = recentAvgDia - olderAvgDia;
        
        if (sysTrend < -5 || diaTrend < -3) {
          assessment = language === 'pt' 
            ? 'Sua pressão arterial está melhorando nas últimas leituras. Continue com os bons hábitos!'
            : 'Your blood pressure is improving in recent readings. Keep up the good habits!';
        } else if (sysTrend > 5 || diaTrend > 3) {
          assessment = language === 'pt'
            ? 'Sua pressão arterial está aumentando recentemente. Considere consultar um médico.'
            : 'Your blood pressure is increasing recently. Consider consulting a doctor.';
        } else {
          assessment = language === 'pt'
            ? 'Sua pressão arterial está relativamente estável nas últimas leituras.'
            : 'Your blood pressure is relatively stable in recent readings.';
        }
      }
      
      // Add current level assessment
      if (recentAvgSys >= 140 || recentAvgDia >= 90) {
        assessment += language === 'pt'
          ? ' Suas leituras recentes estão elevadas.'
          : ' Your recent readings are elevated.';
      } else if (recentAvgSys < 120 && recentAvgDia < 80) {
        assessment += language === 'pt'
          ? ' Suas leituras recentes estão na faixa normal.'
          : ' Your recent readings are in the normal range.';
      }
      
      setAiAssessment(assessment);
    } catch (error) {
      console.error('Error generating assessment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          {language === 'pt' ? 'Carregando...' : 'Loading...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2F4F4F' }}>
        {language === 'pt' ? 'Histórico de Pressão Arterial' : 'Blood Pressure History'}
      </Typography>

      {/* AI Assessment */}
      {isAnalyzing && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">
            {language === 'pt' ? 'Analisando tendências...' : 'Analyzing trends...'}
          </Typography>
        </Box>
      )}
      
      {aiAssessment && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {language === 'pt' ? 'Avaliação da IA:' : 'AI Assessment:'}
          </Typography>
          <Typography variant="body2">{aiAssessment}</Typography>
        </Alert>
      )}

      {readings.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
          {language === 'pt' ? 'Nenhuma leitura encontrada.' : 'No readings found.'}
        </Typography>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {readings.map((reading) => (
            <Card key={reading.id} sx={{ bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#BE550F', fontWeight: 'bold' }}>
                      {reading.systolic}/{reading.diastolic} mmHg
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {formatDate(reading.readingDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {language === 'pt' ? 'Sistólica' : 'Systolic'}: {reading.systolic}
                      </Typography>
                      <br />
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {language === 'pt' ? 'Diastólica' : 'Diastolic'}: {reading.diastolic}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => handleEditClick(reading)}
                      sx={{ color: '#1976d2' }}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(reading)}
                      sx={{ color: '#d32f2f' }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>
          {language === 'pt' ? 'Confirmar Exclusão' : 'Confirm Delete'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {language === 'pt' 
              ? 'Tem certeza de que deseja excluir esta leitura?' 
              : 'Are you sure you want to delete this reading?'}
          </Typography>
          {readingToDelete && (
            <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
              {readingToDelete.systolic}/{readingToDelete.diastolic} mmHg - {formatDate(readingToDelete.readingDate)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
            variant="contained"
          >
            {isDeleting 
              ? (language === 'pt' ? 'Excluindo...' : 'Deleting...') 
              : (language === 'pt' ? 'Excluir' : 'Delete')
            }
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          {language === 'pt' ? 'Editar Leitura' : 'Edit Reading'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={language === 'pt' ? 'Sistólica (mmHg)' : 'Systolic (mmHg)'}
              type="number"
              value={editSystolic}
              onChange={(e) => setEditSystolic(e.target.value)}
              inputProps={{ min: 50, max: 250 }}
              fullWidth
            />
            <TextField
              label={language === 'pt' ? 'Diastólica (mmHg)' : 'Diastolic (mmHg)'}
              type="number"
              value={editDiastolic}
              onChange={(e) => setEditDiastolic(e.target.value)}
              inputProps={{ min: 30, max: 150 }}
              fullWidth
            />
            <TextField
              label={language === 'pt' ? 'Data da Leitura' : 'Reading Date'}
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} disabled={isUpdating}>
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleEditConfirm} 
            color="primary" 
            disabled={isUpdating}
            variant="contained"
          >
            {isUpdating 
              ? (language === 'pt' ? 'Salvando...' : 'Saving...') 
              : (language === 'pt' ? 'Salvar' : 'Save')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodPressureHistory;