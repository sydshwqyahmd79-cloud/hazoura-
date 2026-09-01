const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0; let lives = 3; let arrows = []; let monsters = [];
let archerX = canvas.width / 2; let archerY = canvas.height - 120;

// حمل الصور
const archerImg = new Image(); archerImg.src = 'archer.png';
const monsterImg = new Image(); monsterImg.src = 'monster.png';
const arrowImg = new Image(); arrowImg.src = 'arrow.png';
const bgImg = new Image(); bgImg.src = 'background.jpg';

function updateUI() {
  document.getElementById('score').innerText = score;
  document.getElementById('lives').innerText = '❤️'.repeat(lives);
}

// لمسه واحده = حركه + ضرب
canvas.addEventListener('touchstart', (e) => {
  archerX = e.touches[0].clientX;
  arrows.push({x: archerX, y: archerY, speed: 10});
});

canvas.addEventListener('touchmove', (e) => {
  archerX = e.touches[0].clientX;
  arrows.push({x: archerX, y: archerY, speed: 10});
});

setInterval(() => {
  monsters.push({ x: Math.random() * canvas.width, y: 0, speed: 2.5 });
}, 1500);

function gameLoop() {
  // ارسم الخلفية HD
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // ارسم الرامي
  ctx.drawImage(archerImg, archerX - 25, archerY - 25, 50, 50);

  // الاسهم
  arrows.forEach((a, i) => {
    a.y -= a.speed;
    ctx.drawImage(arrowImg, a.x - 5, a.y, 10, 30);
    if(a.y < 0) arrows.splice(i,1);
  });

  // الوحوش
  monsters.forEach((m, i) => {
    m.y += m.speed;
    ctx.drawImage(monsterImg, m.x - 25, m.y, 50, 50);
  });

  requestAnimationFrame(gameLoop);
}

bgImg.onload = () => { updateUI(); gameLoop(); }
