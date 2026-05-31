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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff5a3c",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            marginLeft: 16,
            borderTop: "40px solid transparent",
            borderBottom: "40px solid transparent",
            borderLeft: "62px solid #ffffff",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
