import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Clean gradient background optimized for showmeh */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            opacity: 1,
          }}
        />

        {/* Modern geometric pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
          }}
        />

        {/* Main content container - centered in safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* User avatar with glow effect */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "48px",
              position: "relative",
            }}
          >
            {/* Glow effect */}
            <div
              style={{
                position: "absolute",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            {/* Avatar container */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "6px solid rgba(255, 255, 255, 0.95)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <img
                src={PROJECT_AVATAR_URL}
                alt="User avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Project title with mobile-optimized sizing */}
          <h1
            style={{
              fontSize: "84px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "32px",
              lineHeight: 1.0,
              letterSpacing: "-3px",
              textShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              maxWidth: "1000px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Project description with mobile-friendly sizing */}
          <p
            style={{
              fontSize: "42px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              marginBottom: "48px",
              lineHeight: 1.2,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
              maxWidth: "900px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* Platform and creator branding */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "24px 48px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "24px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.5px",
                textAlign: "center",
              }}
            >
              Farcaster Mini App
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "500",
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textAlign: "center",
              }}
            >
              Created by @{PROJECT_CREATOR}
            </span>
          </div>
        </div>

        {/* Bottom gradient fade for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
