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
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GameWithPartnerInfo, MongoUser } from "./Types";
import Invite from "./Invite";

function Dashboard() {
  const { user, logout } = UserAuth()!;
  const [userData, setUserData] = useState<MongoUser | null>(null);
  const [games, setGames] = useState<GameWithPartnerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

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
        if (!userData?._id) return;

        const url = `http://localhost:4000/games/user/${userData._id}/withPartners`;
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

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("invite");
    console.log("Checking for invite token:", token);
    if (token) {
      setInviteToken(token);
      setShowInviteModal(true);
      // Clean up URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

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
    <>
      <Box p={8}>
        <VStack spacing={8} align="stretch">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading>Welcome, {userData?.userName || "Player"}!</Heading>
            <Box>
              <Button onClick={handleLogout} ml={4}>
                Logout
              </Button>
            </Box>
          </Box>

          {games.length === 0 ? (
            <Text fontSize="lg" textAlign="center">
              You haven't started any games yet!
            </Text>
          ) : (
            <Grid
              templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
              gap={6}
            >
              <Card>
                <CardBody
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button onClick={onOpen}>Invite +</Button>
                  <Invite
                    isOpen={isOpen}
                    onClose={onClose}
                    userData={userData}
                  />
                </CardBody>
              </Card>

              {games.map((game) => (
                <Card key={game.gameId}>
                  <CardHeader>
                    <Heading size="md">
                      Game with {game.partner.userName}
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
                      onClick={() => navigate(`/hangman/${game.gameId}`)}
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

      {showInviteModal && inviteToken && (
        <Invite
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          token={inviteToken}
          userData={userData}
          onComplete={() => {
            setShowInviteModal(false);
            // Refresh games list
            fetchGames();
          }}
        />
      )}
    </>
  );
}

export default Dashboard;
