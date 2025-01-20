import { useEffect, useState } from "react";
import { UserAuth } from "./auth/AuthContext";
import {
  Box,
  Button,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MongoUser, GameData } from "./Types";

interface Game {
  _id: string;
  partner1: {
    id: string;
    wordToGuess: string;
  };
  partner2: {
    id: string;
    wordToGuess: string;
  };
  dateStarted: string;
  activeStatus: boolean;
}

function Dashboard() {
  const { user, logout } = UserAuth()!;
  const [userData, setUserData] = useState<MongoUser | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for:", user?.uid);
        if (!user?.uid) return;

        const response = await axios.get(
          `http://localhost:4000/users/${user.uid}`
        );
        console.log("Received user data:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user?.uid) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log("Fetching games for user:", userData?._id);
        if (!userData?._id) {
          console.log("No user ID available");
          return;
        }

        const url = `http://localhost:4000/games/user/${userData._id}`;
        console.log("Making request to:", url);

        const response = await axios.get(url);
        console.log("Response received:", response.data);
        setGames(response.data);
      } catch (error: any) {
        console.error("Error fetching games:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchGames();
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <Text>Loading your games...</Text>;

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Welcome, {userData?.userName || "Player"}!</Heading>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>

        {games.length === 0 ? (
          <Text fontSize="lg" textAlign="center">
            You haven't started any games yet!
          </Text>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {games.map((game) => (
              <Card key={game._id}>
                <CardHeader>
                  <Heading size="md">
                    Game with{" "}
                    {user?.uid === game.partner1.id ? "Partner 2" : "Partner 1"}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Started: {new Date(game.dateStarted).toLocaleDateString()}
                  </Text>
                  <Text>
                    Status: {game.activeStatus ? "Active" : "Completed"}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme="blue"
                    onClick={() => navigate(`/hangman/${game._id}`)}
                  >
                    Play Game
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
}

export default Dashboard;
