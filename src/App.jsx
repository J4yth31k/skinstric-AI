import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ImageUploadPage from "./pages/ImageUploadPage";
import DemographicsPage from "./pages/DemographicsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/upload" element={<ImageUploadPage />} />
      <Route path="/demographics" element={<DemographicsPage />} />
    </Routes>
  );
}
