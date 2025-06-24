import React, { useEffect, useRef, useState } from "react";

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * props: word, onSuccess, onFail, onType(type, y, isWordComplete), paused
 */
function FallingLetter({ word, onSuccess, onFail, onType, interval = 60, paused = false }) {
  const [index, setIndex] = useState(0);
  const [y, setY] = useState(0);
  const [color, setColor] = useState(getRandomColor());
  const intervalRef = useRef();

  // 重置字母位置到顶部
  const resetPosition = () => {
    setY(0);
    setColor(getRandomColor());
  };

  // 控制下落动画
  useEffect(() => {
    setIndex(0);
    resetPosition();
  }, [word]);

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setY((prev) => prev + 3);
    }, interval);
    return () => clearInterval(intervalRef.current);
  }, [interval, paused, word]);

  useEffect(() => {
    if (y > 300) {
      onFail();
      clearInterval(intervalRef.current);
      onType && onType('fail', y, true);
    }
  }, [y, onFail, onType]);

  // 键盘事件只在未暂停时响应
  useEffect(() => {
    if (paused) return;
    const handleKeyDown = (e) => {
      const currentChar = word[index];
      // 支持空格键输入
      const isMatch = (currentChar === ' ' && e.key === ' ') ||
        (currentChar && currentChar.toLowerCase() === e.key.toLowerCase());
      if (isMatch) {
        const isLastLetter = index === word.length - 1;
        if (isLastLetter) {
          onSuccess();
          clearInterval(intervalRef.current);
          onType && onType('success', y, true);
        } else {
          setIndex(index + 1);
          resetPosition(); // 重置下一个字母到顶部
          onType && onType('success', y, false);
        }
      } else if (/^[a-zA-Z ]$/.test(e.key)) {
        // 只对字母和空格按键触发 fail
        onType && onType('fail', y, false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, word, onSuccess, y, onType, paused]);

  return (
    <div style={{ position: "relative", height: 400, marginTop: 30 }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: y,
          fontSize: 64,
          color: color,
          fontWeight: 'bold',
          textShadow: '2px 2px 8px #00000033',
        }}
      >
        {word[index]}
      </div>
      <div style={{ height: 320 }} />
    </div>
  );
}

export default FallingLetter; 