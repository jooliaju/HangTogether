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
  const [emailVerified, setEmailVerified] = useState(false);

  // Redirect to dashboard if user is logged in but no token is present
  useEffect(() => {
    if (user && !token) {
      navigate("/dashboard");
    }
  }, [user, token, navigate]);

  // Handle successful game creation
  const handleGameCreated = () => {
    navigate("/dashboard");
  };

  const handleAccept1 = async () => {
    setInviteClose(true);
    setShowWordInput(true);
  };

  const handleAccept2 = async () => {
    try {
      const response = await axios.post("http://localhost:4000/games/new", {
        partner1: decodedToken?.senderId,
        partner1WordToGuess: partner1WordToGuess,
        partner2: user?.uid,
        partner2WordToGuess: decodedToken?.wordForPartner2,
      });
      console.log("Game created successfully", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating game", error);
    }
  };

  // Handle decline/cancel
  const handleDecline = () => {
    navigate("/dashboard");
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

  // Check email verification whenever user or token changes
  useEffect(() => {
    if (user && decodedToken) {
      console.log(
        "Checking emails - User:",
        user.email,
        "Invite:",
        decodedToken.recipientEmail
      );
      if (user.email === decodedToken.recipientEmail) {
        setEmailVerified(true);
      } else {
        console.log("Email mismatch - redirecting to home");
        setEmailVerified(false);
        navigate("/");
      }
    }
  }, [user, decodedToken, navigate]);

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

      {!user ? (
        <VStack spacing={4}>
          <Card variant="filled" shadow="lg">
            <CardHeader>
              <Heading size="md">Sign in to continue</Heading>
            </CardHeader>
            <CardBody>
              <Text mb={4}>
                This invitation was sent to:{" "}
                {String(decodedToken?.recipientEmail)}
              </Text>
              {showLoginForm ? (
                <>
                  <Login />
                  <Button
                    variant="link"
                    onClick={() => setShowLoginForm(false)}
                  >
                    Need to sign up?
                  </Button>
                </>
              ) : (
                <>
                  <Signup />
                  <Button variant="link" onClick={() => setShowLoginForm(true)}>
                    Already have an account?
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </VStack>
      ) : emailVerified ? (
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
                  Accept Invitation
                </Button>
                <Button
                  colorScheme="gray"
                  margin="10px"
                  variant="outline"
                  onClick={handleDecline}
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
      ) : (
        <Card variant="filled" shadow="lg">
          <CardHeader>
            <Heading size="md">Wrong Email Address</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              This invitation was sent to {String(decodedToken?.recipientEmail)}
            </Text>
            <Text>Please log in with the correct email address.</Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default Invitation;
