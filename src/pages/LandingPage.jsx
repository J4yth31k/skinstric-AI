import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.screen}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.brand}>SKINSTRIC</span>
          <span style={styles.sectionTag}>[ INTRO ]</span>
        </div>
        <button style={styles.takeTestBtn} onClick={() => navigate("/analytics")}>
          TAKE TEST
        </button>
      </header>

      <main style={styles.body}>
        <div style={styles.leftNav}>
          <button style={styles.navBtn} aria-label="Previous">
            <Diamond direction="left" />
          </button>
          <span style={styles.navLabel}>INTRODUCING AI</span>
        </div>

        <div style={styles.heroCenter}>
          <h1 style={styles.heroText}>
            Sophisticated<br />skincare
          </h1>
        </div>

        <div style={styles.rightNav}>
          <span style={styles.navLabel}>LEARN MORE</span>
          <button style={styles.navBtn} aria-label="Next">
            <Diamond direction="right" />
          </button>
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          SKINSTRIC INTRODUCES AI TECHNOLOGY TO TAKE CHANCE<br />
          AND GUESSWORK OUT OF YOUR SKIN ROUTINE.<br />
          DISCOVER YOUR IDEAL ROUTINE TODAY.
        </p>
      </footer>
    </div>
  );
}

function Diamond({ direction }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 28,
        height: 28,
        border: "1px solid #1a1b1c",
        transform: "rotate(45deg)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(-45deg)`,
          fontSize: 10,
          color: "#1a1b1c",
          lineHeight: 1,
        }}
      >
        {direction === "left" ? "←" : "→"}
      </span>
    </span>
  );
}

const styles = {
  screen: {
    background: "#fcfcfc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
    border: "1px solid #1a1b1c",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: 56,
    borderBottom: "1px solid rgba(26,27,28,0.15)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  brand: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#1a1b1c",
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: 400,
    color: "#1a1b1c",
    opacity: 0.45,
    letterSpacing: "0.06em",
  },
  takeTestBtn: {
    background: "#1a1b1c",
    color: "#fcfcfc",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.12em",
    padding: "8px 18px",
    border: "none",
    cursor: "pointer",
  },
  body: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    position: "relative",
  },
  leftNav: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    minWidth: 120,
  },
  rightNav: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
    minWidth: 120,
  },
  navBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.14em",
    color: "#1a1b1c",
    textTransform: "uppercase",
  },
  heroCenter: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  heroText: {
    fontSize: "clamp(52px, 7vw, 96px)",
    fontWeight: 300,
    lineHeight: 1.1,
    color: "#1a1b1c",
    letterSpacing: "-0.01em",
  },
  footer: {
    padding: "24px 32px",
    borderTop: "none",
  },
  footerText: {
    fontSize: 9,
    fontWeight: 400,
    letterSpacing: "0.08em",
    color: "rgba(26,27,28,0.5)",
    lineHeight: 1.8,
    textTransform: "uppercase",
  },
};
