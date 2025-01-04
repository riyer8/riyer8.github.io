import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import About from './pages/about/About';
import Project from './pages/project/Project';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <Link to="/" className="header-link">Ramya Iyer</Link>
        </header>

        <nav className="navigation">
          <Link to="/about">ABOUT</Link>
          <Link to="/projects">PROJECTS</Link>
        </nav>

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

        <footer className="footer">
          <a href="https://github.com/riyer8" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <i className="fab fa-github"></i> {/* GitHub Icon */}
          </a>
          <a href="https://linkedin.com/in/ramya-i" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <i className="fab fa-linkedin"></i> {/* LinkedIn Icon */}
          </a>
          <a href="mailto:ramyaiyer@stanford.edu" className="footer-icon">
            <i className="fas fa-envelope"></i> {/* Email Icon */}
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;