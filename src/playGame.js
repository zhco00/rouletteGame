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
    this.load.audio("spinSound", "./assets/spinSound.mp3"); 
  }

  create() {
    this.wheel1 = new Wheel(this, gameOptions, 0); 
    this.wheel2 = new Wheel(this, secondWheelOptions, 1);
    createPin.call(this);
    createPrizeText.call(this);
    createButtons.call(this);

    // 효과음 추가
    this.spinSound = this.sound.add("spinSound", {
      loop: true,
  });

    // 재설정 버튼 위에 텍스트 추가
    const brandText = this.add.text(this.scale.width / 2, this.scale.height - 150, '생활 속 감성 브랜드 미루', {
      fontSize: '30px',
      color: '#000000',
      align: 'center'
    }).setOrigin(0.5);

    // 재설정 버튼 생성
    const resetButton = document.createElement("button");
    resetButton.id = "resetButton";
    resetButton.innerText = "룰렛 재설정";
    resetButton.style.position = "absolute";
    resetButton.style.bottom = "10px";
    resetButton.style.left = "50%";
    resetButton.style.transform = "translateX(-50%)";
    resetButton.style.padding = "10px 15px"; // 버튼 크기 조정
    resetButton.style.fontSize = "18px"; // 폰트 크기 조정
    resetButton.style.backgroundColor = "#ffffff";
    resetButton.style.border = "none";
    resetButton.style.borderRadius = "10px";
    resetButton.style.cursor = "pointer";
    document.body.appendChild(resetButton);

    // 모달 생성
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#ffffff";
    modal.style.padding = "20px";
    modal.style.border = "1px solid #000000";
    modal.style.maxHeight = "80%";
    modal.style.overflowY = "auto";

    // 모달 내용 추가
    const modalTitle = document.createElement("h2");
    modalTitle.innerText = "룰렛 값 변경";
    modal.appendChild(modalTitle);

    const innerWheelInputs = document.createElement("div");
    innerWheelInputs.id = "innerWheelInputs";
    modal.appendChild(innerWheelInputs);

    const outerWheelInputs = document.createElement("div");
    outerWheelInputs.id = "outerWheelInputs";
    modal.appendChild(outerWheelInputs);

    const updateButton = document.createElement("button");
    updateButton.id = "updateButton";
    updateButton.innerText = "변경하기";
    modal.appendChild(updateButton);

    document.body.appendChild(modal);

    // 재설정 버튼 클릭 이벤트
    resetButton.addEventListener("click", () => {
      this.showModal();
    });

    // 변경하기 버튼 클릭 이벤트
    updateButton.addEventListener("click", () => {
      this.updateWheelOptions();
    });
  }

  showModal() {
    const modal = document.getElementById("modal");

    // 기존 내용 초기화
    modal.innerHTML = "";

    // 스타일 변경 (모달 크기 조정)
    modal.style.width = "70%";
    modal.style.height = "80%";
    modal.style.fontSize = "1.5rem"; // 모달 기본 텍스트 크기
    modal.style.padding = "20px";
    modal.style.overflowY = "auto";

    // 모달 제목
    const modalTitle = document.createElement("h2");
    modalTitle.innerText = "룰렛 값 변경";
    modalTitle.style.textAlign = "center";
    modalTitle.style.marginBottom = "20px";
    modalTitle.style.fontSize = "1.5rem"; // 제목 크기
    modal.appendChild(modalTitle);

    // 테이블 생성
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginBottom = "20px";

    // 테이블 헤더
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const innerHeader = document.createElement("th");
    innerHeader.innerText = "안쪽 룰렛";
    innerHeader.style.border = "1px solid #ccc";
    innerHeader.style.padding = "15px";
    innerHeader.style.backgroundColor = "#f0f0f0";
    innerHeader.style.textAlign = "center";
    innerHeader.style.fontSize = "1rem"; // 헤더 텍스트 크기
    innerHeader.style.width = "50%";

    const outerHeader = document.createElement("th");
    outerHeader.innerText = "바깥쪽 룰렛";
    outerHeader.style.border = "1px solid #ccc";
    outerHeader.style.padding = "15px";
    outerHeader.style.backgroundColor = "#f0f0f0";
    outerHeader.style.textAlign = "center";
    outerHeader.style.fontSize = "1rem"; // 헤더 텍스트 크기
    outerHeader.style.width = "50%"; // 너비 반반 설정

    headerRow.appendChild(innerHeader);
    headerRow.appendChild(outerHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 테이블 본문
    const tbody = document.createElement("tbody");

    const maxLength = Math.max(gameOptions.slices.length, secondWheelOptions.slices.length);

    for (let i = 0; i < maxLength; i++) {
        const row = document.createElement("tr");

        // 안쪽 룰렛 값 (수정 가능)
        const innerCell = document.createElement("td");
        innerCell.style.border = "1px solid #ccc";
        innerCell.style.padding = "10px";
        innerCell.style.textAlign = "center";
        innerCell.style.backgroundColor = "#fff";
        innerCell.style.fontSize = "12px"; // 셀 텍스트 크기
        innerCell.contentEditable = true;
        innerCell.innerText = gameOptions.slices[i]?.text || ""; // 값이 없으면 빈 문자열
        innerCell.dataset.type = "inner";
        innerCell.dataset.index = i;
        row.appendChild(innerCell);

        // 바깥쪽 룰렛 값 (수정 가능)
        const outerCell = document.createElement("td");
        outerCell.style.border = "1px solid #ccc";
        outerCell.style.padding = "10px";
        outerCell.style.textAlign = "center";
        outerCell.style.backgroundColor = "#fff";
        outerCell.style.fontSize = "12px"; // 셀 텍스트 크기
        outerCell.contentEditable = true;
        outerCell.innerText = secondWheelOptions.slices[i]?.text || ""; // 값이 없으면 빈 문자열
        outerCell.dataset.type = "outer";
        outerCell.dataset.index = i;
        row.appendChild(outerCell);

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    modal.appendChild(table);

    // 변경하기 버튼
    const updateButton = document.createElement("button");
    updateButton.id = "updateButton";
    updateButton.innerText = "변경하기";
    updateButton.style.display = "block"; // 버튼을 블록 요소로 설정
    updateButton.style.margin = "20px auto"; // 위아래 여백과 중앙 정렬
    updateButton.style.padding = "15px 30px";
    updateButton.style.fontSize = "1rem"; // 버튼 텍스트 크기
    updateButton.style.borderRadius = "8px";
    updateButton.style.border = "1px solid #ccc";
    updateButton.style.backgroundColor = "#ffffff";
    updateButton.style.cursor = "pointer";

    // 변경 버튼 클릭 이벤트
    updateButton.addEventListener("click", () => {
        const cells = tbody.querySelectorAll("td");
        cells.forEach((cell) => {
            const type = cell.dataset.type;
            const index = parseInt(cell.dataset.index, 10);
            if (type === "inner" && gameOptions.slices[index]) {
                gameOptions.slices[index].text = cell.innerText;
            }
            if (type === "outer" && secondWheelOptions.slices[index]) {
                secondWheelOptions.slices[index].text = cell.innerText;
            }
        });

        this.updateWheelOptions();
    });

    modal.appendChild(updateButton);

    // 모달 표시
    modal.style.display = "block";
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

    // 음악 정지
    if (this.spinSound.isPlaying) {
        this.spinSound.stop();
    }

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
    if (!this.spinSound.isPlaying) {
      this.spinSound.play();
  }
  }

  spinWheel(directions, ...wheels) {
    spinWheel.call(this, directions, ...wheels);
    if (!this.spinSound.isPlaying) {
      this.spinSound.play();
  }
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
      width: 800, // 기본 너비
      height: 1400, // 기본 높이
      min: {
        width: 340, // 최소 너비
        height: 800, // 최소 높이
      },
      max: {
        width: 1200, // 최대 너비
        height: 2800, // 최대 높이
      },
      parent: 'thegame',
    },
    backgroundColor: '#d7d7d7',
    scene: [playGame], // 게임 장면 설정
  };
  console.log(Phaser);
  new Phaser.Game(gameConfig);
};