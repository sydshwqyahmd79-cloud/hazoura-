const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {}, arrows = [], monsters = [], particles = [];
let score = 0, coins = 0, level = 1, questKills = 0;
let camera = {x: 0};
let gameReady = false; // مش هنبدأ غير لما الصور تحمل

const npc = {x: 400, y: canvas.height - 200, w: 80, h: 120};
const archer = { x: 200, y: canvas.height - 180, w: 100, h: 130, speed: 8, hp: 100, maxHp: 100 };

// 1. نحمل الصور الاول
const background = new Image();
const archerImg = new Image();
const monsterImg = new Image();
const arrowImg = new Image();

let loaded = 0;
function imageLoaded() {
    loaded++;
    if(loaded === 4) { // لما ال4 يحملو
        gameReady = true;
        gameLoop();
    }
}
background.src = 'background.jpg.jpeg'; background.onload = imageLoaded;
archerImg.src = 'archer.png.jpeg'; archerImg.onload = imageLoaded;
monsterImg.src = 'monster.png.jpeg'; monsterImg.onload = imageLoaded;
arrowImg.src = 'arrow.png'; arrowImg.onload = imageLoaded;

// 2. الوحوش
function spawnMonster() {
    if(!gameReady) return;
    let hp = level + 1;
    monsters.push({ x: camera.x + canvas.width + 100, y: canvas.height - 160, w: 100, h: 100, speed: 2 + level*0.3, hp: hp, maxHp: hp });
}
setInterval(spawnMonster, 2500);

// 3. التحكم
document.addEventListener('keydown', e => { keys[e.key] = true; if(e.key === ' ') shoot(); if(e.key === 'e') talkToNPC(); });
document.addEventListener('keyup', e => { keys[e.key] = false; });
document.getElementById('leftBtn').ontouchstart = () => keys['ArrowLeft'] = true;
document.getElementById('leftBtn').ontouchend = () => keys['ArrowLeft'] = false;
document.getElementById('rightBtn').ontouchstart = () => keys['ArrowRight'] = true;
document.getElementById('rightBtn').ontouchend = () => keys['ArrowRight'] = false;
document.getElementById('shootBtn').ontouchstart = () => shoot();
document.getElementById('talkBtn').ontouchstart = () => talkToNPC();

function shoot() { if(gameReady) arrows.push({ x: archer.x + 90, y: archer.y + 50, w: 50, h: 12, speed: 15 }); }
function talkToNPC() {
    if(!gameReady) return;
    if(Math.abs(archer.x - npc.x) < 150) {
        if(questKills >= 5) { coins += 100; questKills = 0; alert("عاش! خدت 100 كوين"); } 
        else { alert(`المهمة: اقتل 5 وولف. فاضل ${5 - questKills}`); }
    }
}
function createBlood(x, y) { for(let i = 0; i < 15; i++) particles.push({x, y, vx: Math.random()*4-2, vy: Math.random()*4-2, life: 20}) }

// 4. التحديث والرسم
function update() {
    if(!gameReady) return;
    if (keys['ArrowRight']) { archer.x += archer.speed; if(archer.x > canvas.width/2) camera.x += archer.speed; }
    if (keys['ArrowLeft']) { archer.x -= archer.speed; if(archer.x < canvas.width/2 && camera.x > 0) camera.x -= archer.speed; }
    if(archer.x < 0) archer.x = 0;

    arrows.forEach(a => a.x += a.speed);
    monsters.forEach(m => m.x -= m.speed);
    arrows = arrows.filter(a => a.x < camera.x + canvas.width);
    monsters = monsters.filter(m => m.x > camera.x - 100);
    particles.forEach(p => {p.x += p.vx; p.y += p.vy; p.life--;});
    particles = particles.filter(p => p.life > 0);

    arrows.forEach((a, i) => monsters.forEach((m, j) => {
        if (a.x < m.x + m.w && a.x + a.w > m.x && a.y < m.y + m.h && a.y + a.h > m.y) {
            m.hp--; createBlood(m.x + 50, m.y + 50); arrows.splice(i, 1);
            if(m.hp <= 0) { monsters.splice(j, 1); score++; coins += 10; questKills++; if(score % 5 === 0) level++; }
        }
    }));
    monsters.forEach(m => { if(m.x < archer.x + 100 && m.x + m.w > archer.x) archer.hp -= 0.5; });
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width, canvas.height); // خلفية سودا لو الصورة لسه
    if(gameReady) {
        ctx.drawImage(background, -camera.x, 0);
        particles.forEach(p => ctx.fillRect(p.x - camera.x, p.y, 4, 4));
        ctx.drawImage(archerImg, archer.x - camera.x, archer.y, archer.w, archer.h);
        ctx.fillStyle = 'yellow'; ctx.fillRect(npc.x - camera.x, npc.y, npc.w, npc.h);
        arrows.forEach(a => ctx.drawImage(arrowImg, a.x - camera.x, a.y, a.w, a.h));
        monsters.forEach(m => {
            ctx.drawImage(monsterImg, m.x - camera.x, m.y, m.w, m.h);
            ctx.fillStyle = 'red'; ctx.fillRect(m.x - camera.x, m.y - 10, m.w, 5);
            ctx.fillStyle = 'green'; ctx.fillRect(m.x - camera.x, m.y - 10, m.w * (m.hp/m.maxHp), 5);
        });
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(10, 10, 400, 120);
        ctx.fillStyle = 'white'; ctx.font = 'bold 24px Arial';
        ctx.fillText(`Score: ${score}  Coins: ${coins}  Level: ${level}`, 20, 40);
        ctx.fillText(`المهمة: ${questKills}/5 وولف`, 20, 70);
        ctx.fillStyle = 'red'; ctx.fillRect(20, 90, 200, 20);
        ctx.fillStyle = 'green'; ctx.fillRect(20, 90, 200 * (archer.hp/archer.maxHp), 20);
    } else {
        ctx.fillStyle = 'white'; ctx.font = '30px Arial';
        ctx.fillText("جاري تحميل اللعبة...", canvas.width/2 - 120, canvas.height/2);
    }
}

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
