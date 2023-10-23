type HangmanWordProps = {
  word: string;
  guessedLetters: string[];
  reveal: boolean;
};

export function HangmanWord({
  word,
  guessedLetters,
  reveal,
}: HangmanWordProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: ".25em",
        fontSize: "6rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}
    >
      {word.split("").map((letter, index) => (
        <span style={{ borderBottom: ".1em solid black" }} key={index}>
          <span
            style={{
              visibility:
                guessedLetters.includes(letter) || reveal
                  ? "visible"
                  : "hidden",
              color:
                !guessedLetters.includes(letter) && reveal
                  ? "#F97187"
                  : "black",
            }}
          >
            {" "}
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}
