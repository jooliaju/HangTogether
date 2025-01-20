//@ts-nocheck

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./AuthContext";
import { Button, Input, Stack, Heading, Box } from "@chakra-ui/react";

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
      navigate("/dashboard");
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
        Sign Up
      </Heading> */}
      <form onSubmit={handleSignUp}>
        <Stack spacing={3}>
          {/* <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /> */}
          <Input
            type="email"
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
          Sign Up 🥹
        </Button>
      </form>
    </Box>
  );
}

export default Signup;
