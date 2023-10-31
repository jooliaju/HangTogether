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
  Spacer,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import decodeToken from "./Token";
import { useNavigate } from "react-router-dom";

function Invitation() {
  const { user } = UserAuth()!;
  const navigate = useNavigate();
  //   const { token } = useParams();
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get("token");

  const [decodedToken, setDecodedToken] = useState<JWTPayload | null>();
  const [inviteClose, setInviteClose] = useState(false); // This is to close the invite card, set true to close
  // const [accepted, setAccepted] = useState(false); // This is to close the invite card, set true to close
  const [partner1WordToGuess, setPartner1WordToGuess] = useState("");
  const [showWordInput, setShowWordInput] = useState(false);

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
      //take to game page
      navigate("/hangman");
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
      <Text fontFamily="cursive" fontSize="3em">
        Le Invitation
      </Text>

      {decodedToken &&
        user?.email === decodedToken.recipientEmail &&
        !inviteClose && (
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
              <Button colorScheme="green" margin="10px" onClick={handleAccept1}>
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

      {decodedToken &&
        user?.email === decodedToken.recipientEmail &&
        inviteClose &&
        showWordInput && (
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
              <Button colorScheme="green" margin="10px" onClick={handleAccept2}>
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
      {/* Render your invitation content here */}
    </div>
  );
}

export default Invitation;
