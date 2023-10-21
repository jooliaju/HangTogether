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

      <span
        style={{
          fontSize: "2rem",
        }}
      >
        Click here to play hangman
      </span>

      <Link to="/hangman">
        <button
          style={{
            backgroundColor: "#6486ff",
            padding: "20px",
            fontFamily: "monospace",
          }}
        >
          Enter Game
        </button>
      </Link>

      <Signup />
      <Login />
    </div>
  );
}
