import Phaser from 'phaser';
import { gameOptions, secondWheelOptions } from "./gameOptions.js";
import { Wheel } from "./Wheel.js";
import { createPin } from "./createPin.js";
import { createPrizeText } from "./createPrizeText.js";
import { createButtons } from "./createButtons.js";
import { handleStop } from "./handleStop.js";
import { readResult } from "./readResult.js";
import { updatePinState } from "./updatePinState.js";
import { updateButtonState } from "./updateButtonState.js";
import { spinInfinite } from "./spinInfinite.js";
import { spinWheel } from "./spinWheel.js";
import { getPrizeIndex } from "./getPrizeIndex.js";

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.currentTweens = [];
    this.canSpin = true;
  }

  preload() {
    this.load.image("pin", "./assets/button.png");
    this.load.image("unpin", "./assets/unButton.png");
    this.load.image("abutton", "./assets/button_a.png");
    this.load.image("bbutton", "./assets/button_b.png");
    this.load.image("abbutton", "./assets/button_ab.png");
    this.load.image("activeButtonA", "./assets/active_button_a.png");
    this.load.image("activeButtonB", "./assets/active_button_b.png");
    this.load.image("activeButtonAB", "./assets/active_button_ab.png");
  }

  create() {
    this.wheel1 = new Wheel(this, gameOptions, 0); // 첫 번째 룰렛
    this.wheel2 = new Wheel(this, secondWheelOptions, 1); // 두 번째 룰렛
    createPin.call(this);
    createPrizeText.call(this);
    createButtons.call(this);

    // 재설정 버튼 클릭 이벤트
    document.getElementById("resetButton").addEventListener("click", () => {
      this.showModal();
    });

    // 변경하기 버튼 클릭 이벤트
    document.getElementById("updateButton").addEventListener("click", () => {
      this.updateWheelOptions();
    });
  }

  showModal() {
    const innerWheelInputs = document.getElementById("innerWheelInputs");
    const outerWheelInputs = document.getElementById("outerWheelInputs");

    innerWheelInputs.innerHTML = "";
    outerWheelInputs.innerHTML = "";

    gameOptions.slices.forEach((slice, index) => {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `innerWheelText${index}`;
      input.value = slice.text;
      input.placeholder = `안쪽 룰렛 텍스트 ${index + 1}`;
      innerWheelInputs.appendChild(input);
    });

    secondWheelOptions.slices.forEach((slice, index) => {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `outerWheelText${index}`;
      input.value = slice.text;
      input.placeholder = `바깥쪽 룰렛 텍스트 ${index + 1}`;
      outerWheelInputs.appendChild(input);
    });

    document.getElementById("modal").style.display = "block";
  }

  updateWheelOptions() {
    gameOptions.slices.forEach((slice, index) => {
      const input = document.getElementById(`innerWheelText${index}`);
      if (input) {
        slice.text = input.value;
      }
    });

    secondWheelOptions.slices.forEach((slice, index) => {
      const input = document.getElementById(`outerWheelText${index}`);
      if (input) {
        slice.text = input.value;
      }
    });

    // 룰렛 재생성
    this.wheel1 = new Wheel(this, gameOptions, 0);
    this.wheel2 = new Wheel(this, secondWheelOptions, 1);
    createPin.call(this); // 핀 재생성

    document.getElementById("modal").style.display = "none";
  }

  handleStop(wheel) {
    handleStop.call(this, wheel);
    this.updateButtonState(true); // 룰렛이 멈췄을 때 버튼 상태 업데이트
  }

  readResult(text) {
    readResult.call(this, text);
  }

  updatePinState(isActive) {
    updatePinState.call(this, isActive);
  }

  updateButtonState(isActive) {
    updateButtonState.call(this, isActive);
  }

  spinInfinite(wheel, direction) {
    spinInfinite.call(this, wheel, direction);
  }

  spinWheel(directions, ...wheels) {
    spinWheel.call(this, directions, ...wheels);
  }

  getPrizeIndex(degrees, slices) {
    return getPrizeIndex.call(this, degrees, slices);
  }
}

window.onload = function () {
  const gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 600, // 게임 화면의 너비
      height: 1400, // 게임 화면의 높이
      parent: 'thegame',
    },
    backgroundColor: '#d7d7d7',
    scene: [playGame], // 게임 장면 설정
  };
  console.log(Phaser);
  new Phaser.Game(gameConfig);
};