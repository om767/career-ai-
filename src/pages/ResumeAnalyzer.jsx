import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Helper Components ---
// Loading animation
const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "100%" }}
  >
    <Spinner
      animation="border"
      role="status"
      variant="primary"
      style={{ width: "3rem", height: "3rem" }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

// Simple Markdown Renderer
const SimpleMarkdownRenderer = ({ text }) => {
  return (
    <div className="text-start text-secondary">
      {text.split("\n").map((line, index) => {
        if (line.startsWith("### ")) {
          return (
            <h5 key={index} className="fw-bold text-dark mt-3 mb-2">
              {line.substring(4)}
            </h5>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h4 key={index} className="fw-bold text-dark mt-3 mb-2">
              {line.substring(3)}
            </h4>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h3 key={index} className="fw-bold text-dark mt-3 mb-2">
              {line.substring(2)}
            </h3>
          );
        }
        if (line.match(/^\s*-\s/)) {
          return (
            <li key={index} className="ms-3">
              {line.replace(/^\s*-\s/, "")}
            </li>
          );
        }
        if (line.match(/^\s*\*\s/)) {
          return (
            <li key={index} className="ms-3">
              {line.replace(/^\s*\*\s/, "")}
            </li>
          );
        }
        if (line.trim() === "") {
          return <br key={index} />;
        }
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
};

// --- Mock Data (For context) ---
const characterProfiles = {
  Explorer: { name: "The Explorer" },
  Captain: { name: "The Captain" },
  Connector: { name: "The Connector" },
  Challenger: { name: "The Challenger" },
  DeepDiver: { name: "The Deep Diver" },
};

// --- Resume Review Component ---
export default function ResumeReviewPage({ studentProfile }) {
  const [resumeText, setResumeText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Initialize Gemini AI client
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleReviewRequest = async () => {
    if (!resumeText) {
      setError("Please paste your resume text into the box.");
      return;
    }
    setIsGenerating(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch("http://localhost:8000/api/resume/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: resumeText,
          collegeTier: studentProfile?.collegeTier || "Tier 2/3",
          characterProfileKey: studentProfile?.characterProfileKey || "Not specified",
          skills: studentProfile?.skills || [],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.feedback) {
        setFeedback(data.feedback);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Could not get feedback. Please try again.");
      }
    } catch (err) {
      console.error("API error:", err);
      setError(
        "An error occurred while generating feedback. Please check your internet connection and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-3">AI Resume Review</h1>
      <p className="text-muted mb-4">
        Paste your resume below and get instant, actionable feedback to improve
        it.
      </p>
      <div className="row g-4">
        {/* Resume Input Area */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <textarea
                className="form-control mb-3"
                rows="15"
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              {error && <p className="text-danger small">{error}</p>}
              <button
                onClick={handleReviewRequest}
                disabled={isGenerating}
                className="btn btn-primary w-100 fw-bold"
              >
                {isGenerating ? "Analyzing..." : "✨ Get AI Feedback"}
              </button>
            </div>
          </div>
        </div>

        {/* AI Feedback Display Area */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">Feedback</h4>
              {isGenerating && <LoadingSpinner />}
              {feedback ? (
                <SimpleMarkdownRenderer text={feedback} />
              ) : (
                !isGenerating && (
                  <p className="text-muted">Your feedback will appear here.</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
