export function readResult(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    // 음성 옵션 설정
    utterance.lang = "ko-KR"; // 한국어
    utterance.pitch = 1.3; // 음성 높낮이 (0 ~ 2)
    utterance.rate = 1; // 읽기 속도 (0.1 ~ 10)
    utterance.volume = 1; // 음량 (0 ~ 1)

    // 텍스트를 음성으로 읽기
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("이 브라우저는 SpeechSynthesis를 지원하지 않습니다.");
  }
}
