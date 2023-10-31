import { Box, HStack, Heading, VStack, Text } from "@chakra-ui/react";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import { keyframes } from "@emotion/react";

export function Home() {
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
      <Heading fontSize="4xl" color="gray.700" textAlign="center">
        Welcome to HangTogether!
      </Heading>
      <HStack marginTop="12">
        <Signup />
        <Login />
      </HStack>
    </Box>
  );
}
