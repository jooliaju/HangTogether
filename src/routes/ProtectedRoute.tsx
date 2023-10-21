import { useNavigate } from "react-router-dom";
import { UserAuth } from "../auth/AuthContext";

function ProtectedRoute({ children }: any) {
  const { user } = UserAuth()!;
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  } else {
    console.log("user found");
  }

  return children;
}

export default ProtectedRoute;
