import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PHASE_ONE_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";
const PHASE_TWO_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

const STRING_ONLY = /^[A-Za-z\s\-',.]+$/;

function validateAll({ name, location, race, age }) {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  } else if (!STRING_ONLY.test(name.trim())) {
    errors.name = "Name must contain letters only — no numbers or special characters.";
  }

  if (!location.trim()) {
    errors.location = "Location is required.";
  } else if (!STRING_ONLY.test(location.trim())) {
    errors.location = "Location must contain letters only — no numbers or special characters.";
  }

  if (!race.trim()) {
    errors.race = "Race is required.";
  } else if (!STRING_ONLY.test(race.trim())) {
    errors.race = "Race must contain letters only — no numbers or special characters.";
  }

  const ageNum = Number(age);
  if (age === "" || age === null) {
    errors.age = "Age is required.";
  } else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
    errors.age = "Age must be a whole number between 1 and 120.";
  }

  return errors;
}

export default function AnalyticsPage() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    () => localStorage.getItem("skinstric_name") || "Javonte Platt"
  );
  const [location, setLocation] = useState(
    () => localStorage.getItem("skinstric_location") || "Nashville, Tennessee"
  );
  const [race, setRace] = useState(
    () => localStorage.getItem("skinstric_race") || ""
  );
  const [age, setAge] = useState(
    () => localStorage.getItem("skinstric_age") || ""
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleProceed = async () => {
    const validationErrors = validateAll({ name, location, race, age });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setApiError("");
    try {
      const [res1, res2] = await Promise.all([
        fetch(PHASE_ONE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), location: location.trim() }),
        }),
        fetch(PHASE_TWO_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ race: race.trim(), age: Number(age) }),
        }),
      ]);

      if (!res1.ok) throw new Error(`Phase One error: ${res1.status}`);
      if (!res2.ok) throw new Error(`Phase Two error: ${res2.status}`);

      localStorage.setItem("skinstric_name", name.trim());
      localStorage.setItem("skinstric_location", location.trim());
      localStorage.setItem("skinstric_race", race.trim());
      localStorage.setItem("skinstric_age", age);

      navigate("/upload");
    } catch (err) {
      setApiError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div style={styles.screen}>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.brand}>SKINSTRIC</span>
          <span style={styles.sectionTag}>[ ANALYTICS ]</span>
        </div>
        <button style={styles.enterBtn}>ENTER CODE</button>
      </header>

      {/* Body */}
      <main style={styles.body}>
        <p style={styles.pageTitle}>A.I. Analysis</p>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Analyses</p>
            <p style={styles.statValue}>0</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: "1px solid #1a1b1c", borderRight: "1px solid #1a1b1c" }}>
            <p style={styles.statLabel}>API Calls</p>
            <p style={styles.statValue}>0</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Last Active</p>
            <p style={{ ...styles.statValue, fontSize: 20, paddingTop: 14 }}>—</p>
          </div>
        </div>

        {/* Phase One — Name & Location */}
        <div style={styles.formSection}>
          <p style={styles.formSectionTitle}>PHASE ONE — PERSONAL INFO</p>
          <div style={styles.divider} />

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>NAME</label>
            <input
              style={{ ...styles.fieldInput, borderColor: errors.name ? "#c0392b" : "#1a1b1c" }}
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => handleChange("name", e.target.value, setName)}
            />
            {errors.name && <p style={styles.errorMsg}>{errors.name}</p>}
          </div>

          <div style={styles.divider} />

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>LOCATION</label>
            <input
              style={{ ...styles.fieldInput, borderColor: errors.location ? "#c0392b" : "#1a1b1c" }}
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => handleChange("location", e.target.value, setLocation)}
            />
            {errors.location && <p style={styles.errorMsg}>{errors.location}</p>}
          </div>
        </div>

        {/* Phase Two — Race & Age */}
        <div style={styles.formSection}>
          <p style={styles.formSectionTitle}>PHASE TWO — DEMOGRAPHICS</p>
          <div style={styles.divider} />

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>RACE</label>
            <input
              style={{ ...styles.fieldInput, borderColor: errors.race ? "#c0392b" : "#1a1b1c" }}
              type="text"
              placeholder="Enter your race"
              value={race}
              onChange={(e) => handleChange("race", e.target.value, setRace)}
            />
            {errors.race && <p style={styles.errorMsg}>{errors.race}</p>}
          </div>

          <div style={styles.divider} />

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>AGE</label>
            <input
              style={{ ...styles.fieldInput, borderColor: errors.age ? "#c0392b" : "#1a1b1c" }}
              type="number"
              placeholder="Enter your age"
              min={1}
              max={120}
              value={age}
              onChange={(e) => handleChange("age", e.target.value, setAge)}
            />
            {errors.age && <p style={styles.errorMsg}>{errors.age}</p>}
          </div>

          {apiError && <p style={{ ...styles.errorMsg, marginTop: 8 }}>{apiError}</p>}
        </div>

        {/* Navigation */}
        <div style={styles.navRow}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <span>←</span>
            <span>BACK</span>
          </button>
          <button
            style={{ ...styles.proceedBtn, opacity: loading ? 0.6 : 1 }}
            onClick={handleProceed}
            disabled={loading}
          >
            <span>{loading ? "SUBMITTING..." : "PROCEED"}</span>
            <span>→</span>
          </button>
        </div>
      </main>
    </div>
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
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: 64,
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
    display: "flex", flexDirection: "column", gap: 40,
  },
  pageTitle: {
    fontSize: 13, fontWeight: 500, color: "#1a1b1c",
    letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5,
  },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    border: "1px solid #1a1b1c",
  },
  statCard: { background: "#fcfcfc", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 8 },
  statLabel: { fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(26,27,28,0.45)" },
  statValue: { fontFamily: "monospace", fontSize: 48, fontWeight: 300, color: "#1a1b1c", lineHeight: 1 },
  formSection: { display: "flex", flexDirection: "column", gap: 16 },
  formSectionTitle: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(26,27,28,0.45)" },
  divider: { border: "none", borderTop: "1px solid rgba(26,27,28,0.15)", margin: "4px 0" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(26,27,28,0.45)" },
  fieldInput: {
    height: 52, border: "1px solid",
    background: "#fcfcfc", padding: "0 20px",
    fontSize: 13, fontWeight: 500, color: "#1a1b1c",
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  errorMsg: {
    fontSize: 11, color: "#c0392b", fontWeight: 500,
    letterSpacing: "0.04em", margin: 0,
  },
  navRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: "auto",
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
