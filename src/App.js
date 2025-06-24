import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";
import ProgressPage from "./pages/ProgressPage";
import ParentPage from "./pages/ParentPage";
import Firework from "./components/Firework";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/parent" element={<ParentPage />} />
      </Routes>
    </Router>
  );
}

export default App; 