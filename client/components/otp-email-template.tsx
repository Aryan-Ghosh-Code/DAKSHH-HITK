import * as React from "react";

interface OtpEmailTemplateProps {
  otp: string;
}

export function OtpEmailTemplate({ otp }: OtpEmailTemplateProps) {
  const siteUrl = (
    process.env.SITE_URL ?? "https://dakshh-staging.vercel.app/"
  ).replace(/\/+$/, "");
  const dakshhLogo = `${siteUrl}/Dakshh_Logo.png`;
  const iicLogo = `${siteUrl}/IIC.png`;
  const heritageLogo = `${siteUrl}/Heritage.png`;
  const shhhLogo = `${siteUrl}/SHHH.png`;

  return (
    <div
      style={{
        backgroundColor: "#040404",
        margin: 0,
        padding: "18px 10px",
        fontFamily:
          '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#f4f4f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "980px",
          margin: "0 auto",
          backgroundColor: "#090909",
          border: "2px solid #1f1f1f",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid #1f1f1f",
            backgroundColor: "#0e0e0e",
          }}
        >
          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
          >
            <tbody>
              <tr>
                <td />
                <td align="right" style={{ verticalAlign: "middle" }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td style={{ paddingRight: "8px" }}>
                          <img
                            src={iicLogo}
                            alt="IIC logo"
                            width={34}
                            height={34}
                            style={{ display: "block", border: 0 }}
                          />
                        </td>
                        <td>
                          <img
                            src={heritageLogo}
                            alt="Heritage logo"
                            width={34}
                            height={34}
                            style={{ display: "block", border: 0 }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: "24px 18px" }}>
          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{ marginBottom: "18px" }}
          >
            <tbody>
              <tr>
                <td align="center" style={{ verticalAlign: "middle" }}>
                  <img
                    src={dakshhLogo}
                    alt="Dakshh logo"
                    width={72}
                    height={72}
                    style={{
                      display: "block",
                      border: 0,
                      margin: "0 auto 8px",
                    }}
                  />
                  <div
                    style={{
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "30px",
                      letterSpacing: "1.5px",
                      lineHeight: "34px",
                    }}
                  >
                    DAKSHH 2026
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "34px",
              lineHeight: "40px",
              color: "#ffffff",
              letterSpacing: "0.5px",
            }}
          >
            Sup Crewmate
          </h1>

          <p
            style={{
              margin: "0 0 16px",
              lineHeight: "26px",
              color: "#e4e4e7",
              fontSize: "17px",
            }}
          >
            Use this one-time code to verify your account. Enter it exactly as
            shown.
          </p>

          <div
            style={{
              borderRadius: "12px",
              border: "1px solid #2a2a2a",
              backgroundColor: "#0f0f0f",
              padding: "16px 14px",
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
                fontSize: "38px",
                fontWeight: 800,
                color: "#00ffff",
                display: "inline-block",
                lineHeight: "44px",
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
                    fontSize: "15px",
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
              fontSize: "14px",
              color: "#a1a1aa",
              lineHeight: "22px",
            }}
          >
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    </div>
  );
}
