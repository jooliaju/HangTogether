import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { JWTPayload } from "jose";
import { UserAuth } from "./auth/AuthContext";
import {
  Button,
  Text,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import decodeToken from "./Token";
import { useNavigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";

function Invitation() {
  const { user } = UserAuth()!;
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get("token");

  const [decodedToken, setDecodedToken] = useState<JWTPayload | null>();
  const [inviteClose, setInviteClose] = useState(false);
  const [partner1WordToGuess, setPartner1WordToGuess] = useState("");
  const [showWordInput, setShowWordInput] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Check if user needs to sign up
  const needsSignup = !user || user.email !== decodedToken?.recipientEmail;

  const handleAccept1 = async () => {
    setInviteClose(true);
    setShowWordInput(true);
  };

  const handleAccept2 = async () => {
    try {
      console.log(decodedToken?.wordForPartner2);
      const response = await axios.post("http://localhost:4000/newGame", {
        partner1: decodedToken?.senderId,
        partner1WordToGuess: partner1WordToGuess,
        partner2: user?.uid,
        partner2WordToGuess: decodedToken?.wordForPartner2,
      });
      console.log("Game created successfully", response.data);

      setShowWordInput(false);
      navigate("/hangman");
    } catch (error) {
      console.error("Error creating game", error);
    }
  };

  useEffect(() => {
    try {
      if (token) {
        console.log("Received token:", token);
        const decodedToken = decodeToken(token);
        setDecodedToken(decodedToken);
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
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Text fontFamily="cursive" fontSize="3em" mb={6}>
        Le Invitation
      </Text>

      {needsSignup ? (
        <VStack spacing={4}>
          <Card variant="filled" shadow="lg">
            <CardHeader>
              <Heading size="md">
                Welcome! sign in to accept the invitation
              </Heading>
            </CardHeader>
            <CardBody>
              <Text mb={4}>
                The game invite is for {String(decodedToken?.recipientEmail)}
              </Text>
              {showLoginForm ? (
                <>
                  <Login />
                  <p>
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      onClick={() => setShowLoginForm(false)}
                    >
                      Sign up here
                    </Button>
                  </p>
                </>
              ) : (
                <>
                  <Signup />

                  <p>
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      onClick={() => setShowLoginForm(true)}
                    >
                      Login here
                    </Button>
                  </p>
                </>
              )}
            </CardBody>
          </Card>
        </VStack>
      ) : (
        <>
          {!inviteClose && (
            <Card variant="filled" shadow="lg">
              <CardHeader>
                <Heading size="md">
                  Someone invited you to play hangman 😁
                </Heading>
              </CardHeader>
              <CardBody>
                <Text>You can accept or decline for the partner request</Text>
              </CardBody>
              <CardFooter padding="20px">
                <Button
                  colorScheme="green"
                  margin="10px"
                  onClick={handleAccept1}
                >
                  Yes, I want to play hangman with them
                </Button>
                <Button
                  colorScheme="gray"
                  margin="10px"
                  variant="outline"
                  onClick={() => {
                    setInviteClose(true);
                  }}
                >
                  Decline
                </Button>
              </CardFooter>
            </Card>
          )}

          {inviteClose && showWordInput && (
            <Card variant="filled" shadow="lg">
              <CardHeader>
                <Heading size="md">
                  Awesome, now give them a word to guess 😈
                </Heading>
              </CardHeader>
              <CardBody>
                <Input
                  variant="outline"
                  onChange={(e) => setPartner1WordToGuess(e.target.value)}
                />
              </CardBody>
              <CardFooter padding="20px">
                <Button
                  colorScheme="green"
                  margin="10px"
                  onClick={handleAccept2}
                >
                  Start game
                </Button>
                <Button
                  colorScheme="gray"
                  margin="10px"
                  variant="outline"
                  onClick={() => {
                    setShowWordInput(false);
                  }}
                >
                  nevermind 😭
                </Button>
              </CardFooter>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default Invitation;
