import { useAuthenticator } from "@aws-amplify/ui-react";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { LanguageContext } from "../../App";

const SignOut = () => {
  const { signOut } = useAuthenticator();
  const { language } = useContext(LanguageContext) as { language: string };

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
      {language === 'pt' ? 'Sair' : 'Sign Out'}
    </Button>
  );
};

export default SignOut;