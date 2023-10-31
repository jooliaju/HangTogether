import axios from "axios";
import React from "react";
import { UserAuth } from "../auth/AuthContext";
import { MongoUser } from "../Types";

const getMongoUser = async (): Promise<MongoUser | null> => {
  const { user } = UserAuth() || {};
  const response = await axios.get(`http://localhost:4000/users/${user?.uid}`);
  console.log("User is member of: " + response.data["gameMemberOf"]);
  return response.data;
};

export default getMongoUser;
