import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import IntroducePage from "./pages/IntroducePage";
import LocationPage from "./pages/LocationPage";
import ImageChoicePage from "./pages/ImageChoicePage";
import CameraPage from "./pages/CameraPage";
import PreparingPage from "./pages/PreparingPage";
import AnalysisHubPage from "./pages/AnalysisHubPage";
import DemographicsPage from "./pages/DemographicsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/intro" element={<IntroducePage />} />
      <Route path="/location" element={<LocationPage />} />
      <Route path="/upload-choice" element={<ImageChoicePage />} />
      <Route path="/camera" element={<CameraPage />} />
      <Route path="/analysis/preparing" element={<PreparingPage />} />
      <Route path="/analysis" element={<AnalysisHubPage />} />
      <Route path="/analysis/demographics" element={<DemographicsPage />} />
      {/* Stub routes — redirect to demographics until those pages are built */}
      <Route path="/analysis/skin-type" element={<Navigate to="/analysis/demographics" replace />} />
      <Route path="/analysis/cosmetic" element={<Navigate to="/analysis/demographics" replace />} />
      <Route path="/analysis/weather" element={<Navigate to="/analysis/demographics" replace />} />
      {/* Catch-all: any unknown URL goes home instead of rendering nothing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
