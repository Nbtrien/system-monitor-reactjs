import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import WebsocketComponent from "./component/WebsocketComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ws" element={<WebsocketComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
