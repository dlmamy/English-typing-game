export function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // 先取消当前所有语音
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  }
}

export function playSound(type) {
  let url = '';
  if (type === 'success') {
    url = '/success.mp3';
  } else if (type === 'fail') {
    url = '/fail.mp3';
  }
  if (url) {
    const audio = new window.Audio(url);
    audio.play();
  }
} 