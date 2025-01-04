import React from 'react';
import './Project.css';

function Project() {
  const projects = [
    {
      title: "StockVol: Predicting Volatility with News Market Data",
      role: "Researcher | CS 229",
      description: "",
      image: "/src/assets/projects/cs229_pipeline.png",
      links: [
        { label: "VIEW GITHUB", url: "https://github.com/riyer8/cs229-project" },
      ],
    },
    /*{
      title: "Trading Data and Strategies",
      role: "Developer",
      description: "add a description here",
      image: "/src/assets/projects/cs229_pipeline.png",
      links: [
        { label: "VIEW GITHUB", url: "https://github.com/riyer8/trading_data" },
      ],
    },*/
    {
      title: "Hivemind: An Architecture to Amalgamate Fine-Tuned LLMs",
      role: "Researcher | CS 224N",
      description: "",
      image: "/src/assets/projects/cs224n_pipeline.png",
      links: [
        { label: "VIEW RESEARCH PAPER", url: "https://web.stanford.edu/class/cs224n/final-reports/256976188.pdf" },
        { label: "VIEW GITHUB", url: "https://github.com/MatthewMattei/cs224n-hivemind" },
      ],
    },
    {
      title: "GenVN: Generative Visual Novel",
      role: "Backend Engineer",
      description: "",
      image: "/src/assets/projects/genvn.png",
      links: [
        { label: "VIEW DEVPOST", url: "https://devpost.com/software/generative-visual-novel" },
        { label: "VIEW GITHUB", url: "https://github.com/riyer8/GenVN" },
      ],
    },
    {
      title: "Decoding Surface Codes with Deep RL and Probabilistic Policy Reuse",
      role: "Research",
      description: "",
      image: "/src/assets/projects/bnl.png",
      links: [
        { label: "VIEW RESEARCH PAPER", url: "https://arxiv.org/abs/2212.11890" },
      ],
    },
  ];

  return (
    <div className="projects-container">
      <h1>PROJECTS</h1>
      <p>Here are a selection of the projects that I’ve developed.</p>
      <div className="projects">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
            <div className="project-content">
              <h2>{project.title}</h2>
              <p className="role">{project.role}</p>
              <p className="description">{project.description}</p>
              <div className="project-links">
                {project.links.map((link, idx) => (
                  <a key={idx} href={link.url} className="project-link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Project;
