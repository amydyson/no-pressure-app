import { Routes, Route, Navigate } from "react-router-dom";
import Patient from "./patient/Patient";
import BloodPressureReading from "./patient/BloodPressureReading";
import InputReading from "./patient/InputReading";
import HowToGetAReading from "./patient/HowToGetAReading";
import BloodPressureHistory from "./patient/BloodPressureHistory";
import BloodPressureGame from "./patient/BloodPressureGame";
import MemoryCardGame from "./patient/MemoryCardGame";
import GamesLanding from "./patient/GamesLanding";
import WhenToCall112 from "./patient/WhenToCall112";

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
      <Route path="blood-pressure" element={<BloodPressureReading />} />
      <Route path="input-reading" element={<InputReading userInfo={userInfo} />} />
      <Route path="how-to-get-a-reading" element={<HowToGetAReading />} />
      <Route path="blood-pressure-history" element={<BloodPressureHistory userInfo={userInfo} />} />
      <Route path="games" element={<GamesLanding />} />
      <Route path="game" element={<BloodPressureGame />} />
      <Route path="memory-game" element={<MemoryCardGame />} />
      <Route path="when-to-call-112" element={<WhenToCall112 />} />
      <Route path="*" element={<Navigate to="/patient" replace />} />
    </Routes>
  );
};

export default PatientRouter;