import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Optional: trim all options and filter empty ones
    const trimmedOptions = options.map(o => o.trim()).filter(o => o !== "");

    if (!question.trim() || trimmedOptions.length < 2) {
      setError("Question and at least 2 options are required.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/polls/create_poll",
        { question: question.trim(), poll: trimmedOptions },
        { withCredentials: true }
      );

      if (res.data.status) {
        setSuccess(res.data.message);

        // Reset form
        setQuestion("");
        setOptions(["", ""]);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-3">Create a New Poll</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Your Question: <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              rows="3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
            />
          </div>

          <label className="form-label">
            Options: <span className="text-danger">*</span>
          </label>
          {options.map((opt, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {options.length < 4 && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm mb-3"
              onClick={addOption}
            >
              Add Option
            </button>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <Link to="/dashboard" className="btn btn-secondary">
              Back to Home
            </Link>
            <button type="submit" className="btn btn-success">
              Submit Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
