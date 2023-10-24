import { decodeJwt } from "jose";
import React from "react";

const decodeToken = (token: string) => {
  try {
    const decoded = decodeJwt(token);
    // Store the decoded token in state

    return decoded;
  } catch (error) {
    // Handle token decoding errors (e.g., token is invalid or expired)
    console.error("Token decoding error:", error);
    return null;
  }
};

export default decodeToken;
