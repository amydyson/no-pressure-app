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

      // Submit to the database with userId as key
      const response = await client.models.Patient.create({
        userId: userInfo.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: userInfo.email || undefined,
      });
      
      if (response.data) {
        setSubmitMessage({
          type: 'success',
          text: `Patient ${data.firstName} ${data.lastName} has been successfully added!`
        });
        reset(); // Clear the form
      } else {
        throw new Error('Failed to create patient record');
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
        <Typography variant="h4" gutterBottom color="primary">
          Welcome Back!
        </Typography>
        <Typography variant="h6" gutterBottom>
          {existingPatient.firstName} {existingPatient.lastName}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your patient profile is already set up.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {existingPatient.email || userInfo?.email}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => {
              setExistingPatient(null); // Allow them to update their info
            }}
          >
            Update Information
          </Button>
        </Box>
      </Paper>
    );
  }

  // New patient form
  return (
    <>
      <Typography variant="h5" textAlign="center" mb={3}>
        Create Your Patient Profile
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
        
        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? 'Submitting...' : 'Add Patient'}
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
