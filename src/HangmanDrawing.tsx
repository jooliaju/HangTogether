const Head = (
  <div
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "100%",
      border: "10px solid black",
      position: "absolute",
      top: "50px",
      right: "-30px",
    }}
  />
);
const Torso = (
  <div
    style={{
      width: "10px",
      height: "100px",
      position: "absolute",
      background: "black",
      top: "120px",
      right: 0,
    }}
  />
);

const RightArm = (
  <div
    style={{
      width: "100px",
      height: "10px",
      position: "absolute",
      background: "black",
      top: "150px",
      right: "-100px",
      rotate: "-30deg",
      transformOrigin: "bottom left",
    }}
  />
);

const LeftArm = (
  <div
    style={{
      width: "100px",
      height: "10px",
      position: "absolute",
      background: "black",
      top: "150px",
      right: "10px",
      rotate: "30deg",
      transformOrigin: "bottom right",
    }}
  />
);

const RightLeg = (
  <div
    style={{
      width: "100px",
      height: "10px",
      position: "absolute",
      background: "black",
      top: "210px",
      right: "-90px",
      rotate: "60deg",
      transformOrigin: "bottom left",
    }}
  />
);

const LeftLeg = (
  <div
    style={{
      width: "100px",
      height: "10px",
      position: "absolute",
      background: "black",
      top: "210px",
      right: 0,
      rotate: "-60deg",
      transformOrigin: "bottom right",
    }}
  />
);

export function HangmanDrawing() {
  return (
    <div style={{ position: "relative" }}>
      {Head}
      {Torso}
      {RightArm}
      {LeftArm}
      {RightLeg}
      {LeftLeg}
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
