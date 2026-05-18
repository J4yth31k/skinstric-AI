import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ImageChoicePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleGallery = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        const resized = canvas.toDataURL("image/jpeg", 0.8);
        sessionStorage.setItem("skinstric_image", resized);
        setPreview(resized);
      };
      img.onerror = () => alert("Could not load image. Please try another file.");
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Preview screen — matches slide 013 style
  if (preview) {
    return (
      <div style={ps.screen}>
        <header style={ps.header}>
          <div style={ps.hl}>
            <span style={ps.brand}>SKINSTRIC</span>
            <span style={ps.tag}>[ ANALYSIS ]</span>
          </div>
        </header>
        <div style={ps.imgWrap}>
          <img src={preview} alt="uploaded" style={ps.img} />
          <div style={ps.tips}>
            <span style={ps.tipsLabel}>TO GET BETTER RESULTS MAKE SURE TO HAVE:</span>
            <div style={ps.tipsList}>
              {["NEUTRAL EXPRESSION", "FRONTAL POSE", "ADEQUATE LIGHTING"].map((t) => (
                <span key={t} style={ps.tip}>◇ {t}</span>
              ))}
            </div>
          </div>
        </div>
        <nav style={ps.nav}>
          <button style={ps.backBtn} onClick={() => setPreview(null)}>
            <NavDiamondLight dir="left" /><span>BACK</span>
          </button>
          <button style={ps.proceedBtn} onClick={() => navigate("/preparing")}>
            <span>PROCEED</span><NavDiamondLight />
          </button>
        </nav>
      </div>
    );
  }

  const handleAllow = () => {
    setShowModal(false);
    navigate("/camera");
  };

  return (
    <div style={s.screen}>
      <header style={s.header}>
        <div style={s.hl}>
          <span style={s.brand}>SKINSTRIC</span>
          <span style={s.tag}>[ INTRO ]</span>
        </div>
      </header>

      <main style={s.body}>
        <p style={s.startLabel}>TO START ANALYSIS</p>

        <div style={s.choices}>
          {/* Camera option */}
          <div style={s.option} onClick={() => setShowModal(true)}>
            <div style={s.diamond}>
              <div style={s.inner}>
                <ApertureIcon />
                <span style={s.optionLabel}>ALLOW A.I.<br />TO SCAN YOUR FACE</span>
              </div>
            </div>
          </div>

          {/* Gallery option */}
          <div style={s.option} onClick={() => fileInputRef.current?.click()}>
            <div style={s.diamond}>
              <div style={s.inner}>
                <GalleryIcon />
                <span style={s.optionLabel}>ALLOW A.I.<br />ACCESS GALLERY</span>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleGallery}
        />
      </main>

      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate("/location")}>
          <NavDiamond dir="left" />
          <span>BACK</span>
        </button>
      </nav>

      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <p style={s.modalText}>ALLOW A.I. TO ACCESS YOUR CAMERA</p>
            <div style={s.modalBtns}>
              <button style={s.denyBtn} onClick={() => setShowModal(false)}>DENY</button>
              <button style={s.allowBtn} onClick={handleAllow}>ALLOW</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApertureIcon({ size = 72 }) {
  const c = size / 2;
  const r = size * 0.44;
  const ir = r * 0.38;
  const blades = 6;
  const paths = Array.from({ length: blades }, (_, i) => {
    const a1 = ((i * 360) / blades) * (Math.PI / 180);
    const a2 = (((i + 1) * 360) / blades) * (Math.PI / 180);
    const offset = (30 * Math.PI) / 180;
    const x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
    const x2 = c + r * Math.cos(a2), y2 = c + r * Math.sin(a2);
    const x3 = c + ir * Math.cos(a2 + offset), y3 = c + ir * Math.sin(a2 + offset);
    const x4 = c + ir * Math.cos(a1 + offset), y4 = c + ir * Math.sin(a1 + offset);
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}Z`;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={c} cy={c} r={r} stroke="#1a1b1c" strokeWidth="1.5" />
      {paths.map((d, i) => <path key={i} d={d} fill="#1a1b1c" />)}
      <circle cx={c} cy={c} r={ir * 0.55} fill="#fcfcfc" />
    </svg>
  );
}

function GalleryIcon({ size = 72 }) {
  const c = size / 2;
  const r = size * 0.44;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={c} cy={c} r={r} stroke="#1a1b1c" strokeWidth="1.5" />
      <circle cx={c - r * 0.3} cy={c - r * 0.32} r={r * 0.22} stroke="#1a1b1c" strokeWidth="1.5" />
      <path d={`M${c - r * 0.88},${c + r * 0.5} L${c - r * 0.18},${c - r * 0.12} L${c + r * 0.22},${c + r * 0.22} L${c + r * 0.56},${c - r * 0.38} L${c + r * 0.88},${c + r * 0.5}Z`} fill="#1a1b1c" />
    </svg>
  );
}

function NavDiamond({ dir }) {
  return (
    <span style={{ display: "inline-block", width: 20, height: 20, border: "1.5px solid #1a1b1c", transform: "rotate(45deg)", position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", fontSize: 9, color: "#1a1b1c", lineHeight: 1 }}>
        {dir === "left" ? "←" : "→"}
      </span>
    </span>
  );
}

function NavDiamondLight({ dir }) {
  return (
    <span style={{ display: "inline-block", width: 20, height: 20, border: "1.5px solid #fcfcfc", transform: "rotate(45deg)", position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", fontSize: 9, color: "#fcfcfc", lineHeight: 1 }}>
        {dir === "left" ? "←" : "→"}
      </span>
    </span>
  );
}

// Preview screen styles (dark, matches camera slide 013)
const ps = {
  screen: { background: "#000", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Inter',sans-serif", color: "#fcfcfc", position: "relative" },
  header: { position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", padding: "0 28px", height: 48, zIndex: 10 },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc" },
  tag: { fontSize: 11, color: "rgba(252,252,252,0.5)", letterSpacing: "0.06em" },
  imgWrap: { flex: 1, position: "relative", minHeight: "100vh", overflow: "hidden" },
  img: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  tips: { position: "absolute", bottom: 56, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 },
  tipsLabel: { fontSize: 8, letterSpacing: "0.1em", color: "rgba(252,252,252,0.5)", textTransform: "uppercase" },
  tipsList: { display: "flex", gap: 24 },
  tip: { fontSize: 8, letterSpacing: "0.1em", color: "rgba(252,252,252,0.4)", textTransform: "uppercase" },
  nav: { position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", zIndex: 10 },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(252,252,252,0.6)", textTransform: "uppercase" },
  proceedBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc", textTransform: "uppercase" },
};

const s = {
  screen: { background: "#fcfcfc", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Inter',sans-serif", border: "1px solid #1a1b1c", position: "relative" },
  header: { display: "flex", alignItems: "center", padding: "0 28px", height: 52, borderBottom: "1px solid rgba(26,27,28,0.12)" },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c" },
  tag: { fontSize: 11, color: "rgba(26,27,28,0.5)", letterSpacing: "0.06em" },
  body: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" },
  startLabel: { position: "absolute", top: 20, left: 28, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  choices: { display: "flex", gap: 80, alignItems: "center", justifyContent: "center" },
  option: { cursor: "pointer" },
  diamond: { width: 190, height: 190, transform: "rotate(45deg)", border: "1px dashed rgba(26,27,28,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
  inner: { transform: "rotate(-45deg)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" },
  optionLabel: { fontSize: 8, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(26,27,28,0.6)", textTransform: "uppercase", lineHeight: 1.6 },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  overlay: { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#1a1b1c", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 260 },
  modalText: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "#fcfcfc", textTransform: "uppercase", textAlign: "center", lineHeight: 1.7 },
  modalBtns: { display: "flex", gap: 12, justifyContent: "center" },
  denyBtn: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(252,252,252,0.5)", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase" },
  allowBtn: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc", background: "none", border: "1px solid rgba(252,252,252,0.4)", cursor: "pointer", textTransform: "uppercase", padding: "6px 16px" },
};
