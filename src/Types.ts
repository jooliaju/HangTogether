// User interfaces
export interface MongoUser {
  _id: string;
  userName: string;
  email: string;
  gameMemberOf: string;
  partner: string;
}

// Game interfaces
export interface Partner {
  id: string;
  wordToGuess: string;
  userName?: string; // Added for partner info
  email?: string; // Added for partner info
}

export interface Game {
  _id: string;
  partner1: Partner;
  partner2: Partner;
  dateStarted: string;
  activeStatus: boolean;
}

export interface GameWithPartnerInfo {
  gameId: string;
  partner: {
    id: string;
    userName: string;
    email: string;
  };
  dateStarted: string;
  activeStatus: boolean;
  yourWord: string;
  theirWord: string;
}

export interface GameData {
  partner1: {
    id: string;
    wordToGuess: string;
  };
  partner2: {
    id: string;
    wordToGuess: string;
  };
  gameId: string;
  activeStatus: boolean;
  dateStarted: Date;
}
