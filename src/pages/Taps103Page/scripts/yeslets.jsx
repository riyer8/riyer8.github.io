import React, { useState } from "react";

const prompts = [
  "Pretend you are walking on the moon while holding a cup of coffee.",
  "Do your best animal impression without making a sound.",
  "Swap roles with someone next to you and mirror their first move.",
  "Walk around the room as if the floor is lava.",
  "Act out a scene where two invisible people are arguing about dessert.",
  "Pretend your shoes are on fire—what do you do?",
  "Start a conversation with someone using only movie quotes.",
  "Give a dramatic reading of a grocery list.",
];

export default function YesLets() {
  const [prompt, setPrompt] = useState(null);

  const handleNewPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[randomIndex]);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
      <h2 style={{ marginTop: 0 }}>Yes, Let’s! Prompts</h2>
      <button
        onClick={handleNewPrompt}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 8,
          border: "none",
          background: "#ffcc00",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Generate Prompt
      </button>
      {prompt && (
        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          {prompt}
        </p>
      )}
      {!prompt && <p style={{ marginTop: "1rem"}}>Click the button to get a random prompt!</p>}
    </div>
  );
}
