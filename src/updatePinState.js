export function updatePinState(isActive) {
  if (isActive) {
    this.pin.setTexture("unpin"); // 활성화 상태일 때 unpin 텍스처로 변경
  } else {
    this.pin.setTexture("pin"); // 비활성화 상태일 때 pin 텍스처로 변경
  }
}
