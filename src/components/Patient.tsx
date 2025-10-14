import { useForm } from "react-hook-form";
import { TextField, FormHelperText, Box, Button, Alert, Typography, Paper } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useState, useEffect } from "react";

const schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be at least 2 characters" })
    .max(100, { message: "Must not exceed 100 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Must be at least 2 characters" })
    .max(100, { message: "Must not exceed 100 characters" }),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [existingPatient, setExistingPatient] = useState<Schema["Patient"]["type"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Check for existing patient record when component loads
  useEffect(() => {
    const checkExistingPatient = async () => {
      if (!userInfo?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Query for patient records with this userId
        const response = await client.models.Patient.list({
          filter: {
            userId: {
              eq: userInfo.userId
            }
          }
        });

        if (response.data && response.data.length > 0) {
          // Patient record exists
          setExistingPatient(response.data[0]); // Get the first record
          console.log("Existing patient found:", response.data[0]);
        } else {
          // No patient record found
          setExistingPatient(null);
          console.log("No existing patient record found");
        }
      } catch (error) {
        console.error("Error checking for existing patient:", error);
        setExistingPatient(null);
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
      
      // Ensure we have a userId before creating the record
      if (!userInfo?.userId) {
        throw new Error('User ID not available. Please refresh and try again.');
      }

      let response;
      
      if (isEditing) {
        // Update existing patient record
        // First, find the existing patient ID by querying with userId
        const existingRecords = await client.models.Patient.list({
          filter: {
            userId: {
              eq: userInfo.userId
            }
          }
        });
        
        if (existingRecords.data && existingRecords.data.length > 0) {
          const existingId = existingRecords.data[0].id;
          response = await client.models.Patient.update({
            id: existingId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: userInfo.email || undefined,
          });
        } else {
          throw new Error('Could not find existing patient record to update');
        }
      } else {
        // Create new patient record
        response = await client.models.Patient.create({
          userId: userInfo.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: userInfo.email || undefined,
        });
      }
      
      if (response.data) {
        // Set the patient data and show success message
        setExistingPatient(response.data);
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
      console.error('Error creating patient:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to add patient. Please try again.'
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
          maxWidth: 600,
          mx: 'auto',
          textAlign: 'center',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3
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
        
        <Typography variant="h4" gutterBottom color="primary">
          Patient Information
        </Typography>
        
        {/* Patient Details */}
        <Box sx={{ mt: 3, textAlign: 'left', bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'auto 1fr' }}>
            <Typography variant="body1" fontWeight="bold">
              First Name:
            </Typography>
            <Typography variant="body1">
              {existingPatient.firstName}
            </Typography>
            
            <Typography variant="body1" fontWeight="bold">
              Last Name:
            </Typography>
            <Typography variant="body1">
              {existingPatient.lastName}
            </Typography>
            
            <Typography variant="body1" fontWeight="bold">
              Email:
            </Typography>
            <Typography variant="body1">
              {existingPatient.email || userInfo?.email || 'Not provided'}
            </Typography>
            
            <Typography variant="body1" fontWeight="bold">
              Created:
            </Typography>
            <Typography variant="body1">
              {existingPatient.createdAt ? new Date(existingPatient.createdAt).toLocaleDateString() : 'Unknown'}
            </Typography>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            onClick={() => {
              setIsEditing(true); // Set editing mode
              setExistingPatient(null); // Show the form
              setSubmitMessage(null); // Clear success message
              
              // Pre-populate the form with existing data
              reset({
                firstName: existingPatient.firstName,
                lastName: existingPatient.lastName
              });
            }}
          >
            Edit Information
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            onClick={() => {
              // TODO: Navigate to next page
              console.log("Navigate to next page");
              alert("Next page functionality - coming soon!");
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
      <Typography variant="h5" textAlign="center" mb={3}>
        {isEditing ? 'Edit Your Patient Information' : 'Create Your Patient Profile'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            gap: 2,
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            width: "100%",
            maxWidth: 600,
            m: "0 auto",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <TextField
              label="First Name"
              {...register("firstName")}
              error={!!errors.firstName}
              margin="normal"
              fullWidth
            />
            {errors.firstName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.firstName.message}
              </FormHelperText>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <TextField
              label="Last Name"
              {...register("lastName")}
              error={!!errors.lastName}
              margin="normal"
              fullWidth
            />
            {errors.lastName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.lastName.message}
              </FormHelperText>
            )}
          </Box>
        </Box>
        
        {/* Submit and Cancel Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
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
            disabled={isSubmitting}
            sx={{ minWidth: 140 }}
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
