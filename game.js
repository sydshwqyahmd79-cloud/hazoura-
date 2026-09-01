const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let keys = {};
let arrows = [];
let monsters = [];
let score = 0;

// الصور بالاسماء اللي انت رافعها
const background = new Image();
background.src = 'background.jpg.jpeg'; 

const archerImg = new Image();
archerImg.src = 'archer.png.jpeg'; 

const monsterImg = new Image();
monsterImg.src = 'monster.png.jpeg'; 

const arrowImg = new Image();
arrowImg.src = 'arrow.png'; 

// اللاعب
const archer = { x: 50, y: 450, w: 60, h: 80 };

// الوحوش
function spawnMonster() {
    monsters.push({ x: 800, y: 450, w: 60, h: 60, speed: 2 });
}
setInterval(spawnMonster, 2000);

// التحكم
document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });

function shoot() {
    arrows.push({ x: archer.x + 50, y: archer.y + 30, w: 30, h: 10, speed: 8 });
}

// تحديث اللعبة
function update() {
    if (keys['ArrowRight']) archer.x += 5;
    if (keys['ArrowLeft']) archer.x -= 5;
    if (keys[' ']) { shoot(); keys[' '] = false; }

    arrows.forEach(a => a.x += a.speed);
    monsters.forEach(m => m.x -= m.speed);

    // التصادم
    arrows.forEach((a, i) => {
        monsters.forEach((m, j) => {
            if (a.x < m.x + m.w && a.x + a.w > m.x && a.y < m.y + m.h && a.y + a.h > m.y) {
                arrows.splice(i, 1);
                monsters.splice(j, 1);
                score++;
            }
        });
    });
}

// الرسم
function draw() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(archerImg, archer.x, archer.y, archer.w, archer.h);
    arrows.forEach(a => ctx.drawImage(arrowImg, a.x, a.y, a.w, a.h));
    monsters.forEach(m => ctx.drawImage(monsterImg, m.x, m.y, m.w, m.h));
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 40);
}

// اللوب
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
