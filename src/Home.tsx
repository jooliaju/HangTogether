import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import { useState } from "react";

export function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      letterSpacing="3"
      // m="0 auto"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgColor="gray.50"
      p="8"
      position="relative" // Set to relative so the scrolling text can be positioned absolutely around it
    >
      <Heading fontSize="4xl" color="gray.700" textAlign="center" mb={8}>
        Welcome to HangTogether!
      </Heading>

      <VStack spacing={4}>
        {showLogin ? (
          <>
            <Login />
            <Text>
              Need an account?{" "}
              <Button variant="link" onClick={() => setShowLogin(false)}>
                Sign up here
              </Button>
            </Text>
          </>
        ) : (
          <>
            <Signup />
            <Text>
              Have an account?{" "}
              <Button variant="link" onClick={() => setShowLogin(true)}>
                Sign in here
              </Button>
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
