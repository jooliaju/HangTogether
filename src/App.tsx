import { Route, Routes } from "react-router-dom";
import HangmanMain from "./HangmanMain";
import { Home } from "./Home";
import { AuthContextProvider } from "./auth/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ChakraProvider } from "@chakra-ui/react";

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
        </Routes>
      </ChakraProvider>
    </AuthContextProvider>
  );
}

export default App;
