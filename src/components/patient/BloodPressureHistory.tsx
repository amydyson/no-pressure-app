import { Box, Typography, Card, CardContent, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
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
    </Box>
  );
};

export default BloodPressureHistory;