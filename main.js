// 캔버스 설정
var 캔버스 = document.getElementById('canvas');
var ctx = 캔버스.getContext('2d');
캔버스.width = 600;
캔버스.height = 413;

// 이미지 로드
var 돌 = new Image();
var 토끼 = new Image();
var 배경 = new Image();
돌.src = 'stone.png';
토끼.src = 'rabbit.png';
배경.src = 'background.png';

// 배경 관련 변수
var 배경1_x = 0;
var 배경2_x = 캔버스.width;

// 배경 그리기 함수
function drawBackground() {
    ctx.drawImage(배경, 배경1_x, 0, 캔버스.width, 캔버스.height);
    ctx.drawImage(배경, 배경2_x, 0, 캔버스.width, 캔버스.height);

    배경1_x -= 15;
    배경2_x -= 15;

    if (배경1_x <= -캔버스.width) {
        배경1_x = 캔버스.width;
    }
    if (배경2_x <= -캔버스.width) {
        배경2_x = 캔버스.width;
    }
}

// 주인공 그리기
var 주인공 = {
    x: 30,
    y: 200,
    width: 50,
    height: 113,
    draw() {
        ctx.drawImage(토끼, this.x, this.y); 
    }
};

// 장애물 그리기
class Stone {
    constructor() {
        this.x = 캔버스.width;
        this.y = 250;
        this.width = 80;
        this.height = 70;
    }
    draw() {
        ctx.drawImage(돌, this.x, this.y); 
    }
}

// 애니메이션 변수
var 애니메이션;
var stone = null;
var 타이머 = 0;
var jump타이머 = 0;
var jump = false;
var isJumping = false; // 점프 중 여부
var isGameOver = false; // 게임 오버 상태 변수

// 게임 다시 시작 버튼
var restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);

function 주인공animate() {
    애니메이션 = requestAnimationFrame(주인공animate);
    타이머++;

    if (isGameOver) return; // 게임 오버 시 애니메이션을 멈추도록 처리

    ctx.clearRect(0, 0, 캔버스.width, 캔버스.height);
    drawBackground();

    if (!stone || stone.x + stone.width < 0) {
        if (타이머 % 120 === 0) {
            stone = new Stone();
        }
    }

    if (stone) {
        stone.x -= 15;
        crash(주인공, stone);
        stone.draw();
    }

    if (jump == true) {
        if (jump타이머 < 25) { // 점프 높이
            주인공.y -= 5 ;
        } else {
            주인공.y += 3;
        }
        jump타이머++;
    }

    if (주인공.y >= 200) {
        주인공.y = 200;
        jump = false;
        jump타이머 = 0;
        isJumping = false;
    }

    주인공.draw();
}

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !isJumping && !isGameOver) { // 점프 키
        jump = true;
        isJumping = true;
    }
});

캔버스.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isJumping && !isGameOver) {
        jump = true;
        isJumping = true;
    }
});

function crash(주인공, 장애물) {
    if (
        주인공.x < 장애물.x + 장애물.width &&
        주인공.x + 주인공.width > 장애물.x &&
        주인공.y < 장애물.y + 장애물.height &&
        주인공.y + 주인공.height > 장애물.y
    ) {
        cancelAnimationFrame(애니메이션);
        isGameOver = true;
        restartButton.style.display = 'block'; // 게임 오버 시 버튼 보이기
    }
}

// 게임 리셋 함수
function restartGame() {
    isGameOver = false;
    restartButton.style.display = 'none'; // 게임 다시 시작 시 버튼 숨기기
    주인공.y = 200;
    stone = null;
    타이머 = 0;
    jump타이머 = 0;
    jump = false;
    isJumping = false;
    주인공animate();
}

주인공animate();