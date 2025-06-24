import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>儿童英语打字游戏</h1>
      <button onClick={() => navigate("/game")}>开始游戏</button>
      <br /><br />
      <button onClick={() => navigate("/progress")}>学习进度</button>
      <br /><br />
      <button onClick={() => navigate("/parent")}>家长管理</button>
    </div>
  );
}

export default HomePage; 