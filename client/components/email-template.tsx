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
  const siteUrl = "https://dakshh-hitk.com";
  const primaryCrewmate = `${siteUrl}/${avatarIndex}.png`;
  const leftPeek = `${siteUrl}/peeking2.png`;
  const rightPeek = `${siteUrl}/peeking.png`;

  return (
    <div
      style={{
        backgroundColor: "#050505",
        margin: 0,
        padding: "28px 14px",
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
          TECHFEST DAKSHH: AMONG US EDITION
        </div>

        <div style={{ padding: "28px 24px" }}>
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
            Incoming transmission
          </p>

          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{
              marginBottom: "14px",
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
                      fontSize: "31px",
                      lineHeight: "37px",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Welcome aboard
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
              fontSize: "16px",
              lineHeight: "24px",
              color: "#e4e4e7",
            }}
          >
            You are officially part of <strong>TechFest Dakshh</strong>. Suit up
            for our <strong>Among Us</strong> themed mission and complete as
            many tasks as possible with your crew.
          </p>

          <div
            style={{
              border: "2px solid #ffffff",
              borderRadius: "14px",
              padding: "16px",
              backgroundColor: "rgba(255,255,255,0.03)",
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
                        fontSize: "13px",
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
                fontSize: "14px",
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
                        fontSize: "15px",
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
              fontSize: "16px",
              lineHeight: "24px",
              color: "#e4e4e7",
            }}
          >
            Compete across events, earn recognition, and climb the leaderboard.
            Every completed task gets your squad one step closer to MVP status.
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
                      padding: "12px 18px",
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
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
            Stay sharp, trust your instincts, and finish your tasks.
            <br />
            See you on the ship.
          </p>
        </div>
      </div>
    </div>
  );
}
