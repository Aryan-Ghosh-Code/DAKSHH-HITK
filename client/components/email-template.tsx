import * as React from "react";

interface EmailTemplateProps {
  email: string;
}

const events = [
  "Hackathons and coding battles",
  "Robotics and hardware challenges",
  "Design sprints and UI/UX showcases",
  "Gaming and esports face-offs",
  "Technical quizzes and innovation talks",
];

export function EmailTemplate({ email }: EmailTemplateProps) {
  const avatarIndex =
    (Array.from(email).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 10 ||
      0) + 1;
  const siteUrl = (
    process.env.SITE_URL ?? "https://dakshh-staging.vercel.app/"
  ).replace(/\/+$/, "");
  const primaryCrewmate = `${siteUrl}/${avatarIndex}.png`;
  const dakshhLogo = `${siteUrl}/Dakshh_Logo.png`;
  const iicLogo = `${siteUrl}/IIC.png`;
  const heritageLogo = `${siteUrl}/Heritage.png`;

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
              margin: "0 0 18px",
              fontSize: "17px",
              lineHeight: "26px",
              color: "#e4e4e7",
            }}
          >
            You're in. Welcome to Dakshh 2026. Gear up and complete your mission
            across events with your squad.
          </p>

          <div
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "16px 14px",
              backgroundColor: "#0f0f0f",
              margin: "0 0 18px",
            }}
          >
            <table
              role="presentation"
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              style={{ marginBottom: "8px" }}
            >
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "middle" }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: "#ffd700",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        fontSize: "12px",
                      }}
                    >
                      Mission board
                    </p>
                  </td>
                  <td align="right" style={{ verticalAlign: "middle" }}>
                    <img
                      src={primaryCrewmate}
                      alt="Assigned crewmate"
                      width={56}
                      height={56}
                      style={{ display: "block", border: 0 }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <p
              style={{
                margin: "0 0 10px",
                color: "#a1a1aa",
                fontSize: "15px",
                lineHeight: "22px",
              }}
            >
              Your assignment includes:
            </p>
            <table
              role="presentation"
              width="100%"
              cellPadding={0}
              cellSpacing={0}
            >
              <tbody>
                {events.map((event) => (
                  <tr key={event}>
                    <td
                      style={{
                        color: "#00ffff",
                        fontSize: "18px",
                        width: "20px",
                        lineHeight: "24px",
                        verticalAlign: "top",
                      }}
                    >
                      •
                    </td>
                    <td
                      style={{
                        color: "#e4e4e7",
                        fontSize: "16px",
                        lineHeight: "24px",
                        paddingBottom: "3px",
                      }}
                    >
                      {event}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            style={{
              margin: "0 0 22px",
              fontSize: "17px",
              lineHeight: "24px",
              color: "#e4e4e7",
            }}
          >
            Compete, win, and climb the leaderboard with your crew.
          </p>

          <table role="presentation" cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td
                  style={{
                    borderRadius: "12px",
                    backgroundColor: "#ff4655",
                    border: "2px solid #ffffff",
                  }}
                >
                  <a
                    href={siteUrl}
                    style={{
                      display: "inline-block",
                      padding: "13px 20px",
                      borderRadius: "10px",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      fontSize: "14px",
                    }}
                  >
                    Start Your Mission
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <p
            style={{
              margin: "20px 0 0",
              color: "#a1a1aa",
              fontSize: "15px",
              lineHeight: "22px",
            }}
          >
            Stay sharp and finish your tasks.
            <br />
            See you on the ship.
          </p>
        </div>
      </div>
    </div>
  );
}
