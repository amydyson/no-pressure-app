interface MedicoProps {
  userInfo: {
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null;
}

const Medico = ({ userInfo }: MedicoProps) => {
  console.log("Medico component loaded for user:", {
    userId: userInfo?.userId,
    email: userInfo?.email
  });

  return (
    <div style={{padding: '2rem', textAlign: 'center'}}>
      <h2>Medico Dashboard</h2>
      <p>Welcome, {userInfo?.email}</p>
      <p>This is the Medico interface - Coming Soon!</p>
    </div>
  );
};

export default Medico;
