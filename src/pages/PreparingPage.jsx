import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PHASE_ONE_URL = "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";
const PHASE_TWO_URL = "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

export default function PreparingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const name = localStorage.getItem("skinstric_name") || "";
      const location = localStorage.getItem("skinstric_location") || "";
      const imageDataUrl = sessionStorage.getItem("skinstric_image") || "";
      const imageBase64 = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, "");

      try {
        const [, res2] = await Promise.all([
          fetch(PHASE_ONE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, location }),
          }),
          imageBase64
            ? fetch(PHASE_TWO_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageBase64 }),
              })
            : Promise.resolve(null),
        ]);
        const data = res2 ? await res2.json() : {};
        navigate("/analysis", { state: { data, imageDataUrl } });
      } catch {
        navigate("/analysis", { state: { data: {}, imageDataUrl } });
      }
    };
    run();
  }, []);

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
  center: { display: "flex", alignItems: "center", justifyContent: "center" },
  diamond: { width: 180, height: 180, transform: "rotate(45deg)", border: "1px dashed rgba(26,27,28,0.25)", display: "flex", alignItems: "center", justifyContent: "center" },
  inner: { transform: "rotate(-45deg)", textAlign: "center", padding: "0 32px" },
  text: { fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
};
