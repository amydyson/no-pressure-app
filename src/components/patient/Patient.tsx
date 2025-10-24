import { useForm } from "react-hook-form";
import { TextField, FormHelperText, Box, Button, Alert, Typography, Paper, FormControl, FormLabel, ToggleButton, ToggleButtonGroup, Switch, FormControlLabel, MenuItem, Select, InputLabel } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../App";
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
  const [gender, setGender] = useState<string>("female"); // Default to female
  const [isSmoker, setIsSmoker] = useState<boolean>(false); // Default to non-smoker
  const [exercisesDaily, setExercisesDaily] = useState<boolean>(false); // Default to no daily exercise
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Debug validation errors
  console.log("Current form validation errors:", errors);



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
          console.log("No userId available, treating as new patient");
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
            console.log("Existing patient found:", patientData);
          } else {
            // Patient data is null
            setExistingPatient(null);
            console.log("Patient data is null");
          }
        } else {
          // No patient record found
          setExistingPatient(null);
          console.log("No existing patient record found");
        }
      } catch (error) {
        console.error("Error checking for existing patient:", error);
        
        // If there are corrupted records, we'll treat this as a new patient
        console.log("Database may have corrupted records. Starting fresh for this user.");
        
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
    console.log("=== onSubmit FUNCTION CALLED ===");
    console.log("This means the form validation passed and submission started");
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      console.log("=== FORM SUBMISSION DEBUG ===");
      console.log("Is editing:", isEditing);
      console.log("Form data:", data);
      console.log("Date of birth value:", data.dateOfBirth, "Type:", typeof data.dateOfBirth);
      
      // Date of birth is always a string from the form (YYYY-MM-DD), no conversion needed
      const processedDateOfBirth = data.dateOfBirth;
      if (processedDateOfBirth) {
        // Already in correct format
        console.log("Processed date of birth:", processedDateOfBirth);
      }
      
      console.log("Current state values:", {
        gender,
        isSmoker,
        exercisesDaily
      });
      console.log("=== USER ID DEBUG INFO ===");
      console.log("Current userInfo:", userInfo);
      console.log("UserID:", userInfo?.userId);
      console.log("Email:", userInfo?.email);
      console.log("Groups:", userInfo?.groups);
      
      // Let's also fetch fresh session info to compare
      const { fetchAuthSession } = await import("aws-amplify/auth");
      const freshSession = await fetchAuthSession();
      const freshPayload = freshSession.tokens?.idToken?.payload;
      
      console.log("=== FRESH SESSION COMPARISON ===");
      console.log("Fresh sub:", freshPayload?.sub);
      console.log("Fresh email:", freshPayload?.email);
      console.log("Are they the same?", userInfo?.userId === freshPayload?.sub);
      console.log("================================");
      
      console.log("Submitting patient data for user:", {
        userId: userInfo?.userId,
        email: userInfo?.email,
        firstName: data.firstName,
        lastName: data.lastName
      });
      
      // Log user info for debugging
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
          
          console.log("=== UPDATE DEBUG INFO ===");
          console.log("Updating patient with ID:", existingId);
          console.log("Update data:", {
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
          
          console.log("Update response:", response);
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
        
        console.log("=== CREATE DEBUG INFO ===");
        console.log("Creating new patient with data:", createData);
        
        response = await client.models.Patient.create(createData);
      }
      
      if (response && response.data) {
        // Set the patient data and show success message
        setExistingPatient(response.data);
        
        // Update all state variables to match the updated data
        if (isEditing) {
          setGender(response.data.gender || "female");
          setIsSmoker(response.data.isSmoker || false);
          setExercisesDaily(response.data.exercisesDaily || false);
        }
        
        setSubmitMessage({
          type: 'success',
          text: isEditing 
            ? `Patient information updated successfully!`
            : `Patient ${data.firstName} ${data.lastName} has been successfully added!`
        });
        setIsEditing(false); // Reset editing state
        reset(); // Clear the form
      } else {
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
          px: 4,
          py: 2,
          mx: 'auto',
          textAlign: 'center',
          bgcolor: '#d7e9f7',
          borderRadius: 2,
          width: '100%'
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
          gap: 2, 
          mt: 4,
          alignItems: { xs: 'center', md: 'flex-start' }
        }}>
          
          {/* Left - Gender Illustrations */}
          <Box sx={{ 
            flex: { xs: 'none', md: 1 }, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            px: 4,
            py: 2,
            minHeight: '350px',
            justifyContent: 'center'
          }}>
            {/* Gender Illustrations */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0, mb: 1 }}>
              <Box sx={{ textAlign: 'center', marginRight: '-50px' }}>
                <img 
                  src={manImage}
                  alt="man illustration"
                  style={{ 
                    width: '250px', 
                    height: '250px', 
                    objectFit: 'contain',
                    border: 'none',
                    opacity: 1,
                    backgroundColor: 'transparent'
                  }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', marginLeft: '-50px' }}>
                <img 
                  src={womanImage}
                  alt="woman illustration"
                  style={{ 
                    width: '250px', 
                    height: '250px', 
                    objectFit: 'contain',
                    border: 'none',
                    opacity: 1,
                    backgroundColor: 'transparent'
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Right - Patient Details in Two Columns */}
          <Box sx={{ 
            flex: { xs: 'none', md: 2 }, 
             border: { xs: '1px solid #BE550F', md: 'none' },
            px: 4,
            py: 2,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'stretch' }
          }}>
            {/* Two Column Grid for Information */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr' }, 
              gap: 3,
              textAlign: 'left',
              maxWidth: { xs: '500px', md: 'none' },
              width: '100%'
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
                          style={{ width: 32, height: 32 }} 
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
                    // Handle date formatting safely to avoid timezone issues
                    if (existingPatient.dateOfBirth.includes('-')) {
                      // If it's in YYYY-MM-DD format, convert to MM/DD/YYYY
                      const [year, month, day] = existingPatient.dateOfBirth.split('-');
                      return `${month}/${day}/${year}`;
                    } else {
                      // If it's already in a different format, display as is
                      return existingPatient.dateOfBirth;
                    }
                  })() : 'Not provided'}
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
              // Set all state variables
              setGender(existingPatient.gender || "female");
              setIsSmoker(existingPatient.isSmoker || false);
              setExercisesDaily(existingPatient.exercisesDaily || false);
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
              // Navigate to medical history page
              navigate('/patient/medical-history');
            }}
          >
            {language === 'pt' ? 'Próximo →' : 'Next →'}
          </Button>
        </Box>
      </Paper>
    );
  }

  // New patient form or edit form
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
          
          {/* Form Title */}
          <Typography variant="h5" textAlign="center" mb={3} sx={{ color: '#64748b' }}>
            {isEditing
              ? (language === 'pt' ? 'Edite suas informações de paciente' : 'Edit Your Patient Information')
              : (language === 'pt' ? 'Crie seu perfil de paciente' : 'Create Your Patient Profile')}
          </Typography>
          
          {/* Name Fields */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 2
          }}>
            <Box sx={{ flex: 1 }}>
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
            <Box sx={{ flex: 1 }}>
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
          </Box>

          {/* Avatar Selection */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#BE550F", fontWeight: "bold" }}>
                {language === 'pt' ? 'Avatar' : 'Avatar'}
              </InputLabel>
              <Select
                {...register("avatar")}
                value={watch("avatar") || ""}
                label={language === 'pt' ? 'Avatar' : 'Avatar'}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                <MenuItem value="">
                  <em>{language === 'pt' ? 'Escolha seu avatar' : 'Choose your avatar'}</em>
                </MenuItem>
                <MenuItem value="book">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={bookIcon} alt="Book" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="cat">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={catIcon} alt={language === 'pt' ? 'Gato' : 'Cat'} style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="dog">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={dogIcon} alt="Dog" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="flower">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={flowerIcon} alt="Flower" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="guitar">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={guitarIcon} alt="Guitar" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="headphones">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={headphonesIcon} alt="Headphones" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="moon">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={moonIcon} alt="Moon" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="sun">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={sunIcon} alt="Sun" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
                <MenuItem value="umbrella">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={umbrellaIcon} alt="Umbrella" style={{ width: 24, height: 24 }} />
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
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
                type="date"
                {...register("dateOfBirth")}
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
              onClick={() => {
                // Cancel editing - go back to patient info view
                setIsEditing(false);
                setSubmitMessage(null);
                // Re-query to get the existing patient data
                const restorePatientData = async () => {
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
                        // Restore all state variables
                        setGender(response.data[0].gender || "female");
                        setIsSmoker(response.data[0].isSmoker || false);
                        setExercisesDaily(response.data[0].exercisesDaily || false);
                      }
                    } catch (error) {
                      console.error('Error restoring patient data:', error);
                    }
                  }
                };
                restorePatientData();
                reset(); // Clear form
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
              console.log("=== BUTTON CLICKED ===");
              console.log("Button clicked, form should submit");
              console.log("isSubmitting:", isSubmitting);
              console.log("isEditing:", isEditing);
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
  );
};

export default Patient;
