import { BrowserRouter } from "react-router-dom";
import Home from "./components/common/Home";
import SignOut from "./components/common/SignOut";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <SignOut />
      <Home />
    </BrowserRouter>
  );
}

export default App;
