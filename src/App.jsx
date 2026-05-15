import { Routes, Route } from "react-router-dom";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AnalyticsPage />} />
    </Routes>
  );
}
