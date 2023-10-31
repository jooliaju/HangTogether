import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import { UserAuth } from "../auth/AuthContext";
// import { getMongoUser } from "../auth/MongoUser";
import { useNavigate } from "react-router-dom";
import Invite from "../Invite";
import { Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import axios from "axios";
// import getMongoUser from "../auth/MongoUser";
import { MongoUser, GameData } from "../Types";
import { set } from "firebase/database";

function HangmanMain() {
  // const [user, setUser] = useState<MongoUser | null>();
  //remove spaces from word
  const [loading, setLoading] = useState(true); // Initial loading state
  const [wordToGuess, setWordToGuess] = useState("");
  const { user } = UserAuth() || {};
  const [userData, setUserData] = useState<MongoUser | null>();
  const [gameData, setGameData] = useState<GameData | null>();

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

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
    if (userData && userData.gameMemberOf != "") {
      // get game data
      console.log("user is part of game " + userData.gameMemberOf);
      try {
        const userGameData = await axios.get(
          `http://localhost:4000/games/${userData.gameMemberOf}`
        );
        const userGameData_set = userGameData.data;

        setGameData(userGameData_set);

        if (gameData && userData) {
          console.log("game data is not null");
          if (userData._id == gameData.partner1.id) {
            console.log("user is partner 1");
            console.log("word to guess is " + gameData.partner1.wordToGuess);
            setWordToGuess(gameData.partner1.wordToGuess);
          } else if (userData._id == gameData.partner2.id) {
            console.log("user is partner 2");
            console.log("word to guess is " + gameData.partner2.wordToGuess);
            setWordToGuess(gameData.partner2.wordToGuess);
          }
        }
        return userGameData.data;
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    }
  };
  // Fetch user information from MongoDB, temporary solution
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Mongo user data: " + user?.uid);
        const mongoData = await axios.get(
          `http://localhost:4000/users/${user?.uid}`
        );
        console.log(mongoData.data);
        const userData_set = mongoData.data;
        setUserData(userData_set);

        const gameDataResponse = await fetchGameData();
        console.log("game data response: " + gameDataResponse);

        // if (userData && gameData) {
        setLoading(false);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
        onModalStateChange={handleModalStateChange}
        userData={userData ? userData : null}
      />

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      {wordToGuess && (
        <HangmanWord
          word={wordToGuess}
          guessedLetters={guessedLetters}
          reveal={isLoser}
        />
      )}
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
