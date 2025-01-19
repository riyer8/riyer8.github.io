import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import About from './pages/about/About';
import Project from './pages/project/Project';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close dropdown if window resizes to larger screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <div className="container">
        <header className="header">
          <Link to="/" className="header-link">Ramya Iyer</Link>
          <nav className="nav-menu">
            <Link to="/about">ABOUT</Link>
            <Link to="/projects">PROJECTS</Link>
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </header>

        {/* Dropdown menu for small screens */}
        {menuOpen && (
          <div className="dropdown-menu">
            <button className="close-menu" onClick={() => setMenuOpen(false)}>✖</button>
            <div className="dropdown-links">
              <Link to="/about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
              <Link to="/projects" onClick={() => setMenuOpen(false)}>PROJECTS</Link>
            </div>
            <div className="dropdown-footer">
              <a href="https://github.com/riyer8" target="_blank" rel="noopener noreferrer" className="footer-icon">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/in/ramya-i" target="_blank" rel="noopener noreferrer" className="footer-icon">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="mailto:ramyaiyer@stanford.edu" className="footer-icon">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <main className="content">
                <h1>Hi, I’m Ramya.</h1>
                <p>
                  I’m a software engineer and builder studying Math + CS at Stanford University.
                </p>
                <p className="email">
                  Feel free to email me at <a href="mailto:ramyaiyer@stanford.edu">ramyaiyer@stanford.edu</a>.
                </p>
              </main>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Project />} />
        </Routes>

        {/* Footer for larger screens */}
        <footer className="footer">
          <a href="https://github.com/riyer8" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://linkedin.com/in/ramya-i" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="mailto:ramyaiyer@stanford.edu" className="footer-icon">
            <i className="fas fa-envelope"></i>
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;