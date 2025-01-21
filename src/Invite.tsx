import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { MongoUser } from "./Types";
import decodeToken from "./Token";

interface InviteProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string;
  userData: MongoUser | null;
  onComplete?: () => void;
}

function Invite({ isOpen, onClose, token, userData, onComplete }: InviteProps) {
  const [inputEmail, setEmail] = useState("");
  const [inputWord, setInputWord] = useState("");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = decodeToken(token);
        console.log("Decoded invitation token:", decoded);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    console.log("Invite modal props:", { isOpen, token, userData });
  }, [isOpen, token, userData]);

  const sendInvite = async () => {
    try {
      await axios.post("http://localhost:4000/invite/new", {
        recipientEmail: inputEmail,
        senderId: userData?._id,
        wordToGuess: inputWord,
      });

      console.log("Invite sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  const handleAccept = async () => {
    try {
      await axios.post("http://localhost:4000/games/new", {
        partner1: decodedToken?.senderId,
        partner1WordToGuess: inputWord,
        partner2: userData?._id,
        partner2WordToGuess: decodedToken?.wordForPartner2,
      });
      onClose();
      onComplete?.();
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        {token ? (
          <>
            <ModalHeader>Game Invitation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>Someone invited you to play hangman! 😁</Text>
              <FormControl>
                <FormLabel>Your word for them to guess:</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Enter a word"
                  onChange={(e) => setInputWord(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={handleAccept}>
                Accept & Start Game
              </Button>
              <Button onClick={onClose}>Decline</Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader>
              Invite a partner you want to start a session with!
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormLabel></FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Give them a first word to guess :)"
                  onChange={(e) => setInputWord(e.target.value)}
                  style={{ marginTop: "1rem" }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={sendInvite}>
                Send Invite
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default Invite;
