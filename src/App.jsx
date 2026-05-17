import { Routes, Route } from "react-router-dom";
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
      <Route path="/preparing" element={<PreparingPage />} />
      <Route path="/analysis" element={<AnalysisHubPage />} />
      <Route path="/analysis/demographics" element={<DemographicsPage />} />
    </Routes>
  );
}
