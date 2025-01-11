import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import MonitoringPage from "./MonitoringPage";
import LandingPage from "./LandingPage";
import FloatCard from "./FloatCard";

const App = () => {
  const [isCardOpen, setIsCardOpen] = React.useState(true);
  const [serverInfo, setServerInfo] = React.useState({});

  const toggleCard = () => setIsCardOpen((prevState) => !prevState);

  React.useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await fetch("https://fivem-307751878933.asia-southeast1.run.app/serverdetail");
        const data = await response.json();
        setServerInfo(data);
      } catch (error) {
        console.error("Error fetching server data:", error);
      }
    };

    fetchServerData();
  }, []);

  return (
    <Router>
      <div className="relative">
        <FloatCard isCardOpen={isCardOpen} toggleCard={toggleCard} serverInfo={serverInfo} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/list-player" element={<MonitoringPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
