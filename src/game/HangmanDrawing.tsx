const BodyParts = [
  {
    id: "head",
    component: (
      <div
        key="head"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          border: "10px solid black",
          position: "absolute",
          top: "50px",
          right: "-20px",
        }}
      />
    ),
  },
  {
    id: "torso",
    component: (
      <div
        key="torso"
        style={{
          width: "10px",
          height: "100px",
          position: "absolute",
          background: "black",
          top: "100px",
          right: 0,
        }}
      />
    ),
  },
  {
    id: "rightArm",
    component: (
      <div
        key="rightArm"
        style={{
          width: "100px",
          height: "10px",
          position: "absolute",
          background: "black",
          top: "130px",
          right: "-100px",
          rotate: "-30deg",
          transformOrigin: "bottom left",
        }}
      />
    ),
  },
  {
    id: "leftArm",
    component: (
      <div
        key="leftArm"
        style={{
          width: "100px",
          height: "10px",
          position: "absolute",
          background: "black",
          top: "130px",
          right: "10px",
          rotate: "30deg",
          transformOrigin: "bottom right",
        }}
      />
    ),
  },
  {
    id: "rightLeg",
    component: (
      <div
        key="rightLeg"
        style={{
          width: "100px",
          height: "10px",
          position: "absolute",
          background: "black",
          top: "190px",
          right: "-90px",
          rotate: "60deg",
          transformOrigin: "bottom left",
        }}
      />
    ),
  },
  {
    id: "leftLeg",
    component: (
      <div
        key="leftLeg"
        style={{
          width: "100px",
          height: "10px",
          position: "absolute",
          background: "black",
          top: "190px",
          right: 0,
          rotate: "-60deg",
          transformOrigin: "bottom right",
        }}
      />
    ),
  },
];

type HangmanDrawingProps = {
  numberOfGuesses: number;
};
export function HangmanDrawing({ numberOfGuesses }: HangmanDrawingProps) {
  return (
    <div style={{ position: "relative" }}>
      {BodyParts.slice(0, numberOfGuesses).map((part) => part.component)}
      <div
        style={{
          height: "50px",
          width: "10px",
          position: "absolute",
          top: "0",
          right: "0",
          background: "black",
        }}
      ></div>
      <div
        style={{
          height: "10px",
          width: "200px",
          marginLeft: "120px",
          background: "black",
        }}
      ></div>
      <div
        style={{
          height: "400px",
          width: "10px",
          marginLeft: "120px",
          background: "black",
        }}
      ></div>
      <div
        style={{ height: "10px", width: "250px", background: "black" }}
      ></div>
    </div>
  );
}
