import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

// Define the type for the context
type UserContextType = {
  user: User | null | undefined;
  createUser: (
    email: string,
    password: string
  ) => Promise<UserCredential> | undefined;
  signIn: (
    email: string,
    password: string
  ) => Promise<UserCredential> | undefined;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | null>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>();

  const createUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(userCredential.user.uid);
      // Axios call to save user to MongoDB
      console.log("Saving user to MongoDB");
      await axios
        .post("http://localhost:4000/users", {
          _id: userCredential.user.uid,
          userName: "Johnny Doe",
          email: email,
          gameMemberOf: "",
        })
        .then((res) => {
          console.log(res);
          console.log(res.data);
        })
        .catch((error) => {
          console.error("Error posting data:", error);
        });

      return userCredential!;
    } catch (error) {
      console.log(error);
      throw Error("signIn failed");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      console.log("looking for user");
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ createUser, user, logout, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
