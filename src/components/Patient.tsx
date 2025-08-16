import { useForm } from "react-hook-form";
import { TextField, FormHelperText } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(100, { message: "First name must not be longer than 100 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(100, { message: "Last name must not be longer than 100 characters" }),
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
        <button onClick={handleSubmit(onSubmit)} type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default Patient;
