import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import React Router
import './App.css';
import About from './pages/about/About';
//import Projects from './pages/projects/Project';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <Link to="/" className="header-link">RAMYA IYER</Link>
        </header>
        <nav className="navigation">
          <Link to="/about">ABOUT</Link>
         
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <main className="content">
                <h1>hi, i’m ramya.</h1>
                <p>
                  i’m a 21 y/o software engineer and builder studying math + cs at Stanford University.
                  i’m studying how to solve complex problems to drive innovative products.
                </p>
                <p className="email">
                  feel free to email me at <a href="mailto:ramyaiyer@stanford.edu">ramyaiyer@stanford.edu.</a>
                </p>
              </main>
            }
          />
          <Route path="/about" element={<About />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;