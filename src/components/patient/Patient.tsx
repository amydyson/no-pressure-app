import { useForm } from "react-hook-form";
import { TextField, FormHelperText, Box, Button, Alert, Typography, Paper, FormControl, FormLabel, ToggleButton, ToggleButtonGroup, Switch, FormControlLabel } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import manImage from "../../assets/images/illustrations/man.png";
import womanImage from "../../assets/images/illustrations/woman.png";

const schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be at least 2 characters" })
    .max(100, { message: "Must not exceed 100 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Must be at least 2 characters" })
    .max(100, { message: "Must not exceed 100 characters" }),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .int({ message: "Age must be a whole number" })
    .min(1, { message: "Age must be at least 1" })
    .max(150, { message: "Age must be less than 150" })
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
      console.log("Age value:", data.age, "Type:", typeof data.age);
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
            gender: gender || undefined,
            isSmoker: isSmoker !== undefined ? isSmoker : undefined,
            age: data.age || undefined,
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
            gender: gender || undefined,
            isSmoker: isSmoker !== undefined ? isSmoker : undefined,
            age: data.age || undefined,
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
          gender: gender || undefined,
          isSmoker: isSmoker !== undefined ? isSmoker : undefined,
          age: data.age || undefined,
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
          p: 4,
          mx: 'auto',
          textAlign: 'center',
          bgcolor: '#d7e9f7',
          borderRadius: 2,
          boxShadow: 3,
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
          Patient Information
        </Typography>
        
        {/* Main Content - Two Section Layout */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          mt: 3, 
          alignItems: { xs: 'center', md: 'flex-start' }
        }}>
          
          {/* Left - Gender Illustrations */}
          <Box sx={{ 
            flex: { xs: 'none', md: 1 }, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 4, 
            minHeight: '400px',
            justifyContent: 'center'
          }}>
            {/* Gender Illustrations */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0, mb: 3 }}>
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
             border: { xs: '1px solid #1975d1', md: 'none' },
            p: 4,
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
                  First Name
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.firstName}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Last Name
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.lastName}
                </Typography>
              </Box>
              
              {/* Second Row */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Gender
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.gender ? existingPatient.gender.charAt(0).toUpperCase() + existingPatient.gender.slice(1) : 'Not specified'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Age
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.age ? `${existingPatient.age} years` : 'Not provided'}
                </Typography>
              </Box>
              
              {/* Third Row */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Height
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.height ? `${existingPatient.height} cm` : 'Not provided'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Weight
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.weight ? `${existingPatient.weight} kg` : 'Not provided'}
                </Typography>
              </Box>
              
              {/* Fourth Row */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Smoker
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.isSmoker !== undefined ? (existingPatient.isSmoker ? 'Yes' : 'No') : 'Not specified'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Exercises Daily
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  {existingPatient.exercisesDaily !== undefined ? (existingPatient.exercisesDaily ? 'Yes' : 'No') : 'Not specified'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                age: existingPatient.age || undefined,
                height: existingPatient.height || undefined,
                weight: existingPatient.weight || undefined
              });
              // Set all state variables
              setGender(existingPatient.gender || "female");
              setIsSmoker(existingPatient.isSmoker || false);
              setExercisesDaily(existingPatient.exercisesDaily || false);
            }}
          >
            Edit Information
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
            Next →
          </Button>
        </Box>
      </Paper>
    );
  }

  // New patient form or edit form
  return (
    <>
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
            {isEditing ? 'Edit Your Patient Information' : 'Create Your Patient Profile'}
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
                label="First Name"
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
                label="Last Name"
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
                <FormLabel component="legend" sx={{ mb: 2, color: '#BE550F', textAlign: 'left', display: 'block' }}>Gender</FormLabel>
                
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
                    Female
                  </ToggleButton>
                  <ToggleButton value="male" aria-label="male">
                    Male
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </Box>
            
            {/* Age Field */}
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Age (years)"
                type="number"
                {...register("age", { 
                  valueAsNumber: true,
                  setValueAs: (value) => {
                    console.log("Age input value:", value, "Type:", typeof value);
                    return value === "" ? undefined : Number(value);
                  }
                })}
                error={!!errors.age}
                margin="normal"
                fullWidth
                inputProps={{ min: 1, max: 150 }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#BE550F',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BE550F',
                  }
                }}
              />
              {errors.age && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.age.message}
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
                label="Height (cm)"
                type="number"
                {...register("height", { valueAsNumber: true })}
                error={!!errors.height}
                margin="normal"
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
                helperText="centimeters"
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
                label="Weight (kg)"
                type="number"
                {...register("weight", { valueAsNumber: true })}
                error={!!errors.weight}
                margin="normal"
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
                helperText="kilograms"
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
                label="I am a smoker"
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
                label="I exercise 30+ minutes daily"
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
              Cancel
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
              ? (isEditing ? 'Updating...' : 'Submitting...') 
              : (isEditing ? 'Make change' : 'Add Patient')
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
    </>
  );
};

export default Patient;
