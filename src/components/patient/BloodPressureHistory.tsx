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
      // Sort readings chronologically (oldest first)
      const chronological = [...readings].sort((a, b) => {
        const dateA = new Date(a.readingDate);
        const dateB = new Date(b.readingDate);
        return dateA.getTime() - dateB.getTime();
      });
      
      const latest = chronological[chronological.length - 1];
      const earliest = chronological[0];
      
      let assessment = "";
      
      // Analyze trend over time
      if (chronological.length >= 3) {
        const sysTrend = latest.systolic - earliest.systolic;
        const diaTrend = latest.diastolic - earliest.diastolic;
        
        // Describe the trend
        if (sysTrend < -10 || diaTrend < -5) {
          assessment = language === 'pt'
            ? 'Sua pressão arterial mostrou uma melhoria significativa ao longo do tempo.'
            : 'Your blood pressure has shown significant improvement over time.';
        } else if (sysTrend > 10 || diaTrend > 5) {
          assessment = language === 'pt'
            ? 'Sua pressão arterial tem aumentado ao longo do tempo.'
            : 'Your blood pressure has been increasing over time.';
        } else {
          assessment = language === 'pt'
            ? 'Sua pressão arterial tem se mantido relativamente estável.'
            : 'Your blood pressure has remained relatively stable.';
        }
      }
      
      // Assess current level using correct thresholds
      if (latest.systolic >= 180 || latest.diastolic >= 120) {
        assessment += language === 'pt'
          ? ' Sua leitura mais recente está em nível de crise - procure atendimento médico imediatamente.'
          : ' Your most recent reading is at crisis level - seek immediate medical attention.';
      } else if (latest.systolic >= 140 || latest.diastolic >= 90) {
        assessment += language === 'pt'
          ? ' Sua leitura atual indica pressão alta - consulte um médico.'
          : ' Your current reading indicates high blood pressure - consult a doctor.';
      } else if (latest.systolic >= 130 || latest.diastolic > 80) {
        assessment += language === 'pt'
          ? ' Sua leitura atual está em estágio 1 de hipertensão - monitore regularmente.'
          : ' Your current reading shows stage 1 hypertension - monitor regularly.';
      } else if (latest.systolic >= 120 && latest.diastolic <= 80) {
        assessment += language === 'pt'
          ? ' Sua leitura atual está elevada - adote hábitos saudáveis.'
          : ' Your current reading is elevated - adopt healthy habits.';
      } else {
        assessment += language === 'pt'
          ? ' Sua leitura atual está na faixa normal - continue os bons hábitos.'
          : ' Your current reading is in the normal range - keep up the good habits.';
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