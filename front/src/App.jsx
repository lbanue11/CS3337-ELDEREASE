import { useState } from "react";
import "./App.css";
import Login from "./Login";
import Registration from "./Registration";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom"; // we using routers to switch pages
import LogoSymbol from "./assets/LogoSymbol.png";
import MapComponent from "./MapComponent.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Default Page for now */}
        <Route 
          path="/"
          element={
            <div>
              <img className="logo" src={LogoSymbol} alr="Logo" />
              <h1 className="app-text-style">Welcome to ElderEase</h1>
              <Link to="/login">Go to Login</Link>
              <br />
            </div>
          }
        />

        {/* Login router */}
        <Route path="/login" element={<Login />} />

        {/* Reigistration */}
        <Route path="/register" element={<Registration />} />

          {/* Map */}
          <Route path="/map" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
