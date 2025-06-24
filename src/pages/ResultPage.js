import React from "react";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>游戏结束！</h2>
      <button onClick={() => navigate("/")}>返回首页</button>
    </div>
  );
}

export default ResultPage; 