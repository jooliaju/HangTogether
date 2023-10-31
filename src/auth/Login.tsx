//@ts-nocheck

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
import { UserAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Input, Stack, Heading, Box } from "@chakra-ui/react";

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
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      w="300px"
      mx="auto"
    >
      {/* <Heading as="h2" size="md" mb={4}>
        Login
      </Heading> */}
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>
        <Button mt={4} colorScheme="blue" type="submit">
          Login 🥳
        </Button>
      </form>
    </Box>
  );
}

export default Login;
