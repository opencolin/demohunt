import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

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
          background: "#ff5a3c",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            marginLeft: 3,
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
            borderLeft: "11px solid #ffffff",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
