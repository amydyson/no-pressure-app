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
    <>
      <div>
        <h2>Medico Dashboard</h2>
        <p>Welcome, {userInfo?.email}</p>
        <p>User ID: {userInfo?.userId}</p>
      </div>
    </>
  );
};

export default Medico;
