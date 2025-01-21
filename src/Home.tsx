import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  // Check if we're coming from an invitation link
  const isInvitationPath = window.location.pathname === "/invitation";
  const inviteToken = new URLSearchParams(window.location.search).get("token");

  // After successful login/signup, redirect with invitation data
  const handleAuthSuccess = () => {
    if (isInvitationPath && inviteToken) {
      navigate(`/dashboard?invite=${inviteToken}`);
    } else {
      navigate("/dashboard");
    }
  };

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
            <Login onSuccess={handleAuthSuccess} />
            <Text>
              Need an account?{" "}
              <Button variant="link" onClick={() => setShowLogin(false)}>
                Sign up here
              </Button>
            </Text>
          </>
        ) : (
          <>
            <Signup onSuccess={handleAuthSuccess} />
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
