import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VotingPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/polls/${id}`, { withCredentials: true });
        if (res.data.status) {
          const rows = res.data.result;
          if (rows.length === 0) {
            setError("Poll not found.");
            return;
          }
          setPoll({
            id: rows[0].id,
            question: rows[0].name,
            options: rows.map((r) => ({ id: r.poll_id, name: r.poll_name })),
          });
        } else {
          setError(res.data.message);
        }
      } catch {
        setError("Failed to fetch poll. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async (pollId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/polls/vote",
        { poll_id: pollId, question_id: id },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      // Navigate immediately to results
      navigate(`/polls/result/${id}`);
    } catch {
      setMessage("Failed to submit vote.");
    }
  };

  if (loading) return <p>Loading poll...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!poll) return <p>Poll not found.</p>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/dashboard")}>
        Back
      </button>
      <h2>{poll.question}</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <ul className="list-group mt-3">
        {poll.options.map((opt) => (
          <li
            key={opt.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {opt.name}
            <button className="btn btn-primary btn-sm" onClick={() => handleVote(opt.id)}>
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
