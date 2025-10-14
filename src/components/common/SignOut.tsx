import { useAuthenticator } from "@aws-amplify/ui-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const SignOut = () => {
  const { signOut } = useAuthenticator();

  return (
    <div>
      <Box position="absolute" top="0" right="0" margin="20px">
        <Button variant="contained" onClick={signOut}>
          Sign Out
        </Button>
      </Box>
    </div>
  );
};

export default SignOut;