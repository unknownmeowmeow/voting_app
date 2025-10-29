import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Dashboard from "./components/employee/Dashboard.jsx";
import NotFound from "./components/NotFound.jsx";
import Footers from "./components/partial/Footer.jsx";
import Logout from "./components/auth/Login.jsx";
import Voting from "./components/employee/VotingPoll.jsx";
import Result from "./components/employee/PollResult.jsx";
import CreatePoll from "./components/employee/CreatePoll.jsx";

function App() {
  const main_content_style = { padding: "20px", minHeight: "80vh" };

  return (

    <Router>

      <div style={main_content_style}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new" element={<CreatePoll />} />
          <Route path="/polls/result/:id" element={<Result />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/voting/:id" element={<Voting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <Footers />
      
    </Router>
    
  );
}

export default App;
