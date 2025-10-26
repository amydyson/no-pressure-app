import { useRef, useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { TextField, FormHelperText, Box, Button, Alert, Typography, Paper, FormControl, FormLabel, ToggleButton, ToggleButtonGroup, Switch, FormControlLabel, MenuItem, Select, InputLabel } from "@mui/material";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

import LanguageContext from "../../LanguageContext";
import { useNavigate } from "react-router-dom";
import manImage from "../../assets/images/illustrations/man.png";
import womanImage from "../../assets/images/illustrations/woman.png";
import bookIcon from "../../assets/images/avatar-icons/book.png";
import catIcon from "../../assets/images/avatar-icons/cat.png";
import dogIcon from "../../assets/images/avatar-icons/dog.png";
import flowerIcon from "../../assets/images/avatar-icons/flower.png";
import guitarIcon from "../../assets/images/avatar-icons/guitar.png";
import headphonesIcon from "../../assets/images/avatar-icons/headphones.png";
import moonIcon from "../../assets/images/avatar-icons/moon.png";
import sunIcon from "../../assets/images/avatar-icons/sun.png";
import umbrellaIcon from "../../assets/images/avatar-icons/umbrella.png";

const schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be at least 2 characters" })
    .max(100, { message: "Must not exceed 100 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Must be at least 2 characters" })
    .max(100, { message: "Must not exceed 100 characters" }),
  avatar: z
    .string()
    .optional(),
  dateOfBirth: z
    .string()
    .optional(),
  height: z
    .number({ invalid_type_error: "Height must be a number" })
    .positive({ message: "Height must be positive" })
    .optional(),
  weight: z
    .number({ invalid_type_error: "Weight must be a number" })
    .positive({ message: "Weight must be positive" })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const client = generateClient<Schema>();

interface PatientProps {
  userInfo: {
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null;
}

const Patient = ({ userInfo }: PatientProps) => {
  const navigate = useNavigate();
  // Get language from context (always call at top level)
  const { language } = useContext(LanguageContext) as { language: string };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [existingPatient, setExistingPatient] = useState<Schema["Patient"]["type"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [gender, setGender] = useState<string>("female"); // Default to female
  const [isSmoker, setIsSmoker] = useState<boolean>(false); // Default to non-smoker
  const [exercisesDaily, setExercisesDaily] = useState<boolean>(false); // Default to no daily exercise
  // ...existing code...
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Listen for custom event to open edit dialog from header avatar
  useEffect(() => {
    const handleOpenEditDialog = () => {
      if (existingPatient) {
        setIsEditing(true);
        setEditDialogOpen(true);
        setSubmitMessage(null);
        // Pre-populate the form with existing data
        reset({
          firstName: existingPatient.firstName,
          lastName: existingPatient.lastName,
          avatar: existingPatient.avatar || undefined,
          dateOfBirth: existingPatient.dateOfBirth || undefined,
          height: existingPatient.height || undefined,
          weight: existingPatient.weight || undefined
        });
        setGender(existingPatient.gender || "female");
        setIsSmoker(existingPatient.isSmoker || false);
        setExercisesDaily(existingPatient.exercisesDaily || false);
      }
    };
    window.addEventListener('openEditPatientDialog', handleOpenEditDialog);
    return () => {
      window.removeEventListener('openEditPatientDialog', handleOpenEditDialog);
    };
  }, [existingPatient, reset]);

  // For caret management in DOB field
  const dobInputRef = useRef<HTMLInputElement>(null);





  // Check for existing patient record when component loads
  useEffect(() => {
    const checkExistingPatient = async () => {
      if (!userInfo?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Query for patient records with this userId (if userId exists)
        let response;
        if (userInfo?.userId) {
          response = await client.models.Patient.list({
            filter: {
              userId: {
                eq: userInfo.userId || ""
              }
            }
          });
        } else {
          // No userId available, treat as new patient

          setExistingPatient(null);
          setIsLoading(false);
          return;
        }

        if (response.data && response.data.length > 0) {
          // Patient record exists
          const patientData = response.data[0];
          if (patientData) {
            setExistingPatient(patientData); // Get the first record
            // Set all state variables from existing data with safe access
            setGender(patientData.gender || "female");
            setIsSmoker(patientData.isSmoker || false);
            setExercisesDaily(patientData.exercisesDaily || false);
            // Store avatar in localStorage for header
            if (patientData.avatar) {
              localStorage.setItem('avatar', patientData.avatar);
            } else {
              localStorage.removeItem('avatar');
            }
          } else {
            // Patient data is null
            setExistingPatient(null);
            localStorage.removeItem('avatar');
          }
        } else {
          // No patient record found
          setExistingPatient(null);
          localStorage.removeItem('avatar');
        }
      } catch (error) {
        console.error("Error checking for existing patient:", error);
        
        // If there are corrupted records, we'll treat this as a new patient

        
        setExistingPatient(null);
        // Reset state variables to defaults on error
        setGender("female");
        setIsSmoker(false);
        setExercisesDaily(false);
        
        // Show a message to the user about starting fresh
        setSubmitMessage({
          type: 'info',
          text: 'Starting with a fresh patient profile. Previous data may have been corrupted.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingPatient();
  }, [userInfo?.userId]);

  const onSubmit = async (data: FormData) => {

    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {

      // Date of birth is always a string from the form (YYYY-MM-DD), no conversion needed
      const processedDateOfBirth = data.dateOfBirth;
      if (processedDateOfBirth) {
        // Already in correct format

      }
      if (!userInfo?.userId) {
        console.warn('User ID not available, creating patient without userId');
      }
      if (!userInfo?.email) {
        console.warn('User email not available');
      }

      let response;
      
      if (isEditing) {
        // Update existing patient record
        // First, find the existing patient ID by querying with userId
        const existingRecords = await client.models.Patient.list({
          filter: {
            userId: {
              eq: userInfo?.userId || ""
            }
          }
        });
        
        if (existingRecords.data && existingRecords.data.length > 0) {
          const existingId = existingRecords.data[0].id;
          
          // Update debug info removed
          
          response = await client.models.Patient.update({
            id: existingId,
            userId: userInfo?.userId || undefined,
            firstName: data.firstName,
            lastName: data.lastName,
            email: userInfo?.email || undefined,
            avatar: data.avatar || undefined,
            gender: gender || undefined,
            isSmoker: isSmoker !== undefined ? isSmoker : undefined,
            dateOfBirth: processedDateOfBirth || undefined,
            height: data.height || undefined,
            weight: data.weight || undefined,
            exercisesDaily: exercisesDaily !== undefined ? exercisesDaily : undefined,
          });
          

        } else {
          throw new Error('Could not find existing patient record to update');
        }
      } else {
        // Create new patient record
        const createData = {
          userId: userInfo?.userId || undefined,
          firstName: data.firstName,
          lastName: data.lastName,
          email: userInfo?.email || undefined,
          avatar: data.avatar || undefined,
          gender: gender || undefined,
          isSmoker: isSmoker !== undefined ? isSmoker : undefined,
          dateOfBirth: processedDateOfBirth || undefined,
          height: data.height || undefined,
          weight: data.weight || undefined,
          exercisesDaily: exercisesDaily !== undefined ? exercisesDaily : undefined,
        };
        

        
        response = await client.models.Patient.create(createData);
      }
      
      if (response && response.data) {
        // Set the patient data and show success message
        setExistingPatient(response.data);
        // Store avatar in localStorage for header
        if (response.data.avatar) {
          localStorage.setItem('avatar', response.data.avatar);
        } else {
          localStorage.removeItem('avatar');
        }
        // Dispatch event so header updates avatar immediately
        window.dispatchEvent(new Event('storage'));
        // Update all state variables to match the updated data
        if (isEditing) {
          setGender(response.data.gender || "female");
          setIsSmoker(response.data.isSmoker || false);
          setExercisesDaily(response.data.exercisesDaily || false);
        }
        setSubmitMessage({
          type: 'success',
          text: isEditing 
            ? (language === 'pt' ? 'Informações do paciente atualizadas com sucesso!' : 'Patient information updated successfully!')
            : (language === 'pt' 
                ? `Paciente ${data.firstName} ${data.lastName} foi adicionado com sucesso!`
                : `Patient ${data.firstName} ${data.lastName} has been successfully added!`)
        });
        // Hide the success banner after 30 seconds
        setTimeout(() => {
          setSubmitMessage(current => current && current.type === 'success' ? null : current);
        }, 30000);
        setIsEditing(false); // Reset editing state
        reset(); // Clear the form
      } else {
        localStorage.removeItem('avatar');
        throw new Error(isEditing ? 'Failed to update patient record' : 'Failed to create patient record');
      }
    } catch (error) {
      console.error('Error creating/updating patient:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to save patient information. ';
      if (error instanceof Error) {
        errorMessage += `Error: ${error.message}`;
      } else {
        errorMessage += 'Please try again.';
      }
      
      setSubmitMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading...</Typography>
      </Box>
    );
  }



  // Existing patient screen
  if (existingPatient) {
    return (
      <Paper 
        sx={{
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 1, sm: 2 },
          mx: 'auto',
          textAlign: 'center',
          bgcolor: '#d7e9f7',
          borderRadius: 2,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'clip',
        }}
      >
        {/* Success message if just created */}
        {submitMessage && (
          <Box sx={{ mb: 3 }}>
            <Alert severity={submitMessage.type}>
              {submitMessage.text}
            </Alert>
          </Box>
        )}
        
        <Typography variant="h4" gutterBottom sx={{ color: '#2F4F4F' }}>
          {language === 'pt' ? 'Informações do Paciente' : 'Patient Information'}
        </Typography>
        
        {/* Main Content - Two Section Layout */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: { xs: 0, sm: 2 }, 
          mt: 4,
          alignItems: { xs: 'center', md: 'flex-start' },
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
        }}>
          
          {/* Left - Gender Illustrations */}
          <Box sx={{ 
            flex: { xs: 'none', md: 1 }, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            px: { xs: 0, sm: 2, md: 4 },
            py: { xs: 1, sm: 2 },
            minHeight: { xs: 'auto', md: '350px' },
            justifyContent: 'center',
            width: '100%',
            maxWidth: { xs: '100%', md: 520 },
            minWidth: 0,
          }}>
            {/* Gender Illustrations */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0, mb: 1, width: '100%', maxWidth: 400, minWidth: 0 }}>
              <Box sx={{ textAlign: 'center', width: { xs: '50%', md: 'auto' }, minWidth: 0 }}>
                <img 
                  src={manImage}
                  alt="man illustration"
                  style={{ 
                    width: '100%', 
                    maxWidth: 160, 
                    height: 'auto', 
                    objectFit: 'contain',
                    border: 'none',
                    opacity: 1,
                    backgroundColor: 'transparent',
                  }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', width: { xs: '50%', md: 'auto' }, minWidth: 0 }}>
                <img 
                  src={womanImage}
                  alt="woman illustration"
                  style={{ 
                    width: '100%', 
                    maxWidth: 160, 
                    height: 'auto', 
                    objectFit: 'contain',
                    border: 'none',
                    opacity: 1,
                    backgroundColor: 'transparent',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Right - Patient Details in Two Columns */}
          <Box sx={{ 
            flex: { xs: 'none', md: 2 }, 
            border: { xs: '1px solid #BE550F', md: 'none' },
            px: { xs: 1, sm: 2, md: 4 },
            py: { xs: 1, sm: 2 },
            width: '100%',
            maxWidth: { xs: '100%', md: 700 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'stretch' },
            minWidth: 0,
          }}>
            {/* Two Column Grid for Information */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: 3,
              textAlign: 'left',
              maxWidth: { xs: '100%', sm: 500, md: 'none' },
              width: '100%',
              minWidth: 0,
            }}>
              
              {/* First Row - Names Side by Side */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#BE550F' }}>
                  {language === 'pt' ? 'Nome' : 'First Name'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.firstName}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Sobrenome' : 'Last Name'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.lastName}
                </Typography>
              </Box>
              
              {/* Avatar Display */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Avatar' : 'Avatar'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {existingPatient.avatar ? (
                    <>
                      {(existingPatient.avatar === 'book' ||
                        existingPatient.avatar === 'cat' ||
                        existingPatient.avatar === 'dog' ||
                        existingPatient.avatar === 'flower' ||
                        existingPatient.avatar === 'guitar' ||
                        existingPatient.avatar === 'headphones' ||
                        existingPatient.avatar === 'moon' ||
                        existingPatient.avatar === 'sun' ||
                        existingPatient.avatar === 'umbrella') && (
                          <img
                            src={
                              existingPatient.avatar === 'book' ? bookIcon :
                              existingPatient.avatar === 'cat' ? catIcon :
                              existingPatient.avatar === 'dog' ? dogIcon :
                              existingPatient.avatar === 'flower' ? flowerIcon :
                              existingPatient.avatar === 'guitar' ? guitarIcon :
                              existingPatient.avatar === 'headphones' ? headphonesIcon :
                              existingPatient.avatar === 'moon' ? moonIcon :
                              existingPatient.avatar === 'sun' ? sunIcon :
                              umbrellaIcon
                            }
                            alt={existingPatient.avatar}
                            style={{ width: 56, height: 56, objectFit: 'contain', aspectRatio: '1/1' }}
                        />
                      )}
                      {/* Avatar name removed, only icon shown */}
                    </>
                  ) : (
                    <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                      No avatar selected
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Gênero' : 'Gender'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.gender
                    ? language === 'pt'
                      ? (existingPatient.gender === 'female' ? 'Feminino' : existingPatient.gender === 'male' ? 'Masculino' : existingPatient.gender)
                      : (existingPatient.gender.charAt(0).toUpperCase() + existingPatient.gender.slice(1))
                    : (language === 'pt' ? 'Não especificado' : 'Not specified')}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Data de Nascimento' : 'Date of Birth'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.dateOfBirth ? (() => {
                    // Accepts YYYY-MM-DD or DD/MM/YYYY only
                    let year, month, day;
                    const input = existingPatient.dateOfBirth;
                    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
                      // YYYY-MM-DD
                      [year, month, day] = input.split('-');
                    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
                      // DD/MM/YYYY
                      [day, month, year] = input.split('/');
                    } else {
                      return input;
                    }
                    // Remove leading zeros
                    day = String(Number(day));
                    month = String(Number(month));
                    // Month abbreviations
                    const monthAbbrEN = [
                      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ];
                    const monthAbbrPT = [
                      '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
                    ];
                    const m = parseInt(month, 10);
                    const abbr = language === 'pt' ? monthAbbrPT : monthAbbrEN;
                    if (!isNaN(m) && m >= 1 && m <= 12) {
                      return `${day} ${abbr[m]} ${year}`;
                    } else {
                      return `${day}/${month}/${year}`;
                    }
                  })() : (language === 'pt' ? 'Não informado' : 'Not provided')}
                </Typography>
              </Box>
              
              {/* Third Row */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Altura' : 'Height'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.height ? `${existingPatient.height} cm` : 'Not provided'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Peso' : 'Weight'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.weight ? `${existingPatient.weight} kg` : 'Not provided'}
                </Typography>
              </Box>
              
              {/* Fourth Row */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Fumante' : 'Smoker'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.isSmoker !== undefined
                    ? (existingPatient.isSmoker
                        ? (language === 'pt' ? 'Sim' : 'Yes')
                        : (language === 'pt' ? 'Não' : 'No'))
                    : (language === 'pt' ? 'Não especificado' : 'Not specified')}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'pt' ? 'Exercita-se Diariamente' : 'Exercises Daily'}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.exercisesDaily !== undefined
                    ? (existingPatient.exercisesDaily
                        ? (language === 'pt' ? 'Sim' : 'Yes')
                        : (language === 'pt' ? 'Não' : 'No'))
                    : (language === 'pt' ? 'Não especificado' : 'Not specified')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ mt: 1, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: '#BE550F',
              color: '#BE550F',
              '&:hover': {
                borderColor: '#9A4409',
                color: '#9A4409',
                bgcolor: 'rgba(190, 85, 15, 0.04)'
              }
            }}
            onClick={() => {
              setIsEditing(true); // Set editing mode
              setExistingPatient(null); // Show the form
              setSubmitMessage(null); // Clear success message
              // Pre-populate the form with existing data
              reset({
                firstName: existingPatient.firstName,
                lastName: existingPatient.lastName,
                avatar: existingPatient.avatar || undefined,
                dateOfBirth: existingPatient.dateOfBirth || undefined,
                height: existingPatient.height || undefined,
                weight: existingPatient.weight || undefined
              });
              setGender(existingPatient.gender || "female");
              setIsSmoker(existingPatient.isSmoker || false);
              setExercisesDaily(existingPatient.exercisesDaily || false);
              setEditDialogOpen(true); // Open modal
            }}
          >
            {language === 'pt' ? 'Editar Informações' : 'Edit Information'}
          </Button>
          
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: '#BE550F',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#9A4409'
              }
            }}
            onClick={() => {
              // Navigate to blood pressure reading page
              navigate('/patient/blood-pressure');
            }}
          >
            {language === 'pt' ? 'Próximo →' : 'Next →'}
          </Button>
        </Box>
      </Paper>
    );
  }

  // Show edit form in a modal dialog if editing, otherwise as a page
  if (isEditing && editDialogOpen) {
    return (
      <Dialog open={editDialogOpen} onClose={() => { setEditDialogOpen(false); setIsEditing(false); }} maxWidth="md" fullWidth>
        <DialogTitle>{language === 'pt' ? 'Editar Informações do Paciente' : 'Edit Patient Information'}</DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: '#d7e9f7', width: '100%', pb: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Simple Form Layout - No Sections */}
              <Box sx={{
                width: "90vw",
                maxWidth: "800px",
                m: "0 auto",
                p: 3
              }}>
                <Typography variant="h5" textAlign="center" mb={3} sx={{ color: '#64748b' }}>
                  {language === 'pt' ? 'Edite suas informações de paciente' : 'Edit Your Patient Information'}
                </Typography>
                {/* Name Fields */}
                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 2,
                  alignItems: { xs: 'stretch', md: 'center' },
                }}>
                  <Box sx={{ flex: { xs: 1, md: 10.5 } }}>
              <TextField
                label={language === 'pt' ? 'Nome' : 'First Name'}
                {...register("firstName")}
                error={!!errors.firstName}
                margin="normal"
                fullWidth
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.firstName && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </Box>
            <Box sx={{ flex: { xs: 1, md: 10.5 } }}>
              <TextField
                label={language === 'pt' ? 'Sobrenome' : 'Last Name'}
                {...register("lastName")}
                error={!!errors.lastName}
                margin="normal"
                fullWidth
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.lastName && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.lastName.message}
                </FormHelperText>
              )}
            </Box>
            <Box sx={{
              flex: 1,
              minWidth: 180,
              mt: { xs: 0, md: '12px' },
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}>
              <FormControl>
                <InputLabel sx={{ color: "#BE550F" }}>
                  {language === 'pt' ? 'Avatar' : 'Avatar'}
                </InputLabel>
                <Select
                  {...register("avatar")}
                  value={watch("avatar") || ""}
                  label={language === 'pt' ? 'Avatar' : 'Avatar'}
                  sx={{
                    minWidth: 0,
                    top: '-2px',
                    width: 'fit-content',
                    height: 56,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      minWidth: 90,
                      width: 'fit-content',
                      px: 1,
                      py: 0.5,
                      height: 32,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>{language === 'pt' ? 'Escolha seu avatar' : 'Choose your avatar'}</em>
                  </MenuItem>
                  <MenuItem value="book">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={bookIcon} alt="Book" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="cat">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={catIcon} alt={language === 'pt' ? 'Gato' : 'Cat'} style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="dog">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={dogIcon} alt="Dog" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="flower">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={flowerIcon} alt="Flower" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="guitar">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={guitarIcon} alt="Guitar" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="headphones">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={headphonesIcon} alt="Headphones" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="moon">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={moonIcon} alt="Moon" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="sun">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={sunIcon} alt="Sun" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="umbrella">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={umbrellaIcon} alt="Umbrella" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>


          {/* Gender and Age Row */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3
          }}>
            {/* Gender Selection */}
            <Box sx={{ flex: 1 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, color: '#BE550F', textAlign: 'left', display: 'block' }}>
                  {language === 'pt' ? 'Gênero' : 'Gender'}
                </FormLabel>
                
                <ToggleButtonGroup
                  color="primary"
                  value={gender}
                  exclusive
                  onChange={(_, newGender) => {
                    if (newGender !== null) {
                      setGender(newGender);
                    }
                  }}
                  aria-label="gender selection"
                  sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                >
                  <ToggleButton value="female" aria-label="female">
                    {language === 'pt' ? 'Feminino' : 'Female'}
                  </ToggleButton>
                  <ToggleButton value="male" aria-label="male">
                    {language === 'pt' ? 'Masculino' : 'Male'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </Box>
            
            {/* Date of Birth Field */}
            <Box sx={{ flex: 1 }}>
              <TextField
                label={language === 'pt' ? 'Data de Nascimento' : 'Date of Birth'}
                placeholder={language === 'pt' ? 'DD/MM/AAAA' : 'DD/MM/YYYY'}
                type="text"
                inputProps={{ inputMode: 'numeric', pattern: '[0-3][0-9]/[0-1][0-9]/[1-2][0-9]{3}', maxLength: 10 }}
                value={watch("dateOfBirth") || ""}
                inputRef={dobInputRef}
                onChange={e => {
                  const input = e.target;
                  const caret = input.selectionStart || 0;
                  let raw = input.value.replace(/[^0-9]/g, "");
                  if (raw.length > 8) raw = raw.slice(0, 8);
                  let formatted = raw;
                  if (raw.length > 4) {
                    formatted = raw.slice(0,2) + "/" + raw.slice(2,4) + "/" + raw.slice(4);
                  } else if (raw.length > 2) {
                    formatted = raw.slice(0,2) + "/" + raw.slice(2);
                  }
                  // Calculate new caret position
                  let nextCaret = caret;
                  const inputType = (e.nativeEvent as InputEvent).inputType || '';
                  if (input.value[caret-1] === '/' && inputType === 'deleteContentBackward') {
                    nextCaret = caret - 1;
                  } else if (raw.length > 2 && caret === 3 && inputType !== 'deleteContentBackward') {
                    nextCaret = caret + 1;
                  } else if (raw.length > 4 && caret === 6 && inputType !== 'deleteContentBackward') {
                    nextCaret = caret + 1;
                  }
                  setValue("dateOfBirth", formatted, { shouldValidate: true });
                  setTimeout(() => {
                    if (dobInputRef.current && document.activeElement === dobInputRef.current) {
                      dobInputRef.current.setSelectionRange(nextCaret, nextCaret);
                    }
                  }, 0);
                }}
                error={!!errors.dateOfBirth}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.dateOfBirth && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.dateOfBirth.message}
                </FormHelperText>
              )}
            </Box>
          </Box>

          {/* Height and Weight Row */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label={language === 'pt' ? 'Altura (cm)' : 'Height (cm)'}
                type="number"
                {...register("height", { valueAsNumber: true })}
                error={!!errors.height}
                margin="normal"
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
                helperText={language === 'pt' ? 'centímetros' : 'centimeters'}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.height && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.height.message}
                </FormHelperText>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                label={language === 'pt' ? 'Peso (kg)' : 'Weight (kg)'}
                type="number"
                {...register("weight", { valueAsNumber: true })}
                error={!!errors.weight}
                margin="normal"
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
                helperText={language === 'pt' ? 'quilogramas' : 'kilograms'}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.weight && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.weight.message}
                </FormHelperText>
              )}
            </Box>
          </Box>

          {/* Lifestyle Switches */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Switch
                    checked={isSmoker}
                    onChange={(e) => setIsSmoker(e.target.checked)}
                    color="primary"
                  />
                }
                label={language === 'pt' ? 'Eu sou fumante' : 'I am a smoker'}
              />
            </FormControl>

            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Switch
                    checked={exercisesDaily}
                    onChange={(e) => setExercisesDaily(e.target.checked)}
                    color="primary"
                  />
                }
                label={language === 'pt' ? 'Eu me exercito 30+ minutos diariamente' : 'I exercise 30+ minutes daily'}
              />
            </FormControl>
          </Box>
        </Box>
        
        {/* Submit and Cancel Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          {isEditing && (
            <Button 
              variant="outlined" 
              onClick={async () => {
                setSubmitMessage(null);
                // Restore patient data first, then close modal
                if (userInfo?.userId) {
                  try {
                    const response = await client.models.Patient.list({
                      filter: {
                        userId: {
                          eq: userInfo.userId
                        }
                      }
                    });
                    if (response.data && response.data.length > 0) {
                      setExistingPatient(response.data[0]);
                      setGender(response.data[0].gender || "female");
                      setIsSmoker(response.data[0].isSmoker || false);
                      setExercisesDaily(response.data[0].exercisesDaily || false);
                    }
                  } catch (error) {
                    console.error('Error restoring patient data:', error);
                  }
                }
                reset(); // Clear form
                setIsEditing(false);
                setEditDialogOpen(false);
              }}
              disabled={isSubmitting}
            >
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
          )}
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            sx={{ 
              minWidth: 140
            }}
            onClick={() => {

            }}
          >
            {isSubmitting 
              ? (isEditing 
                  ? (language === 'pt' ? 'Atualizando...' : 'Updating...') 
                  : (language === 'pt' ? 'Enviando...' : 'Submitting...')) 
              : (isEditing 
                  ? (language === 'pt' ? 'Salvar Alteração' : 'Make change') 
                  : (language === 'pt' ? 'Adicionar Paciente' : 'Add Patient'))
            }
          </Button>
        </Box>
        
        {/* Feedback Messages */}
        {submitMessage && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Alert severity={submitMessage.type} sx={{ maxWidth: 600 }}>
              {submitMessage.text}
            </Alert>
          </Box>
        )}
      </form>
    </Box>
        </DialogContent>
      </Dialog>
    );
  }
  // Show as page for new patient
  return (
    <Box sx={{ 
      bgcolor: '#d7e9f7', 
      minHeight: '100vh',
      width: '100%',
      pb: 4
    }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Simple Form Layout - No Sections */}
        <Box sx={{
          width: "90vw",
          maxWidth: "800px",
          m: "0 auto",
          p: 3
        }}>
          <Typography variant="h5" textAlign="center" mb={3} sx={{ color: '#64748b' }}>
            {language === 'pt' ? 'Crie seu perfil de paciente' : 'Create Your Patient Profile'}
          </Typography>
          {/* Name, Avatar Fields */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 2,
            alignItems: { xs: 'stretch', md: 'center' },
          }}>
            <Box sx={{ flex: { xs: 1, md: 10.5 } }}>
              <TextField
                label={language === 'pt' ? 'Nome' : 'First Name'}
                {...register("firstName")}
                error={!!errors.firstName}
                margin="normal"
                fullWidth
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.firstName && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </Box>
            <Box sx={{ flex: { xs: 1, md: 10.5 } }}>
              <TextField
                label={language === 'pt' ? 'Sobrenome' : 'Last Name'}
                {...register("lastName")}
                error={!!errors.lastName}
                margin="normal"
                fullWidth
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.lastName && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.lastName.message}
                </FormHelperText>
              )}
            </Box>
            <Box sx={{
              flex: 1,
              minWidth: 180,
              mt: { xs: 0, md: '12px' },
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}>
              <FormControl>
                <InputLabel sx={{ color: "#BE550F" }}>
                  {language === 'pt' ? 'Avatar' : 'Avatar'}
                </InputLabel>
                <Select
                  {...register("avatar")}
                  value={watch("avatar") || ""}
                  label={language === 'pt' ? 'Avatar' : 'Avatar'}
                  sx={{
                    minWidth: 0,
                    top: '-2px',
                    width: 'fit-content',
                    height: 56,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      minWidth: 90,
                      width: 'fit-content',
                      px: 1,
                      py: 0.5,
                      height: 32,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>{language === 'pt' ? 'Escolha seu avatar' : 'Choose your avatar'}</em>
                  </MenuItem>
                  <MenuItem value="book">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={bookIcon} alt="Book" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="cat">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={catIcon} alt={language === 'pt' ? 'Gato' : 'Cat'} style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="dog">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={dogIcon} alt="Dog" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="flower">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={flowerIcon} alt="Flower" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="guitar">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={guitarIcon} alt="Guitar" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="headphones">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={headphonesIcon} alt="Headphones" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="moon">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={moonIcon} alt="Moon" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="sun">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={sunIcon} alt="Sun" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="umbrella">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={umbrellaIcon} alt="Umbrella" style={{ width: 32, height: 32, objectFit: 'contain', aspectRatio: '1/1', display: 'block' }} />
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Gender and Age Row */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3
          }}>
            {/* Gender Selection */}
            <Box sx={{ flex: 1 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, color: '#BE550F', textAlign: 'left', display: 'block' }}>
                  {language === 'pt' ? 'Gênero' : 'Gender'}
                </FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={gender}
                  exclusive
                  onChange={(_, newGender) => {
                    if (newGender !== null) {
                      setGender(newGender);
                    }
                  }}
                  aria-label="gender selection"
                  sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                >
                  <ToggleButton value="female" aria-label="female">
                    {language === 'pt' ? 'Feminino' : 'Female'}
                  </ToggleButton>
                  <ToggleButton value="male" aria-label="male">
                    {language === 'pt' ? 'Masculino' : 'Male'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </Box>
            {/* Date of Birth Field */}
            <Box sx={{ flex: 1 }}>
              <TextField
                label={language === 'pt' ? 'Data de Nascimento' : 'Date of Birth'}
                placeholder={language === 'pt' ? 'DD/MM/AAAA' : 'DD/MM/YYYY'}
                type="text"
                inputProps={{ inputMode: 'numeric', pattern: '[0-3][0-9]/[0-1][0-9]/[1-2][0-9]{3}', maxLength: 10 }}
                value={watch("dateOfBirth") || ""}
                inputRef={dobInputRef}
                onChange={e => {
                  const input = e.target;
                  const caret = input.selectionStart || 0;
                  let raw = input.value.replace(/[^0-9]/g, "");
                  if (raw.length > 8) raw = raw.slice(0, 8);
                  let formatted = raw;
                  if (raw.length > 4) {
                    formatted = raw.slice(0,2) + "/" + raw.slice(2,4) + "/" + raw.slice(4);
                  } else if (raw.length > 2) {
                    formatted = raw.slice(0,2) + "/" + raw.slice(2);
                  }
                  // Calculate new caret position
                  let nextCaret = caret;
                  const inputType = (e.nativeEvent as InputEvent).inputType || '';
                  if (input.value[caret-1] === '/' && inputType === 'deleteContentBackward') {
                    nextCaret = caret - 1;
                  } else if (raw.length > 2 && caret === 3 && inputType !== 'deleteContentBackward') {
                    nextCaret = caret + 1;
                  } else if (raw.length > 4 && caret === 6 && inputType !== 'deleteContentBackward') {
                    nextCaret = caret + 1;
                  }
                  setValue("dateOfBirth", formatted, { shouldValidate: true });
                  setTimeout(() => {
                    if (dobInputRef.current && document.activeElement === dobInputRef.current) {
                      dobInputRef.current.setSelectionRange(nextCaret, nextCaret);
                    }
                  }, 0);
                }}
                error={!!errors.dateOfBirth}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.dateOfBirth && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.dateOfBirth.message}
                </FormHelperText>
              )}
            </Box>
          </Box>

          {/* Height and Weight Row */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label={language === 'pt' ? 'Altura (cm)' : 'Height (cm)'}
                type="number"
                {...register("height", { valueAsNumber: true })}
                error={!!errors.height}
                margin="normal"
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
                helperText={language === 'pt' ? 'centímetros' : 'centimeters'}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.height && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.height.message}
                </FormHelperText>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                label={language === 'pt' ? 'Peso (kg)' : 'Weight (kg)'}
                type="number"
                {...register("weight", { valueAsNumber: true })}
                error={!!errors.weight}
                margin="normal"
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
                helperText={language === 'pt' ? 'quilogramas' : 'kilograms'}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.weight && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.weight.message}
                </FormHelperText>
              )}
            </Box>
          </Box>

          {/* Lifestyle Switches */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Switch
                    checked={isSmoker}
                    onChange={(e) => setIsSmoker(e.target.checked)}
                    color="primary"
                  />
                }
                label={language === 'pt' ? 'Eu sou fumante' : 'I am a smoker'}
              />
            </FormControl>

            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Switch
                    checked={exercisesDaily}
                    onChange={(e) => setExercisesDaily(e.target.checked)}
                    color="primary"
                  />
                }
                label={language === 'pt' ? 'Eu me exercito 30+ minutos diariamente' : 'I exercise 30+ minutes daily'}
              />
            </FormControl>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
              sx={{ 
                minWidth: 140
              }}
            >
              {isSubmitting 
                ? (language === 'pt' ? 'Enviando...' : 'Submitting...')
                : (language === 'pt' ? 'Adicionar Paciente' : 'Add Patient')
              }
            </Button>
          </Box>

          {/* Feedback Messages */}
          {submitMessage && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Alert severity={submitMessage.type} sx={{ maxWidth: 600 }}>
                {submitMessage.text}
              </Alert>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default Patient;
