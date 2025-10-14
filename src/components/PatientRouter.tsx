import { Routes, Route, Navigate } from "react-router-dom";
import Patient from "./patient/Patient";
// Import other patient components as you create them
// import PatientMedicalHistory from "./PatientMedicalHistory";
// import PatientAppointments from "./PatientAppointments";
// import PatientResults from "./PatientResults";

interface PatientRouterProps {
  userInfo: {
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null;
}

const PatientRouter = ({ userInfo }: PatientRouterProps) => {
  return (
    <Routes>
      <Route path="/" element={<Patient userInfo={userInfo} />} />
      <Route path="/profile" element={<Patient userInfo={userInfo} />} />
      <Route path="/medical-history" element={
        <div style={{padding: '2rem', textAlign: 'center'}}>
          <h2>Medical History - Coming Soon!</h2>
          <p>This page will show patient medical history.</p>
        </div>
      } />
      {/* Uncomment as you create these components
      <Route path="/appointments" element={<PatientAppointments userInfo={userInfo} />} />
      <Route path="/results" element={<PatientResults userInfo={userInfo} />} />
      */}
      <Route path="*" element={<Navigate to="/patient" replace />} />
    </Routes>
  );
};

export default PatientRouter;