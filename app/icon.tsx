import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 512,
  height: 512,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            color: "#000000",
            fontSize: 370,
            lineHeight: 1,
            fontWeight: 1000,
            letterSpacing: "-0.11em",
            transform: "translateX(-13px)",
          }}
        >
          P
        </div>
        <div
          style={{
            position: "absolute",
            color: "#000000",
            fontSize: 370,
            lineHeight: 1,
            fontWeight: 1000,
            letterSpacing: "-0.11em",
            transform: "translateX(-7px)",
          }}
        >
          P
        </div>
      </div>
    ),
    size
  );
}
