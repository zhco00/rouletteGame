export function spinInfinite(wheel, direction) {
  wheel.direction = direction; // 회전 방향 저장
  wheel.rotationTween = this.tweens.add({
    targets: wheel.wheelContainer,
    angle: "+=" + direction * 360, // 방향에 따른 회전
    duration: 600, // 1초 동안 한 바퀴
    ease: "Linear", // 일정한 속도로 회전
    repeat: -1, // 무한 반복
  });
}
