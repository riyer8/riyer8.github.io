import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <nav className="about-navigation">
          <a href="/">BACK TO HOME</a>
        </nav>
      </header>

      <main className="about-content">
        <h1>ABOUT</h1>
        <p className="about-intro">
          I’m Ramya Iyer, a software engineer and builder currently studying Math + AI at Stanford.
        </p>
        <img
          className="about-image"
          src="/src/assets/about/ramya-iyer.png"
          alt="Ramya Iyer"
        />

        <section className="experiences">
          <h2>EXPERIENCES</h2>

          <div className="experience-grid">
            <div className="experience-card">
              <div className="experience-year">2024</div>
              <img src="/src/assets/about/peak6-logo.jpeg" alt="PEAK6 Logo" />
              <h3>PEAK6</h3>
              <div className="experience-role">Quantitative Trading Intern</div>
              <p>Developed near-term options trading strategies.</p>
            </div>

            <div className="experience-card">
              <div className="experience-year">2023–</div>
              <img src="/src/assets/about/stanford-eng.png" alt="Stanford Logo" />
              <h3>Stanford University</h3>
              <div className="experience-role">Section Leader + Grader</div>
              <p>
                Leading sections for Stanford’s foundational Computer Science
                courses: Programming Methodology (CS 106A: Python), Programming
                Abstractions (CS 106B: C++), and Standard C++ Programming
                Laboratory (CS 106L).
              </p>
            </div>

            <div className="experience-card">
              <div className="experience-year">2023</div>
              <img src="/src/assets/about/square-logo.jpg" alt="Square Logo" />
              <h3>Square (BLOCK)</h3>
              <div className="experience-role">Software Engineering Intern</div>
              <p>Created a refunding system for the EU / UK payments.</p>
            </div>
            
            <div className="experience-card">
              <div className="experience-year">2022</div>
              <img src="/src/assets/about/bnl-logo.png" alt="Brookhaven Logo" />
              <h3>Brookhaven National Laboratory</h3>
              <div className="experience-role">Research Intern</div>
              <p>Developed quantum error correction code.</p>
            </div>
          </div>
        </section>

        
        <section className="education">
          <h2>EDUCATION</h2>

          <div className="education-list">
            <div className="education-item">
              <div className="education-details">
                <h3>M.S. in Computer Science at Stanford University</h3>
                <p>Concentration in Artificial Intelligence</p>
              </div>
              <p className="education-year">2025–2026</p>
            </div>
            <hr className="education-divider" />

            <div className="education-item">
              <div className="education-details">
                <h3>B.S. in Mathematics at Stanford University</h3>
                <p></p>
              </div>
              <p className="education-year">2022–2026</p>
            </div>

          </div>
        </section>

        <section className="education">
          <h2>AWARDS</h2>
          <div className="education-list">
            <div className="education-item">
              <div className="education-details">
                <h3>Options Trading @ UChicago Trading Contest</h3>
                <p></p>
              </div>
              <p className="education-year">2023</p>
            </div>

            <hr className="education-divider" />
            <div className="education-item">
              <div className="education-details">
                <h3>Jane Street AMC 12A Certificate of Excellence</h3>
                <p>One of the top-scoring young women on the AMC 12A exam.</p>
              </div>
              <p className="education-year">2021</p>
            </div>
            <hr className="education-divider" />
            
            <div className="education-item">
              <div className="education-details">
                <h3>American Invitational Mathematics Examination Invitee (x3)</h3>
                <p></p>
              </div>
              <p className="education-year"></p>
            </div>
            <hr className="education-divider" />

            <div className="education-item">
              <div className="education-details">
                <h3>Math Prize for Girls Invitee (x2)</h3>
                <p></p>
              </div>
              <p className="education-year"></p>
            </div>
            <hr className="education-divider" />

            <div className="education-item">
              <div className="education-details">
                <h3>USA Computing Olympiad Gold Division</h3>
                <p></p>
              </div>
              <p className="education-year"></p>
            </div>
            <hr className="education-divider" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;