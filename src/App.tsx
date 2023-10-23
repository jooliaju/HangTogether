import { Route, Routes } from "react-router-dom";
import HangmanMain from "./game/HangmanMain";
import { Home } from "./Home";
import { AuthContextProvider } from "./auth/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ChakraProvider } from "@chakra-ui/react";
import Invitation from "./Invitation";

function App() {
  return (
    <AuthContextProvider>
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/hangman"
            element={
              <ProtectedRoute>
                <HangmanMain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invitation"
            element={
              <ProtectedRoute>
                <Invitation />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </ChakraProvider>
    </AuthContextProvider>
  );
}

export default App;
