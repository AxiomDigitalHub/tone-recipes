import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          borderRadius: 36,
          color: "#f59e0b",
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        FK
      </div>
    ),
    {
      ...size,
    }
  );
}
