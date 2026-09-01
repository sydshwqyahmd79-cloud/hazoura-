const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 700;

let keys = {};
let arrows = [];
let monsters = [];
let score = 0;
let particles = [];

// الصور
const background = new Image();
background.src = 'background.jpg.jpeg'; 
const archerImg = new Image();
archerImg.src = 'archer.png.jpeg'; 
const monsterImg = new Image();
monsterImg.src = 'monster.png.jpeg'; 
const arrowImg = new Image();
arrowImg.src = 'arrow.png'; 

const archer = { x: 100, y: 520, w: 100, h: 130, speed: 6 };

function spawnMonster() {
    let hp = Math.floor(Math.random() * 2) + 1;
    monsters.push({ x: 1200, y: 540, w: 100, h: 100, speed: 2.5, hp: hp });
}
setInterval(spawnMonster, 1500);

// كمبيوتر
document.addEventListener('keydown', e => { 
    keys[e.key] = true; 
    if(e.key === ' ') shoot();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

// موبايل - الزراير التاتش
document.getElementById('leftBtn').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('leftBtn').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('rightBtn').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('rightBtn').addEventListener('touchend', () => keys['ArrowRight'] = false);
document.getElementById('shootBtn').addEventListener('touchstart', () => shoot());

function shoot() {
    arrows.push({ x: archer.x + 90, y: archer.y + 50, w: 50, h: 12, speed: 12 });
}

function createBlood(x, y) {
    for(let i = 0; i < 10; i++) {
        particles.push({x: x, y: y, vx: Math.random()*4-2, vy: Math.random()*4-2, life: 20})
    }
}

function update() {
    if (keys['ArrowRight']) archer.x += archer.speed;
    if (keys['ArrowLeft']) archer.x -= archer.speed;
    if(archer.x < 0) archer.x = 0;
    if(archer.x > 1100) archer.x = 1100;

    arrows.forEach(a => a.x += a.speed);
    monsters.forEach(m => m.x -= m.speed);
    arrows = arrows.filter(a => a.x < 1200);
    monsters = monsters.filter(m => m.x > -100);
    
    particles.forEach(p => {p.x += p.vx; p.y += p.vy; p.life--;});
    particles = particles.filter(p => p.life > 0);

    arrows.forEach((a, i) => {
        monsters.forEach((m, j) => {
            if (a.x < m.x + m.w && a.x + a.w > m.x && a.y < m.y + m.h && a.y + a.h > m.y) {
                m.hp--;
                createBlood(m.x + 50, m.y + 50);
                arrows.splice(i, 1);
                if(m.hp <= 0) {
                    monsters.splice(j, 1);
                    score++;
                }
            }
        });
    });
}

function draw() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    particles.forEach(p => ctx.fillRect(p.x, p.y, 3, 3));
    ctx.drawImage(archerImg, archer.x, archer.y, archer.w, archer.h);
    arrows.forEach(a => ctx.drawImage(arrowImg, a.x, a.y, a.w, a.h));
    monsters.forEach(m => ctx.drawImage(monsterImg, m.x, m.y, m.w, m.h));
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText('Score: ' + score, 30, 60);
    ctx.fillText('Score: ' + score, 30, 60);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
