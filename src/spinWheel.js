export function spinWheel(directions, ...wheels) {
  if (!this.canSpin) return;

  // 결과 텍스트 초기화
  this.prizeTextA.setText("");
  this.prizeTextB.setText("");

  this.canSpin = false;

  wheels.forEach((wheel, index) => {
    let direction = directions[index];
    wheel.direction = direction; // 회전 방향 저장

    // 무한 회전 트윈 생성
    wheel.rotationTween = this.tweens.add({
      targets: wheel.wheelContainer,
      angle: "+=" + direction * 360, // 방향에 따라 계속 회전
      duration: 900, // 1초에 한 바퀴
      ease: "Linear", // 일정한 속도로 회전
      repeat: -1, // 무한 반복
    });
  });
}
