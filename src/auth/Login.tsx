//@ts-nocheck

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
import { UserAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("User Logged In:", { email, password });

    //write try catch
    try {
      await signIn(email, password);
      console.log("logged in");
      navigate("/hangman");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

export default Login;
