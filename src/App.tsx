import { Route, Routes } from "react-router-dom";
import HangmanMain from "./HangmanMain";
import { Home } from "./Home";
import { AuthContextProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hangman" element={<HangmanMain />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
