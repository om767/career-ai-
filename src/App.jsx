import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResumePage from "./pages/ResumePage";
import MockInterview from "./pages/MockInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import ChatBot from "./pages/ChatBot";
import JobMarketPage from "./pages/JobMarketPage";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";  // ✅ fixed
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div
          style={{
            flex: "1 1 auto",
            margin: "0 1rem 1rem 1rem",
            padding: "0 1rem",
            paddingTop: "var(--header-height, 72px)",
          }}
        >
          <Routes>
            <Route path="/" element={token ? <Home /> : <LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={token ? <Home /> : <LoginPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume-builder" element={token ? <ResumePage /> : <LoginPage />} />
            <Route path="/mock-interview" element={token ? <MockInterview /> : <LoginPage />} />
            <Route path="/career-roadmap" element={token ? <CareerRoadmap /> : <LoginPage />} />
            <Route path="/job-market" element={token ? <JobMarketPage /> : <LoginPage />} />
            <Route path="/resume-analyze" element={token ? <ResumeAnalyzer /> : <LoginPage />} />
            <Route path="/chatbot" element={token ? <ChatBot /> : <LoginPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
