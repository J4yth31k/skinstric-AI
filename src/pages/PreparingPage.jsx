import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PHASE_ONE_URL = "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";
const PHASE_TWO_URL = "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

export default function PreparingPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const name      = localStorage.getItem("skinstric_name") || "";
      const location  = localStorage.getItem("skinstric_location") || "";
      const imageDataUrl = sessionStorage.getItem("skinstric_image") || "";
      const imageBase64  = imageDataUrl.replace(/^data:image\/[a-z+]+;base64,/, "");

      // Phase One — fire and forget (registration, not needed for analysis)
      fetch(PHASE_ONE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      }).catch(() => {});

      // Phase Two — face analysis
      if (!imageBase64) {
        setError("No image found. Please go back and take or upload a photo.");
        return;
      }

      try {
        const res = await fetch(PHASE_TWO_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageBase64 }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("API error:", res.status, text);
          setError(`Analysis failed (${res.status}). Please try again.`);
          return;
        }

        const data = await res.json();
        console.log("API response:", JSON.stringify(data, null, 2));

        sessionStorage.setItem("skinstric_analysis", JSON.stringify(data));
        navigate("/analysis", { state: { data, imageDataUrl } });

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error. Check your connection and try again.");
      }
    };

    run();
  }, []);

  if (error) {
    return (
      <div style={s.screen}>
        <div style={s.center}>
          <div style={s.diamond}>
            <div style={s.inner}>
              <span style={{ ...s.text, color: "#c0392b", letterSpacing: "0.06em", textTransform: "none", fontSize: 10, lineHeight: 1.6 }}>
                {error}
              </span>
            </div>
          </div>
          <button style={s.retryBtn} onClick={() => window.history.back()}>← GO BACK</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.screen}>
      <div style={s.center}>
        <div style={s.diamond}>
          <div style={s.inner}>
            <span style={s.text}>PREPARING YOUR ANALYSIS ...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  screen: { background: "#fcfcfc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Inter',sans-serif" },
  center: { display: "flex", flexDirection: "column", alignItems: "center", gap: 32 },
  diamond: { width: 180, height: 180, transform: "rotate(45deg)", border: "1px dashed rgba(26,27,28,0.25)", display: "flex", alignItems: "center", justifyContent: "center" },
  inner: { transform: "rotate(-45deg)", textAlign: "center", padding: "0 28px" },
  text: { fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  retryBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
};
