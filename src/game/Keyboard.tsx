import styles from "../css/Keyboard.module.css";

const KEYS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

type KeyboardProps = {
  activeKeys: string[];
  inactiveKeys: string[];
  addGuessedLetter: (letter: string) => void;
  gameOver: boolean;
};

export function Keyboard({
  activeKeys,
  inactiveKeys,
  addGuessedLetter,
  gameOver,
}: KeyboardProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(75px, 1fr))",
        gap: ".5rem",
        opacity: gameOver ? ".5" : "1",
      }}
    >
      {KEYS.map((key) => {
        const isActive = activeKeys.includes(key);
        const isInactive = inactiveKeys.includes(key);

        return (
          <button
            className={`${styles.btn} ${isActive ? styles.active : ""} ${
              isInactive ? styles.inactive : ""
            } }
            }`}
            disabled={isActive || isInactive || gameOver}
            key={key}
            onClick={() => addGuessedLetter(key)}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
