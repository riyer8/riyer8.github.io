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
  "Move as if you’re underwater and everything around you is made of jelly.",
  "Deliver a passionate speech about why socks should rule the world.",
  "Pretend you’re a robot whose battery is running dangerously low.",
  "Greet everyone as if you’re an alien trying to blend in… badly.",
  "Walk as if you’re made of spaghetti trying not to fall apart.",
  "Act like a detective who just discovered a shocking clue that no one else can see.",
  "Narrate your own actions like a nature documentary voiceover.",
  "Pretend you’re late for the most important appointment of your life—but in slow motion.",
  "Act like a magician whose spell keeps misfiring.",
  "Walk around as if gravity changes directions every few seconds.",
  "Have a silent argument with a stubborn door that won’t open.",
  "Mime pulling an endless rope out of your pocket.",
  "Pretend you’re piloting a tiny helicopter with invisible controls.",
  "Speak like you’re on a cooking show but you’re explaining how to tie your shoes.",
  "Perform an interpretive dance about losing your keys.",
  "Pretend you're a superhero whose only power is dramatically overreacting.",
  "Explain something very simple as if it's the secret to the universe.",
  "Act as if you’re stuck inside an invisible box filled with balloons.",
  "Move as if you're made of magnets that repel everything you touch.",
  "Try to sell someone an imaginary invention that keeps malfunctioning.",
  "Walk like you’re sneaking past a sleeping dragon right behind you.",
  "Pretend you’re a DJ mixing sounds that only you can hear.",
  "Greet someone like you haven’t seen them in 20 years—even if you saw them 5 seconds ago.",
  "Act like a royal king/queen giving orders no one is following.",
  "Pretend you’re chasing something tiny and extremely fast.",
  "Give directions to an imaginary tourist who understands nothing.",
  "Walk like you’re being followed by a very suspicious squirrel.",
  "Pretend you just tasted the best food of your life—then the worst.",
  "Try to teach someone how to fly an invisible airplane.",
  "Move like everything around you is extremely fragile.",
  "Act like a wizard whose beard keeps getting in the way.",
  "React to an invisible puppy that is *way* too excited to see you.",
  "Pretend you're hosting a talent show and you're the only contestant.",
  "Walk around as if the lights are flickering and you turn on and off with them.",
  "Act like you’re stuck in slow-motion… but only from the waist down.",
  "Pretend you're trying to secretly smuggle a hummingbird in your pocket.",
  "Introduce yourself using only sounds—not words.",
  "Act like you're trying to remember something extremely important… but can't.",
  "Pretend you’re a time traveler seeing modern objects for the first time.",
  "Walk across the room as if the air suddenly turned to glue.",
  "Pretend you’re stuck to an invisible magnet pulling you in random directions.",
  "Act like a spy who’s terrible at being sneaky.",
  "Explain why an imaginary sandwich changed your life.",
  "Move as if your limbs belong to different animals.",
  "You’re a famous painter—but everything you draw disappears. React accordingly.",
  "Pretend the floor is extremely slippery and you're trying to stay upright.",
  "Act like you’re giving a guided tour of a museum where nothing exists.",
  "Pretend you're holding a suitcase full of bees and can't let anyone know.",
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
