import { Link } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";

export function Home() {
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      <span
        style={{
          fontSize: "4rem",
        }}
      >
        Welcome to HangTogether!
      </span>

      <Signup />
      <Login />
    </div>
  );
}
