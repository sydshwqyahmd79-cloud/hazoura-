const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
let arrows = [];
let monsters = [];
let npc = {x: 400, y: canvas.height - 200, w: 80, h: 120}; // راجل المهمات
let camera = {x: 0}; // عشان الخريطة تتحرك

let score = 0;
let coins = 0; 
let level = 1;
let questKills = 0; // مهمة: اقتل 5 وولف
let particles = [];

const background = new Image();
background.src = 'background.jpg.jpeg'; 
const archerImg = new Image();
archerImg.src = 'archer.png.jpeg'; 
const monsterImg = new Image();
monsterImg.src = 'monster.png.jpeg'; 
const arrowImg = new Image();
arrowImg.src = 'arrow.png'; 

const archer = { x: 200, y: canvas.height - 180, w: 100, h: 130, speed: 8, hp: 100, maxHp: 100 };

function spawnMonster() {
    let hp = level + 1;
    monsters.push({ x: camera.x + canvas.width + 100, y: canvas.height - 160, w: 100, h: 100, speed: 2 + level*0.3, hp: hp, maxHp: hp });
}
setInterval(spawnMonster, 2500);

// تحكم كمبيوتر
document.addEventListener('keydown', e => { 
    keys[e.key] = true; 
    if(e.key === ' ') shoot();
    if(e.key === 'e') talkToNPC(); // E عشان تكلم الراجل
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

// تحكم موبايل
document.getElementById('leftBtn').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('leftBtn').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('rightBtn').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('rightBtn').addEventListener('touchend', () => keys['ArrowRight'] = false);
document.getElementById('shootBtn').addEventListener('touchstart', () => shoot());
document.getElementById('talkBtn').addEventListener('touchstart', () => talkToNPC()); // زرار الكلام

function shoot() {
    arrows.push({ x: archer.x + 90, y: archer.y + 50, w: 50, h: 12, speed: 15 });
}

function talkToNPC() {
    if(Math.abs(archer.x - npc.x) < 150) { // لو قريب منه
        if(questKills >= 5) {
            coins += 100;
            questKills = 0;
            alert("عاش! خدت 100 كوين. مهمة جديدة: اقتل 5 وولف");
        } else {
            alert(`المهمة: اقتل 5 وولف. فاضل ${5 - questKills}`);
        }
    }
}

function createBlood(x, y) {
    for(let i = 0; i < 15; i++) {
        particles.push({x: x, y: y, vx: Math.random()*4-2, vy: Math.random()*4-2, life: 20})
    }
}

function update() {
    if (keys['ArrowRight']) {
        archer.x += archer.speed;
        if(archer.x > canvas.width/2) camera.x += archer.speed; // الكاميرا تتحرك
    }
    if (keys['ArrowLeft']) {
        archer.x -= archer.speed;
        if(archer.x < canvas.width/2 && camera.x > 0) camera.x -= archer.speed;
    }
    if(archer.x < 0) archer.x = 0;

    arrows.forEach(a => a.x += a.speed);
    monsters.forEach(m => m.x -= m.speed);
    arrows = arrows.filter(a => a.x < camera.x + canvas.width);
    monsters = monsters.filter(m => m.x > camera.x - 100);
    
    particles.forEach(p => {p.x += p.vx; p.y += p.vy; p.life--;});
    particles = particles.filter(p => p.life > 0);

    // الضرب
    arrows.forEach((a, i) => {
        monsters.forEach((m, j) => {
            if (a.x < m.x + m.w && a.x + a.w > m.x && a.y < m.y + m.h && a.y + a.h > m.y) {
                m.hp--;
                createBlood(m.x + 50, m.y + 50);
                arrows.splice(i, 1);
                if(m.hp <= 0) {
                    monsters.splice(j, 1);
                    score++;
                    coins += 10;
                    questKills++;
                    if(score % 5 === 0) level++;
                }
            }
        });
    });

    // الوولف يضربك
    monsters.forEach(m => {
        if(m.x < archer.x + 100 && m.x + m.w > archer.x && m.y < archer.y + 130 && m.y + m.h > archer.y) {
            archer.hp -= 0.5;
        }
    });
}

function draw() {
    ctx.drawImage(background, -camera.x, 0, background.width, canvas.height);
    ctx.fillStyle = 'red';
    particles.forEach(p => ctx.fillRect(p.x - camera.x, p.y, 4, 4));
    
    // النينجا
    ctx.drawImage(archerImg, archer.x - camera.x, archer.y, archer.w, archer.h);
    
    // الراجل بتاع المهمات
    ctx.fillStyle = 'yellow';
    ctx.fillRect(npc.x - camera.x, npc.y, npc.w, npc.h);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("NPC", npc.x - camera.x + 20, npc.y - 10);

    arrows.forEach(a => ctx.drawImage(arrowImg, a.x - camera.x, a.y, a.w, a.h));
    
    monsters.forEach(m => {
        ctx.drawImage(monsterImg, m.x - camera.x, m.y, m.w, m.h);
        ctx.fillStyle = 'red';
        ctx.fillRect(m.x - camera.x, m.y - 10, m.w, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(m.x - camera.x, m.y - 10, m.w * (m.hp/m.maxHp), 5);
    });
    
    // الواجهة
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 400, 120);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${score}  Coins: ${coins}  Level: ${level}`, 20, 40);
    ctx.fillText(`المهمة: ${questKills}/5 وولف`, 20, 70);
    
    // شريط صحة النينجا
    ctx.fillStyle = 'red';
    ctx.fillRect(20, 90, 200, 20);
    ctx.fillStyle = 'green';
    ctx.fillRect(20, 90, 200 * (archer.hp/archer.maxHp), 20);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
