import React from "react";

function WordCard({ word, image }) {
  return (
    <div style={{ margin: 20 }}>
      <img src={image} alt={word} style={{ width: 120, height: 120, objectFit: "cover" }} />
      <h3>{word}</h3>
    </div>
  );
}

export default WordCard; 