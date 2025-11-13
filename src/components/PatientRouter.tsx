import { Routes, Route, Navigate } from "react-router-dom";
import Patient from "./patient/Patient";
import BloodPressureReading from "./patient/BloodPressureReading";
import InputReading from "./patient/InputReading";
import HowToGetAReading from "./patient/HowToGetAReading";
import BloodPressureHistory from "./patient/BloodPressureHistory";

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
      <Route index element={<Patient userInfo={userInfo} />} />
      <Route path="profile" element={<Patient userInfo={userInfo} />} />
      <Route path="medical-history" element={
        <div style={{padding: '2rem', textAlign: 'center'}}>
          <h2>Medical History - Coming Soon!</h2>
          <p>This page will show patient medical history.</p>
        </div>
      } />
      <Route path="blood-pressure" element={<BloodPressureReading userInfo={userInfo} />} />
      <Route path="input-reading" element={<InputReading userInfo={userInfo} />} />
      <Route path="how-to-get-a-reading" element={<HowToGetAReading />} />
      <Route path="blood-pressure-history" element={<BloodPressureHistory userInfo={userInfo} />} />
      <Route path="*" element={<Navigate to="/patient" replace />} />
    </Routes>
  );
};

export default PatientRouter;