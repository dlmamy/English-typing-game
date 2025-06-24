import React, { useEffect, useRef } from "react";

/**
 * @param {Object} props
 * @param {number} x 横坐标百分比（0-100）
 * @param {number} y 纵坐标像素
 * @param {function} onEnd 动画结束回调
 */
function Firework({ x = 50, y = 0, onEnd }) {
  const ref = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      onEnd && onEnd();
    }, 800);
    return () => clearTimeout(timer);
  }, [onEnd]);

  // 生成多条射线
  const lines = Array.from({ length: 10 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 10;
    const color = `hsl(${Math.floor(Math.random() * 360)},90%,60%)`;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          width: 4,
          height: 64,
          background: color,
          borderRadius: 4,
          transform: `rotate(${(angle * 180) / Math.PI}deg) translateY(-20px)`,
          opacity: 0.8,
          animation: "firework-line 0.7s ease-out forwards",
          animationDelay: `${i * 0.03}s`,
        }}
      />
    );
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: y,
        width: 24,
        height: 24,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {lines}
      <style>{`
        @keyframes firework-line {
          0% { opacity: 1; transform: scaleY(0.2) translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: scaleY(1) translateY(-128px); }
        }
      `}</style>
    </div>
  );
}

export default Firework; 