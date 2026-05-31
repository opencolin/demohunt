import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Demo Hunt",
    short_name: "DemoHunt",
    description:
      "A daily feed of the best product demos, hackathon projects, and launch videos. Vote for your favorites.",
    start_url: "/",
    display: "standalone",
    theme_color: "#ff5a3c",
    background_color: "#0a0a0a",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    share_target: {
      action: "/submit",
      method: "GET",
      params: {
        url: "url",
        text: "text",
        title: "title",
      },
    },
  };
}
