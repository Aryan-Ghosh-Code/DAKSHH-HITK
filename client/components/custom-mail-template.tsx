import { images } from "@/constants/images";

interface CustomMailTemplateProps {
  htmlContent: string;
}

export function CustomMailTemplate({ htmlContent }: CustomMailTemplateProps) {
  const dakshhLogo = images.Dakshh_Logo;
  const iicLogo = images.IIC;
  const heritageLogo = images.Heritage;

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

          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              margin: "0 0 18px",
              fontSize: "17px",
              lineHeight: "26px",
              color: "#e4e4e7",
            }}
          />
        </div>
      </div>
    </div>
  );
}
