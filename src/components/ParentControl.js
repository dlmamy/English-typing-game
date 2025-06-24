import React, { useState } from "react";

function ParentControl() {
  const [limit, setLimit] = useState(localStorage.getItem("timeLimit") || 20);

  const handleSave = () => {
    localStorage.setItem("timeLimit", limit);
    alert("设置成功！");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>家长管理</h2>
      <div>
        <label>每日游戏时长限制（分钟）：</label>
        <input
          type="number"
          value={limit}
          onChange={e => setLimit(e.target.value)}
          min={5}
          max={120}
        />
        <button onClick={handleSave}>保存</button>
      </div>
    </div>
  );
}

export default ParentControl; 