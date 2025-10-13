import { useForm } from "react-hook-form";
import { TextField, FormHelperText, Box, Button, Alert } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useState } from "react";

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

const Patient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      // Submit to the database
      const response = await client.models.Patient.create({
        firstName: data.firstName,
        lastName: data.lastName,
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

  return (
    <>
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
