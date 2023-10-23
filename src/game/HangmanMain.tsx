import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import { UserAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Invite from "../Invite";
import { Button } from "@chakra-ui/react";

function HangmanMain() {
  const [wordToGuess, setWordToGuess] = useState("microscope");

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const { user } = UserAuth()!;

  const { logout } = UserAuth()!;
  const navigate = useNavigate();

  //handling modal state
  const [modalOpenState, setModalOpenState] = useState(false);
  const handleModalStateChange = (isOpen: boolean) => {
    setModalOpenState(isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("logged out");
    } catch (error) {
      console.log("error");
    }
  };

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter)) return;

      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    //only dependecy is the guessed letters
    //function only reruns when guessed letters change
    [guessedLetters]
  );

  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isLoser = incorrectLetters.length >= 6;

  const gameOver = isWinner || isLoser;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      //only add guessed letter if modal is not open
      if (!modalOpenState) {
        const key = e.key;
        if (!key.match(/^[a-z]$/)) return;
        e.preventDefault();
        addGuessedLetter(key);
      } else {
        return;
      }
    };
    document.addEventListener("keypress", handler);
    return () => document.removeEventListener("keypress", handler);
  });

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div>
        {isWinner && "You win!!"}
        {isLoser && "You lose :("}
      </div>
      <div>Hi {user?.email}</div>
      <Button onClick={handleLogout}> Log out :)</Button>

      <Invite onModalStateChange={handleModalStateChange} />

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        word={wordToGuess}
        guessedLetters={guessedLetters}
        reveal={isLoser}
      />
      <div style={{ width: "100%" }}>
        <Keyboard
          // correct letters are the letters that are in the word to guess
          activeKeys={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          // incorrect letters are the letters that are not in the word
          inactiveKeys={incorrectLetters}
          gameOver={gameOver}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default HangmanMain;
