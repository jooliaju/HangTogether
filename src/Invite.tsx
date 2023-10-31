import { Button } from "@chakra-ui/react";
import axios from "axios";
import { UserAuth } from "./auth/AuthContext";
import {
  useDisclosure,
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import getMongoUser from "./auth/MongoUser";
import { MongoUser } from "./Types";

type InviteProps = {
  onModalStateChange: (modalOpenState: boolean) => void;
  userData: MongoUser | null;
};
function Invite({ onModalStateChange, userData }: InviteProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputEmail, setEmail] = useState("");
  const [inputWord, setInputWord] = useState("");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [user, setUser] = useState<MongoUser | null>();

  // Handle invites
  const sendInvite = async () => {
    try {
      const response = await axios.post("http://localhost:4000/invite", {
        recipientEmail: inputEmail,
        senderId: user?._id,
        wordToGuess: inputWord,
      });

      console.log("Invite sent successfully", response.data);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  // useEffect(() => {
  //   // Call getMongoUser when the component is mounted
  //   const fetchMongoUser = async () => {
  //     try {
  //       const mongoUser = await getMongoUser();
  //       setUser(mongoUser);
  //     } catch (error) {
  //       console.error("Error fetching Mongo user:", error);
  //     }
  //   };

  //   fetchMongoUser();
  // }, []); // Empty dependency array to run only once

  useEffect(() => {
    // Notify the parent component whenever the modal state changes
    onModalStateChange(isOpen);
    setUser(userData);
    console.log(userData?._id);
  }, [isOpen, onModalStateChange]);

  return (
    <div>
      <Button onClick={onOpen}>Invite</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
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
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Invite;
