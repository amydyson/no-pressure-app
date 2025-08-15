import { useAuthenticator } from "@aws-amplify/ui-react";

const SignOut = () => {
  const { signOut } = useAuthenticator();

  return (
    <div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;
