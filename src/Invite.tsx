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

type InviteProps = {
  onModalStateChange: (modalOpenState: boolean) => void;
};
function Invite({ onModalStateChange }: InviteProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputEmail, setEmail] = useState("");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const { user } = UserAuth()!;

  // Handle invite api
  const sendInvite = async () => {
    try {
      const response = await axios.post("http://localhost:4000/invite", {
        recipientEmail: inputEmail,
        senderEmail: user?.email,
        gameId: "123123123",
      });

      console.log("Invite sent successfully", response.data);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  useEffect(() => {
    // Notify the parent component whenever the modal state changes
    onModalStateChange(isOpen);
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
