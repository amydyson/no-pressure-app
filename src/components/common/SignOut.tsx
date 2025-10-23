import { useAuthenticator } from "@aws-amplify/ui-react";
import Button from "@mui/material/Button";

const SignOut = () => {
  const { signOut } = useAuthenticator();

  return (
    <Button 
      onClick={signOut}
      variant="outlined"
      size="small"
      sx={{ 
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
        '&:hover': {
          borderColor: '#FFFFFF',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      Sign Out
    </Button>
  );
};

export default SignOut;