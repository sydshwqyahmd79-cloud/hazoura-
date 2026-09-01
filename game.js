const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0; let lives = 3; let arrows = []; let monsters = [];
let archerX = canvas.width / 2; let archerY = canvas.height - 80;

function updateUI() {
  document.getElementById('score').innerText = score;
  document.getElementById('lives').innerText = '❤️'.repeat(lives);
}

// لمسه واحده = حركه + ضرب
canvas.addEventListener('touchstart', (e) => {
  archerX = e.touches[0].clientX;
  arrows.push({x: archerX, y: archerY, speed: 8});
canvas.addEventListener('touchmove', (e) => {
  archerX = e.touches[0].clientX;
  arrows.push({x: archerX, y: archerY, speed: 8});
});

// الوحوش
setInterval(() => { monsters.push({ x: Math.random() * canvas.width, y: 0, speed: 2 }); }, 2000);

function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#8B4513'; ctx.fillRect(canvas.width/2 - 50, canvas.height - 60, 100, 60);
  ctx.fillStyle = 'blue'; ctx.beginPath(); ctx.arc(archerX, archerY, 15, 0, Math.PI*2); ctx.fill();
  arrows.forEach((a, i) => { a.y -= a.speed; ctx.fillStyle = 'black'; ctx.fillRect(a.x, a.y, 3, 15); if(a.y < 0) arrows.splice(i,1); });
  monsters.forEach((m, i) => { m.y += m.speed; ctx.fillStyle = 'green'; ctx.beginPath(); ctx.arc(m.x, m.y, 20, 0, Math.PI*2); ctx.fill(); });
  requestAnimationFrame(gameLoop);
}
updateUI(); gameLoop();
