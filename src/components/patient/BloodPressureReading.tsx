import { Box, Typography } from "@mui/material";

const BloodPressureReading = () => {
  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#2F4F4F' }}>
        Blood Pressure Reading
      </Typography>
      <Typography variant="body1">
        This is where the blood pressure reading form or data will go.
      </Typography>
    </Box>
  );
};

export default BloodPressureReading;
