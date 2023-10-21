import { Route, Routes } from "react-router-dom";
import HangmanMain from "./HangmanMain";
import { Home } from "./Home";
import { AuthContextProvider } from "./auth/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
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
    </AuthContextProvider>
  );
}

export default App;
