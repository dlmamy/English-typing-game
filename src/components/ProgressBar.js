import React from "react";

function ProgressBar({ current, total }) {
  const percent = (current / total) * 100;
  return (
    <div style={{ width: 300, margin: "20px auto" }}>
      <div style={{ height: 20, background: "#eee", borderRadius: 10 }}>
        <div style={{ width: percent + "%", height: 20, background: "#1976d2", borderRadius: 10 }} />
      </div>
      <div style={{ textAlign: "center", marginTop: 5 }}>{current} / {total}</div>
    </div>
  );
}

export default ProgressBar; 