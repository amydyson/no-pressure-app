import { useForm } from "react-hook-form";
import { TextField, FormHelperText, Box } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
const Patient = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Patient;
