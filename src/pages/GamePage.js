import React, { useState, useEffect } from "react";
import { wordList } from "../utils/wordList";
import { sentenceList } from "../utils/sentenceList";
import { speak } from "../utils/audio";
import WordCard from "../components/WordCard";
import FallingLetter from "../components/FallingLetter";
import Firework from "../components/Firework";

// 游戏配置
const GAME_CONFIG = {
  TOTAL_LEVELS: 10,           // 总关卡数
  WORDS_PER_LEVEL: 10,       // 每关单词数
  MIN_INTERVAL: 30,          // 最快速度 (ms)
  MAX_INTERVAL: 100,         // 最慢速度 (ms)
};
const LETTERS = [
  ...'abcdefghijklmnopqrstuvwxyz',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
];

function getRandomWords(list, count) {
  let result = [];
  while (result.length < count) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    for (let i = 0; i < shuffled.length && result.length < count; i++) {
      result.push(shuffled[i]);
    }
  }
  return result;
}

function getRandomLetters(count) {
  let result = [];
  while (result.length < count) {
    const shuffled = [...LETTERS].sort(() => 0.5 - Math.random());
    for (let i = 0; i < shuffled.length && result.length < count; i++) {
      result.push({ word: shuffled[i], image: '', isLetter: true });
    }
  }
  return result;
}

// 生成加减法题目
function getRandomMathProblems(range, count) {
  const problems = [];
  while (problems.length < count) {
    const isAdd = Math.random() < 0.5;
    let a, b, answer, text;
    if (isAdd) {
      a = Math.floor(Math.random() * (range + 1));
      b = Math.floor(Math.random() * (range + 1 - a));
      answer = a + b;
      text = `${a} + ${b} =`;
    } else {
      a = Math.floor(Math.random() * (range + 1));
      b = Math.floor(Math.random() * (a + 1));
      answer = a - b;
      text = `${a} - ${b} =`;
    }
    problems.push({ word: text, answer: answer.toString(), image: '', isMath: true });
  }
  return problems;
}

