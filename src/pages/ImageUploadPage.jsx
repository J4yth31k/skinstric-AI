import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PHASE_TWO_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

export default function ImageUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [base64, setBase64] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      // strip the data URL prefix — send raw base64 only
      setBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => readFile(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleProceed = async () => {
    if (!base64) { setError("Please upload an image first."); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(PHASE_TWO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      navigate("/demographics", { state: { data, imageBase64: preview } });
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.screen}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.brand}>SKINSTRIC</span>
          <span style={styles.sectionTag}>[ A.I. ANALYSIS ]</span>
        </div>
        <button style={styles.enterBtn}>ENTER CODE</button>
      </header>

      {/* Body */}
      <main style={styles.body}>
        <p style={styles.pageTitle}>A.I. Analysis</p>
        <p style={styles.subtitle}>
          TO GET BETTER RESULTS MAKE SURE TO ALLOW<br />
          A.I. TO ACCESS YOUR CAMERA
        </p>

        {/* Upload box */}
        <div style={styles.uploadWrapper}>
          <div
            style={{
              ...styles.uploadBox,
              borderColor: dragging ? "#1a1b1c" : "rgba(26,27,28,0.25)",
              background: dragging ? "rgba(26,27,28,0.03)" : "#fcfcfc",
            }}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {preview ? (
              <img src={preview} alt="preview" style={styles.preview} />
            ) : (
              <div style={styles.uploadPrompt}>
                <CameraIcon />
                <p style={styles.uploadLabel}>CLICK TO UPLOAD</p>
                <p style={styles.uploadSub}>or drag & drop your image here</p>
              </div>
            )}
          </div>

          {/* Corner accents */}
          <div style={{ ...styles.corner, top: 0, left: 0, borderTop: "2px solid #1a1b1c", borderLeft: "2px solid #1a1b1c" }} />
          <div style={{ ...styles.corner, top: 0, right: 0, borderTop: "2px solid #1a1b1c", borderRight: "2px solid #1a1b1c" }} />
          <div style={{ ...styles.corner, bottom: 0, left: 0, borderBottom: "2px solid #1a1b1c", borderLeft: "2px solid #1a1b1c" }} />
          <div style={{ ...styles.corner, bottom: 0, right: 0, borderBottom: "2px solid #1a1b1c", borderRight: "2px solid #1a1b1c" }} />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {error && <p style={styles.errorMsg}>{error}</p>}

        {/* Navigation */}
        <div style={styles.navRow}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <span>←</span>
            <span>BACK</span>
          </button>
          <button
            style={{ ...styles.proceedBtn, opacity: loading || !base64 ? 0.5 : 1 }}
            onClick={handleProceed}
            disabled={loading || !base64}
          >
            <span>{loading ? "UPLOADING..." : "PROCEED"}</span>
            <span>→</span>
          </button>
        </div>
      </main>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.3, marginBottom: 16 }}>
      <path d="M18 8l-3 4H8a4 4 0 00-4 4v20a4 4 0 004 4h32a4 4 0 004-4V16a4 4 0 00-4-4h-7l-3-4H18z" stroke="#1a1b1c" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="26" r="7" stroke="#1a1b1c" strokeWidth="2" />
    </svg>
  );
}

const styles = {
  screen: {
    background: "#fcfcfc", minHeight: "100vh",
    display: "flex", flexDirection: "column",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
    border: "1px solid #1a1b1c",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: 64,
    borderBottom: "1px solid rgba(26,27,28,0.15)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  brand: { fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#1a1b1c" },
  sectionTag: { fontSize: 12, fontWeight: 500, color: "#1a1b1c", opacity: 0.5, letterSpacing: "0.06em" },
  enterBtn: {
    background: "#1a1b1c", color: "#fcfcfc",
    fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
    padding: "8px 16px", border: "none", cursor: "pointer",
  },
  body: {
    flex: 1, padding: "48px 64px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
  },
  pageTitle: {
    fontSize: 13, fontWeight: 500, color: "#1a1b1c",
    letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5,
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 11, fontWeight: 500, color: "#1a1b1c", opacity: 0.45,
    letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.8,
  },
  uploadWrapper: {
    position: "relative", width: "100%", maxWidth: 480,
  },
  uploadBox: {
    width: "100%", aspectRatio: "1 / 1",
    border: "1px dashed", display: "flex",
    alignItems: "center", justifyContent: "center",
    cursor: "pointer", overflow: "hidden",
    transition: "border-color 0.2s, background 0.2s",
  },
  uploadPrompt: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  },
  uploadLabel: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
    color: "#1a1b1c", opacity: 0.5, margin: 0,
  },
  uploadSub: {
    fontSize: 10, fontWeight: 400, letterSpacing: "0.06em",
    color: "#1a1b1c", opacity: 0.3, marginTop: 6,
  },
  preview: { width: "100%", height: "100%", objectFit: "cover" },
  corner: { position: "absolute", width: 16, height: 16 },
  errorMsg: {
    fontSize: 11, color: "#c0392b", fontWeight: 500, letterSpacing: "0.04em",
  },
  navRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", marginTop: "auto",
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: 8,
    color: "rgba(26,27,28,0.45)", fontSize: 10, fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
    border: "none", background: "none",
  },
  proceedBtn: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#1a1b1c", color: "#fcfcfc",
    fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", cursor: "pointer",
    border: "none", padding: "14px 28px",
  },
};
