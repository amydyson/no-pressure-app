import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { Routes, Route } from "react-router-dom";
import Medico from "../medico/Medico";
import PatientRouter from "../PatientRouter";
import Box from "@mui/material/Box";

async function getUserInfo(): Promise<{
  groups: string[];
  userId: string | null;
  email: string | null;
}> {
  try {
    const session = await fetchAuthSession();
    const payload = session.tokens?.idToken?.payload;
    
    const groupsRaw = payload?.["cognito:groups"] || [];
    const groups = Array.isArray(groupsRaw)
      ? groupsRaw.filter((g) => typeof g === "string")
      : [];
    
    return {
      groups,
      userId: typeof payload?.sub === 'string' ? payload.sub : null,
      email: typeof payload?.email === 'string' ? payload.email : null,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { groups: [], userId: null, email: null };
  }
}

function Home() {
  const [group, setGroup] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null>(null);

  useEffect(() => {
    getUserInfo().then((info) => {
      console.log("=== HOME COMPONENT USER INFO ===");
      console.log("User logged in:", {
        userId: info.userId,
        email: info.email,
        groups: info.groups
      });
      console.log("Full payload sub:", info.userId);
      console.log("Timestamp:", new Date().toISOString());
      console.log("===============================");
      
      setUserInfo(info);
      
      if (info.groups.includes("Medico")) {
        setGroup("Medico");
        // Auto-navigate to medico routes
        if (window.location.pathname === '/') {
          window.history.replaceState(null, '', '/medico');
        }
      } else {
        setGroup("Patient");
        // Auto-navigate to patient routes
        if (window.location.pathname === '/') {
          window.history.replaceState(null, '', '/patient');
        }
      }
    });
  }, []);

  if (!group) return null; // or a loading spinner

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#d7e9f7"
      width="100vw"
    >
      <Routes>
        <Route path="/medico/*" element={<Medico userInfo={userInfo} />} />
        <Route path="/patient/*" element={<PatientRouter userInfo={userInfo} />} />
        <Route path="/" element={
          group === "Medico" ? (
            <Medico userInfo={userInfo} />
          ) : (
            <PatientRouter userInfo={userInfo} />
          )
        } />
      </Routes>
    </Box>
  );
}

export default Home;