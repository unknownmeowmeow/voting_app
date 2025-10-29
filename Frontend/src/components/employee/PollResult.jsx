import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Chart.js
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/polls/result/${id}`,
          { withCredentials: true }
        );

        if (res.data.status) {
          const data = res.data.result;
          if (data.length === 0) {
            setError("No poll results found.");
            return;
          }

          const question = data[0].question;
          const options = data.map((item) => ({
            id: item.poll_id,
            name: item.poll_name,
            votes: item.votes,
          }));

          setPoll({ question, options });
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError("Failed to fetch poll results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!poll) return <p>No results found.</p>;

  // Pie chart data
  const pieData = {
    labels: poll.options.map((opt) => opt.name),
    datasets: [
      {
        data: poll.options.map((opt) => opt.votes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8BC34A",
          "#FF9800",
          "#9C27B0",
          "#00BCD4",
        ],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>
      <h2>{poll.question}</h2>

      {/* Pie Chart */}
      <div className="my-4" style={{ maxWidth: "500px" }}>
        <Pie data={pieData} />
      </div>

      {/* Vote counts */}
      <ul className="list-group mt-3">
        {poll.options.map((opt) => (
          <li
            key={opt.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {opt.name}
            <span className="badge bg-primary rounded-pill">{opt.votes} votes</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