function GamePage() {
  // 新增：模式 state
  const [mode, setMode] = useState('word'); // 'letter' | 'word' | 'sentence' | 'math10' | 'math20' | 'math100'

  // 当前关卡 (0-9)
  const [level, setLevel] = useState(0);
  // 当前关卡中的第几个单词/字母 (0-9)
  const [wordIndex, setWordIndex] = useState(0);
  // 当前关卡的单词/字母列表
  const [levelWords, setLevelWords] = useState(() => 
    getRandomWords(wordList, GAME_CONFIG.WORDS_PER_LEVEL)
  );
  const [score, setScore] = useState(0);
  const [firework, setFirework] = useState(null);
  // 是否显示关卡过渡
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  // 暂停状态
  const [paused, setPaused] = useState(false);
  // 计时器（单位：秒，保留1位小数）
  const [timer, setTimer] = useState(0);
  const timerRef = React.useRef();
  // 新增：是否已开始
  const [started, setStarted] = useState(false);
  // 答题输入相关
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0); // 当前题已答次数

  // 计时器逻辑
  useEffect(() => {
    if (!started || paused) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer(t => +(t + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [paused, level, started]);

  // 每关开始时重置计时器
  useEffect(() => {
    setTimer(0);
  }, [level]);

  // 关卡变化时，重新生成单词/字母/题目列表
  useEffect(() => {
    if (mode === 'word') {
      setLevelWords(getRandomWords(wordList, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'letter') {
      setLevelWords(getRandomLetters(GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'sentence') {
      setLevelWords(getRandomWords(sentenceList, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'math10') {
      setLevelWords(getRandomMathProblems(10, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'math20') {
      setLevelWords(getRandomMathProblems(20, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'math100') {
      setLevelWords(getRandomMathProblems(100, GAME_CONFIG.WORDS_PER_LEVEL));
    }
    setWordIndex(0);
    setShowLevelTransition(false);
    setUserInput('');
    setAttempts(0);
  }, [level, mode]);

  // 切换模式时重置所有状态
  useEffect(() => {
    setLevel(0);
    setScore(0);
    setPaused(false);
    setShowLevelTransition(false);
    setTimer(0);
    setStarted(false);
    if (mode === 'word') {
      setLevelWords(getRandomWords(wordList, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'letter') {
      setLevelWords(getRandomLetters(GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'sentence') {
      setLevelWords(getRandomWords(sentenceList, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'math10') {
      setLevelWords(getRandomMathProblems(10, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'math20') {
      setLevelWords(getRandomMathProblems(20, GAME_CONFIG.WORDS_PER_LEVEL));
    } else if (mode === 'math100') {
      setLevelWords(getRandomMathProblems(100, GAME_CONFIG.WORDS_PER_LEVEL));
    }
    setWordIndex(0);
    setUserInput('');
    setAttempts(0);
  }, [mode]);

  // 关卡完成时停止计时器
  useEffect(() => {
    if (showLevelTransition) {
      clearInterval(timerRef.current);
    }
    if (showLevelTransition === 'complete') {
      setStarted(false);
    }
  }, [showLevelTransition]);

  // 计算当前关卡的掉落速度
  const interval = GAME_CONFIG.MAX_INTERVAL - 
    ((GAME_CONFIG.MAX_INTERVAL - GAME_CONFIG.MIN_INTERVAL) * level / (GAME_CONFIG.TOTAL_LEVELS - 1));

  // 处理单词/字母完成
  const handleWordComplete = (success) => {
    if (success) {
      setScore(score + 10);
    }
    
    if (wordIndex + 1 >= GAME_CONFIG.WORDS_PER_LEVEL) {
      // 关卡完成
      if (level + 1 >= GAME_CONFIG.TOTAL_LEVELS) {
        // 游戏通关
        setShowLevelTransition('complete');
      } else {
        // 显示关卡过渡
        setShowLevelTransition('next');
        // 延迟进入下一关
        setTimeout(() => {
          setLevel(level + 1);
        }, 2000);
      }
    } else {
      // 继续下一个
      setWordIndex(wordIndex + 1);
    }
  };

  // 处理敲击动画
  const handleType = (type, y, isWordComplete) => {
    if (isWordComplete && type === 'success') {
      const key = Date.now() + Math.random();
      setFirework({ y, key });
      setTimeout(() => setFirework(null), 800);
    }
  };

  const wordObj = levelWords[wordIndex];

  // 每个字母/单词/句子出现时自动播放发音
  useEffect(() => {
    if (started && wordObj && wordObj.word) {
      speak(wordObj.word);
    }
    // eslint-disable-next-line
  }, [wordObj, started]);

  // 数学题答题处理
  const handleMathInput = (e) => {
    if (!started || paused || !['math10','math20','math100'].includes(mode)) return;
    if (e.key === 'Enter') {
      if (userInput.trim() === wordObj.answer) {
        speak('excellent');
        // 触发烟花效果
        setFirework({ y: 160, key: Date.now() + Math.random() });
        setTimeout(() => setFirework(null), 800);
        setScore(score + 10);
        setUserInput('');
        setAttempts(0);
        handleWordComplete(true);
      } else {
        if (attempts < 1) {
          speak('Try Again');
          setAttempts(attempts + 1);
          setUserInput('');
        } else {
          setUserInput('');
          setAttempts(0);
          handleWordComplete(false);
        }
      }
    }
  };

  if (showLevelTransition) {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: 100,
        fontSize: 24 
      }}>
        {showLevelTransition === 'complete' ? (
          <>
            恭喜通关！最终得分：{score}
            <br />
            <button
              style={{
                marginTop: 32,
                padding: '12px 36px',
                fontSize: 20,
                borderRadius: 10,
                border: 'none',
                backgroundColor: '#1976d2',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                transition: 'all 0.2s',
              }}
              onClick={() => window.location.reload()}
            >
              返回
            </button>
          </>
        ) : (
          <>
            🎮 第 {level + 1} 关完成！准备进入第 {level + 2} 关...
          </>
        )}
      </div>
    );
  }
  if (!wordObj) return null;

  // 主要内容区域
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #fffde4 100%)',
      padding: 0,
      margin: 0,
      display: 'flex',
    }}>
      {/* 左侧菜单栏 */}
      <div style={{
        width: 180,
        minWidth: 120,
        background: 'rgba(255,255,255,0.7)',
        borderRight: '1px solid #e0e7ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '40px 0 0 0',
        boxShadow: '2px 0 12px 0 rgba(80,80,180,0.04)',
        zIndex: 2,
      }}>
        <button
          onClick={() => setMode('letter')}
          style={{
            background: mode === 'letter' ? '#1976d2' : 'transparent',
            color: mode === 'letter' ? '#fff' : '#333',
            border: 'none',
            borderLeft: mode === 'letter' ? '6px solid #1976d2' : '6px solid transparent',
            fontSize: 20,
            fontWeight: 600,
            padding: '18px 0 18px 24px',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          字母练习
        </button>
        <button
          onClick={() => setMode('word')}
          style={{
            background: mode === 'word' ? '#1976d2' : 'transparent',
            color: mode === 'word' ? '#fff' : '#333',
            border: 'none',
            borderLeft: mode === 'word' ? '6px solid #1976d2' : '6px solid transparent',
            fontSize: 20,
            fontWeight: 600,
            padding: '18px 0 18px 24px',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          单词通关
        </button>
        <button
          onClick={() => setMode('sentence')}
          style={{
            background: mode === 'sentence' ? '#1976d2' : 'transparent',
            color: mode === 'sentence' ? '#fff' : '#333',
            border: 'none',
            borderLeft: mode === 'sentence' ? '6px solid #1976d2' : '6px solid transparent',
            fontSize: 20,
            fontWeight: 600,
            padding: '18px 0 18px 24px',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          句子快打
        </button>
        <button
          onClick={() => setMode('math10')}
          style={{
            background: mode === 'math10' ? '#1976d2' : 'transparent',
            color: mode === 'math10' ? '#fff' : '#333',
            border: 'none',
            borderLeft: mode === 'math10' ? '6px solid #1976d2' : '6px solid transparent',
            fontSize: 20,
            fontWeight: 600,
            padding: '18px 0 18px 24px',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          10以内加减
        </button>
        <button
          onClick={() => setMode('math20')}
          style={{
            background: mode === 'math20' ? '#1976d2' : 'transparent',
            color: mode === 'math20' ? '#fff' : '#333',
            border: 'none',
            borderLeft: mode === 'math20' ? '6px solid #1976d2' : '6px solid transparent',
            fontSize: 20,
            fontWeight: 600,
            padding: '18px 0 18px 24px',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          20以内加减
        </button>
        <button
          onClick={() => setMode('math100')}
          style={{
            background: mode === 'math100' ? '#1976d2' : 'transparent',
            color: mode === 'math100' ? '#fff' : '#333',
            border: 'none',
            borderLeft: mode === 'math100' ? '6px solid #1976d2' : '6px solid transparent',
            fontSize: 20,
            fontWeight: 600,
            padding: '18px 0 18px 24px',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          100以内加减
        </button>
      </div>

      {/* 右侧主内容区 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 顶部信息栏 */}
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          marginTop: 32,
          marginBottom: 32,
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 0,
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 36px',
          gap: 24,
        }}>
          <h2 style={{ margin: 0, fontWeight: 700, color: '#3b3b7c', letterSpacing: 2 }}>第 {level + 1} 关</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 700, color: '#1976d2' }}>得分：{score}</h2>
            <span style={{ fontSize: 20, color: '#1976d2', fontWeight: 500 }}>用时：{timer.toFixed(1)} 秒</span>
          </div>
          <h2 style={{ margin: 0, fontWeight: 700, color: '#3b3b7c', letterSpacing: 2 }}>
            第 {wordIndex + 1}/10 {mode === 'letter' ? '字母' : mode === 'sentence' ? '句子' : mode==='word' ? '单词' : mode==='math10' ? '题' : mode==='math20' ? '题' : '题'}
          </h2>
        </div>

        {/* 主要内容区域 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 32,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 12px',
        }}>
          {/* 左侧游戏区域 */}
          <div style={{
            flex: '1',
            maxWidth: 700,
            minWidth: 320,
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 18,
            boxShadow: '0 4px 24px 0 rgba(80,80,180,0.08)',
            padding: '32px 18px 80px 18px',
            position: 'relative',
            minHeight: 420,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
            <div style={{ position: 'relative', height: 320, marginTop: 10 }}>
              {/* 开始游戏按钮覆盖在游戏区中央 */}
              {!started && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 12,
                }}>
                  <button
                    onClick={() => setStarted(true)}
                    style={{
                      padding: '18px 60px',
                      fontSize: 28,
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                      transition: 'all 0.2s',
                    }}
                  >
                    开始游戏
                  </button>
                </div>
              )}
              {/* 字母/单词/句子/数学题掉落区，只有 started 时才渲染 */}
              {started && ([
                'math10','math20','math100'].includes(mode) ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'
                  }}>
                    <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 4, marginBottom: 24 }}>{wordObj.word}</div>
                    <input
                      type="text"
                      value={userInput}
                      onChange={e => setUserInput(e.target.value.replace(/[^\d-]/g, ''))}
                      onKeyDown={handleMathInput}
                      disabled={paused}
                      style={{
                        fontSize: 32,
                        padding: '8px 24px',
                        borderRadius: 8,
                        border: '2px solid #1976d2',
                        outline: 'none',
                        textAlign: 'center',
                        width: 160,
                        marginBottom: 12,
                        background: paused ? '#eee' : '#fff',
                        color: '#1976d2',
                        fontWeight: 700,
                        letterSpacing: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s',
                      }}
                      autoFocus
                    />
                    <div style={{ color: '#d32f2f', fontSize: 18, minHeight: 24 }}>
                      {attempts === 1 ? '再试一次！' : ''}
                    </div>
                  </div>
                ) : (
                  <FallingLetter
                    word={wordObj.word}
                    interval={interval}
                    onSuccess={() => handleWordComplete(true)}
                    onFail={() => handleWordComplete(false)}
                    onType={handleType}
                    paused={paused}
                  />
                )
              )}
              {firework && (
                <Firework key={firework.key} y={firework.y} />
              )}
            </div>
            {/* 底部英文单词和暂停按钮 */}
            <div style={{
              position: 'absolute',
              bottom: 18,
              left: 0,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 36,
              fontWeight: 'bold',
              letterSpacing: 8,
              color: '#333',
              textShadow: '1px 1px 6px #fff',
              gap: 24,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 14,
              boxShadow: '0 2px 12px 0 rgba(80,80,180,0.08)',
              padding: '10px 24px',
              margin: '0 auto',
              maxWidth: 520,
            }}>
              <span>{wordObj.word}</span>
              <button
                onClick={() => setPaused(p => !p)}
                style={{
                  marginLeft: 16,
                  padding: '8px 24px',
                  fontSize: 22,
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: paused ? '#43a047' : '#fbc02d',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s',
                }}
              >
                {paused ? '继续' : '暂停'}
              </button>
            </div>
          </div>

          {/* 右侧图片和按钮区域，仅单词通关模式显示 */}
          {mode === 'word' || mode === 'sentence' ? (
            <div style={{
              width: 300,
              minWidth: 220,
              marginLeft: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'sticky',
              top: 32,
            }}>
              <div style={{
                width: '100%',
                height: 200,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(80,80,180,0.10)',
                marginBottom: 24,
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img 
                  src={wordObj.image} 
                  alt={wordObj.word}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    background: '#fff',
                    padding: 20,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GamePage; 