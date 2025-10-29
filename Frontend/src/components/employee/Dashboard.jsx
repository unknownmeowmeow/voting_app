import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "bootstrap/dist/css/bootstrap.min.css";

// Chart.js
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

dayjs.extend(relativeTime);

export default function Dashboard() {
  const [topPolls, setTopPolls] = useState([]);
  const [recentPolls, setRecentPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      navigate("/", { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  };

  const groupPollsByQuestion = (polls) => {
    const map = {};
    polls.forEach((row) => {
      if (!map[row.question_id]) {
        map[row.question_id] = {
          id: row.question_id,
          question: row.question_name || row.question,
          created_at: row.created_at,
          options: [],
          totalVotes: 0,
        };
      }
      if (row.poll_id) {
        map[row.question_id].options.push({
          id: row.poll_id,
          name: row.poll_name || row.name,
          votes: row.votes || 0,
        });
        map[row.question_id].totalVotes += row.votes || 0;
      }
    });
    return Object.values(map);
  };

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const topRes = await axios.get("http://localhost:5000/api/polls/top_list", { withCredentials: true });
        if (topRes.data.status) {
          const grouped = groupPollsByQuestion(topRes.data.result)
            .sort((a, b) => b.totalVotes - a.totalVotes)
            .slice(0, 3);
          setTopPolls(grouped);
        }

        const recentRes = await axios.get("http://localhost:5000/api/polls/getnewlist", { withCredentials: true });
        if (recentRes.data.status) {
          const grouped = groupPollsByQuestion(recentRes.data.result)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setRecentPolls(grouped);
        }
      } catch {
        setError("Error fetching polls. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const renderPollOptionsWithChart = (poll) => {
    if (!poll.options || poll.options.length === 0) return <p>No options yet.</p>;

    const pieData = {
      labels: poll.options.map((opt) => opt.name),
      datasets: [
        {
          data: poll.options.map((opt) => opt.votes),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800", "#9C27B0", "#00BCD4",
          ],
          hoverOffset: 10,
        },
      ],
    };

    return (
      <div>
        <ul className="mt-2 mb-2">
          {poll.options.map((opt) => (
            <li key={opt.id}>
              {opt.name}: {opt.votes} vote{opt.votes !== 1 ? "s" : ""}
            </li>
          ))}
        </ul>

        <div style={{ maxWidth: "300px", marginBottom: "1rem" }}>
          <Pie data={pieData} />
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Voting Dojo</h1>
        <div>
          <Link to="/new" className="btn btn-primary me-2">Create your own Poll</Link>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {loading ? (
        <p>Loading polls...</p>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <div className="row">
          <div className="col-md-6 mb-4">
            <h3 className="mb-3">Top 3 Polls</h3>
            {topPolls.length === 0 ? <p>No polls available.</p> :
              topPolls.map((poll) => (
                <div key={poll.id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    {/* <-- CHANGE HERE: Top polls go to result/:id --> */}
                    <Link to={`/result/${poll.id}`} className="h5 text-decoration-none">
                      {poll.question}
                    </Link>
                    {renderPollOptionsWithChart(poll)}
                    <small className="text-muted">{dayjs(poll.created_at).fromNow()}</small>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="col-md-6 mb-4">
            <h3 className="mb-3">Recent Polls</h3>
            {recentPolls.length === 0 ? <p>No polls yet.</p> :
              recentPolls.map((poll) => (
                <div key={poll.id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <Link to={`/voting/${poll.id}`} className="h6 text-decoration-none">
                      {poll.question}
                    </Link>
                    {renderPollOptionsWithChart(poll)}
                    <small className="text-muted">{dayjs(poll.created_at).fromNow()}</small>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
