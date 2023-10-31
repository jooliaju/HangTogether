type MongoUser = {
  _id: string;
  gameMemberOf: string;
  partner: string;
  email: string;
  // Other properties of the user object if available
};

type GameData = {
  _id: string;
  //make partner1 and partner2 objects
  partner1: {
    id: string;
    wordToGuess: string;
  };
  partner2: {
    id: string;
    wordToGuess: string;
  };
  partner1WordToGuess: string;
  partner2WordToGuess: string;
};

export type { MongoUser, GameData };
