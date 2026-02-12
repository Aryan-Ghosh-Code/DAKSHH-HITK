import * as React from "react";

interface OtpEmailTemplateProps {
  otp: string;
}

export function OtpEmailTemplate({ otp }: OtpEmailTemplateProps) {
  const siteUrl = "https://dakshh-hitk.com";
  const leftPeek = `${siteUrl}/peeking2.png`;
  const rightPeek = `${siteUrl}/peeking.png`;
  const shhhLogo = `${siteUrl}/SHHH.png`;

  return (
    <div
      style={{
        backgroundColor: "#050505",
        margin: 0,
        padding: "24px 14px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#f4f4f5",
      }}
    >
      <div
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          backgroundColor: "#0a0a0a",
          border: "3px solid #ffffff",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(90deg, rgba(255,70,85,0.95) 0%, rgba(0,106,255,0.95) 55%, rgba(255,214,0,0.95) 100%)",
            padding: "16px 24px",
            color: "#09090b",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          DAKSHH OTP VERIFICATION
        </div>

        <div style={{ padding: "26px 24px" }}>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: "13px",
              color: "#00ffff",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Emergency verification signal
          </p>

          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{
              marginBottom: "16px",
            }}
          >
            <tbody>
              <tr>
                <td
                  align="left"
                  style={{ width: "64px", verticalAlign: "middle" }}
                >
                  <img
                    src={leftPeek}
                    alt="Crewmate peeking"
                    width={52}
                    height={52}
                    style={{ display: "block", border: 0 }}
                  />
                </td>
                <td align="center" style={{ verticalAlign: "middle" }}>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "29px",
                      lineHeight: "35px",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Confirm your account
                  </h1>
                </td>
                <td
                  align="right"
                  style={{ width: "64px", verticalAlign: "middle" }}
                >
                  <img
                    src={rightPeek}
                    alt="Crewmate peeking"
                    width={52}
                    height={52}
                    style={{ display: "block", border: 0 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <p
            style={{
              margin: "0 0 16px",
              lineHeight: "24px",
              color: "#e4e4e7",
              fontSize: "16px",
            }}
          >
            Use this one-time code to verify your account and complete
            onboarding. Keep it private and enter it exactly as shown.
          </p>

          <div
            style={{
              borderRadius: "14px",
              border: "2px solid #ffffff",
              backgroundColor: "rgba(255,255,255,0.03)",
              padding: "14px 16px",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                color: "#ffd700",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Your OTP code
            </p>
            <span
              style={{
                letterSpacing: "8px",
                fontSize: "34px",
                fontWeight: 800,
                color: "#00ffff",
                display: "inline-block",
                lineHeight: "40px",
              }}
            >
              {otp}
            </span>
          </div>

          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{ marginBottom: "12px" }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    verticalAlign: "middle",
                    color: "#a1a1aa",
                    fontSize: "14px",
                  }}
                >
                  This code expires in{" "}
                  <strong style={{ color: "#ffffff" }}>10 minutes</strong>.
                </td>
                <td align="right" style={{ verticalAlign: "middle" }}>
                  <img
                    src={shhhLogo}
                    alt="SHHH"
                    width={54}
                    height={54}
                    style={{ display: "block", border: 0 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#a1a1aa",
              lineHeight: "20px",
            }}
          >
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    </div>
  );
}
