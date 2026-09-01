let currentQuestion = 0;
let score = 0;

const questions = [
  { q: "ما هي عاصمة مصر؟", options: ["القاهرة", "الاسكندرية", "الجيزة", "اسيوط"], a: "القاهرة" },
  { q: "كم عدد ايام السنة الكبيسة؟", options: ["365", "366", "364", "360"], a: "366" },
  { q: "من هو اول انسان صعد للقمر؟", options: ["نيل ارمسترونج", "باز الدرن", "يوري جاجارين", "مايكل كولينز"], a: "نيل ارمسترونج" },
  { q: "ما هو اكبر حيوان في العالم؟", options: ["الفيل", "الحوت الازرق", "الزرافة", "الديناصور"], a: "الحوت الازرق" },
  { q: "كم عدد القارات في العالم؟", options: ["5", "6", "7", "8"], a: "7" }
];

function startGame() {
  currentQuestion = 0;
  score = 0;
  document.querySelector(".game-box").innerHTML = `<div id="quiz"></div>`;
  showQuestion();
}

function showQuestion() {
  if (currentQuestion < questions.length) {
    let q = questions[currentQuestion];
    let quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = `
      <h2>السؤال ${currentQuestion + 1} من ${questions.length}</h2>
      <h1>${q.q}</h1>
      <div class="options">
        ${q.options.map(opt => `<button onclick="checkAnswer('${opt}')">${opt}</button>`).join('')}
      </div>
      <p>النتيجة: ${score}</p>
    `;
  } else {
    document.getElementById("quiz").innerHTML = `
      <h1>خلصت اللعبة! 🎉</h1>
      <p>نتيجتك النهائية: ${score} من ${questions.length}</p>
      <button onclick="startGame()">العب تاني</button>
    `;
  }
}

function checkAnswer(selected) {
  if (selected === questions[currentQuestion].a) {
    alert("صح! برافو 🎉");
    score++;
  } else {
    alert("غلط! الاجابة الصح: " + questions[currentQuestion].a);
  }
  currentQuestion++;
  showQuestion();
}
