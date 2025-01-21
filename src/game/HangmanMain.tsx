import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import { UserAuth } from "../auth/AuthContext";
// import { getMongoUser } from "../auth/MongoUser";
import { useNavigate } from "react-router-dom";
import Invite from "../Invite";
import { Button } from "@chakra-ui/react";
import axios from "axios";
// import getMongoUser from "../auth/MongoUser";
import { MongoUser, GameData } from "../Types";

function HangmanMain() {
  // const [user, setUser] = useState<MongoUser | null>();
  //remove spaces from word
  const [loading, setLoading] = useState(true); // Initial loading state
  const [wordToGuess, setWordToGuess] = useState("");
  const [wordLoaded, setWordLoaded] = useState(false); // Add this state
  const { user } = UserAuth() || {};
  const [userData, setUserData] = useState<MongoUser | null>();
  const [gameData, setGameData] = useState<GameData | null>();

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const navigate = useNavigate();
  const { logout } = UserAuth()!;

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
    ? wordToGuess.split("").every((letter) => guessedLetters.includes(letter))
    : false;

  const isLoser = incorrectLetters.length >= 6;

  const gameOver = isWinner || isLoser;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      //only add guessed letter if modal is not open
      if (!modalOpenState && !gameOver) {
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

  // Fetch game information
  const fetchGameData = async () => {
    console.log("fetching game data");
    if (userData && userData.gameMemberOf !== "") {
      try {
        console.log("User's game ID:", userData.gameMemberOf); // Debug log
        const userGameData = await axios.get(
          `http://localhost:4000/games/${userData.gameMemberOf}`
        );
        const gameDataResponse = userGameData.data;
        console.log("Game data received:", gameDataResponse); // Debug log

        // Set game data and word to guess in one go
        if (userData._id === gameDataResponse.partner1.id) {
          console.log(
            "Setting word for partner 1:",
            gameDataResponse.partner1.wordToGuess
          );
          setWordToGuess(gameDataResponse.partner1.wordToGuess);
          setWordLoaded(true);
        } else if (userData._id === gameDataResponse.partner2.id) {
          console.log(
            "Setting word for partner 2:",
            gameDataResponse.partner2.wordToGuess
          );
          setWordToGuess(gameDataResponse.partner2.wordToGuess);
          setWordLoaded(true);
        } else {
          console.log("User ID doesn't match either partner"); // Debug log
        }

        setGameData(gameDataResponse);
        return gameDataResponse;
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    } else {
      console.log("User not in a game yet"); // Debug log
    }
  };

  // Separate useEffect for fetching game data
  useEffect(() => {
    if (userData) {
      fetchGameData();
    }
  }, [userData]); // This will run whenever userData changes

  // Modify the user data fetching useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.uid) {
          console.log("No user UID available yet");
          return;
        }

        console.log("Fetching user data for:", user.uid);
        const mongoData = await axios.get(
          `http://localhost:4000/users/${user.uid}`
        );

        console.log("Received MongoDB user data:", mongoData.data);
        setUserData(mongoData.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call immediately if we have a user
    if (user?.uid) {
      console.log("User available, fetching data");
      fetchData();
    } else {
      console.log("Waiting for user authentication");
      setLoading(false);
    }
  }, [user]); // Changed dependency to just user

  return loading ? (
    <p>Loading...</p>
  ) : (
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
      {/* <Text fontSize="4xl" fontFamily="monospace">
        Welcome, It's time to guess {userData?.partner}'s word for today!
      </Text> */}
      {/* // show loser or isWinner */}
      {isLoser && <h1>You lost, try again tmrw :)</h1>}
      <Button onClick={handleLogout}> Log out :P</Button>

      <Invite
        isOpen={modalOpenState}
        onClose={() => setModalOpenState(false)}
        userData={userData ? userData : null}
      />

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        word={wordLoaded ? wordToGuess : ""}
        guessedLetters={guessedLetters}
        reveal={isLoser}
      />
      <div style={{ width: "100%" }}>
        <Keyboard
          activeKeys={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveKeys={incorrectLetters}
          gameOver={gameOver}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default HangmanMain;
