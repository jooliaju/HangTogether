import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { JWTPayload, decodeJwt } from "jose";
import { UserAuth } from "./auth/AuthContext";
import {
  Button,
  Text,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";

function Invitation() {
  const { user } = UserAuth()!;
  //   const { token } = useParams();
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get("token");

  const [decodedToken, setDecodedToken] = useState<JWTPayload | null>();

  const decodeToken = (token: string) => {
    try {
      const decoded = decodeJwt(token);
      // Store the decoded token in state
      setDecodedToken(decoded);
      return decoded;
    } catch (error) {
      // Handle token decoding errors (e.g., token is invalid or expired)
      console.error("Token decoding error:", error);
      return null;
    }
  };

  const handleAccept = async () => {
    try {
      const response = await axios.post("http://localhost:4000/newGame", {
        partner1: decodedToken?.senderId,
        partner2: user?.uid,
      });

      console.log("Game created successfully", response.data);
    } catch (error) {
      console.error("Error creating game", error);
    }
  };

  useEffect(() => {
    // Check if a token is present
    try {
      if (token) {
        // Process the token
        console.log("Received token:", token);
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          console.log(decodedToken);
        }
      } else {
        console.log("No token found in the URL");
      }
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Text fontFamily="cursive" fontSize="3em">
        Invitation Page
      </Text>
      <h2>hi {user?.email}</h2>
      <h2>{user?.uid}</h2>
      {decodedToken && user && user.email === decodedToken.recipientEmail && (
        <Card variant="filled" shadow="lg">
          <CardHeader>
            <Heading size="md">Someone invited you to play hangman 😁</Heading>
          </CardHeader>
          <CardBody>
            <Text>You can accept or decline for the partner request</Text>
          </CardBody>
          <CardFooter padding="20px">
            <Button colorScheme="green" margin="10px" onClick={handleAccept}>
              Accept
            </Button>
            <Button colorScheme="gray" margin="10px" variant="outline">
              Decline
            </Button>
          </CardFooter>
        </Card>
      )}
      {/* Render your invitation content here */}
    </div>
  );
}

export default Invitation;
