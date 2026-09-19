import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "अधिकार Adhikaar - Civic Assistance Platform",
    short_name: "Adhikaar",
    description:
      "Democratizing statutory awareness, government schemes, and legal aid access for every Indian citizen.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F5",
    theme_color: "#1B3B2B",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
