//@ts-nocheck

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./AuthContext";
import { Button } from "@chakra-ui/react";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { createUser } = UserAuth();

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("User Signed Up In:", { email, password });

    try {
      await createUser(email, password);
      console.log("signed up");
      navigate("/hangman");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
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
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}

export default Signup;
