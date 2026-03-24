let score = 0;
let current = 0;
let timer;
let timeLeft = 10;
let answered = false;
let level = "easy";
let q;
let highScore = localStorage.getItem("highScore") || 0;

document.getElementById("highScore").innerText = "High Score: " + highScore;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// unlock sound
document.body.addEventListener("click", () => {
  correctSound.play().then(()=>correctSound.pause()).catch(()=>{});
  wrongSound.play().then(()=>wrongSound.pause()).catch(()=>{});
}, {once:true});

// START
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameArea").classList.remove("hidden");
  loadQuestion();
}

// LEVEL
function setLevel(lvl, event) {
  level = lvl;
  current = 0;
  score = 0;

  document.getElementById("score").innerText = "Score: 0";

  document.querySelectorAll(".levels button").forEach(btn => btn.style.background = "");
  event.target.style.background = "orange";

  loadQuestion();
}

// RANDOM QUESTION + EXPLANATION
function randomQuestion() {
  let range = level === "easy" ? 10 : level === "medium" ? 20 : 50;

  let a = Math.floor(Math.random()*range)+1;
  let b = Math.floor(Math.random()*range)+1;
  let c = Math.floor(Math.random()*range)+1;

  let ops = ["+","-","×","÷"];
  let op1 = ops[Math.floor(Math.random()*4)];
  let op2 = ops[Math.floor(Math.random()*4)];

  let expression = `${a} ${op1} ${b} ${op2} ${c}`;

  let correct, explanation;

  if(op1==="×"||op1==="÷"){
    correct=`${a} ${op1} ${b}`;
    explanation=`BODMAS: Solve ${a} ${op1} ${b} first`;
  } else if(op2==="×"||op2==="÷"){
    correct=`${b} ${op2} ${c}`;
    explanation=`BODMAS: Solve ${b} ${op2} ${c} first`;
  } else {
    correct=`${a} ${op1} ${b}`;
    explanation=`No × ÷ → solve left to right`;
  }

  return {
    expression,
    correct,
    explanation,
    options:[`${a} ${op1} ${b}`,`${b} ${op2} ${c}`]
  };
}

// LOAD
function loadQuestion() {
  clearInterval(timer);
  answered = false;

  q = randomQuestion();

  document.getElementById("question").innerText = q.expression;
  document.getElementById("result").innerText = "";
  document.getElementById("explanation").innerText = "";

  let html = "";
  q.options.forEach(opt=>{
    html += `<button onclick="checkAnswer('${opt}')">${opt}</button>`;
  });

  document.getElementById("options").innerHTML = html;

  startTimer();
  updateProgress();
}

// CHECK
function checkAnswer(ans) {
  if (answered) return;
  answered = true;

  clearInterval(timer);

  let buttons = document.querySelectorAll("#options button");

  buttons.forEach(btn => {
    btn.disabled = true;

    if (btn.innerText === q.correct) {
      btn.style.background = "green";
      btn.style.color = "white";
    }

    if (btn.innerText === ans && ans !== q.correct) {
      btn.style.background = "red";
      btn.style.color = "white";
    }
  });

  document.getElementById("explanation").innerText = q.explanation;

  if (ans === q.correct) {
    score++;
    correctSound.play().catch(()=>{});
    document.getElementById("result").innerText = "✅ Correct!";
  } else {
    wrongSound.play().catch(()=>{});
    document.getElementById("result").innerText = "❌ Wrong!";
  }

  document.getElementById("score").innerText = "Score: " + score;

  // HIGH SCORE
  if(score > highScore){
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("highScore").innerText = "High Score: " + highScore;

  setTimeout(nextQuestion, 1500);
}

// TIMER
function startTimer() {
  clearInterval(timer);

  let timeLimit = level === "easy" ? 12 : level === "medium" ? 8 : 5;
  timeLeft = timeLimit;

  document.getElementById("timer").innerText = "Time: " + timeLeft;

  timer = setInterval(()=>{
    if(timeLeft <= 0){
      clearInterval(timer);
      document.getElementById("result").innerText = "⏰ Time's up!";
      answered = true;

      document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
      setTimeout(nextQuestion,1500);
      return;
    }

    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;

  },1000);
}

// NEXT
function nextQuestion(){
  current++;
  if(current >= 10){
    endGame();
    return;
  }
  loadQuestion();
}

// PROGRESS
function updateProgress(){
  document.getElementById("progress").style.width = (current*10)+"%";
}

// END
function endGame(){
  clearInterval(timer);

  // hide game area
  document.getElementById("gameArea").classList.add("hidden");

  // 🔥 hide top bar
  document.querySelector(".top-bar").style.display = "none";

  // show game over
  document.getElementById("gameOver").classList.remove("hidden");
  document.getElementById("finalScore").innerText = "Your Score: " + score;

  confetti({particleCount:150,spread:70});
}

// RESTART
function restartGame(){
  score = 0;
  current = 0;

  document.getElementById("gameOver").classList.add("hidden");

  // 🔥 show top bar again
  document.querySelector(".top-bar").style.display = "flex";

  document.getElementById("startScreen").style.display = "block";
}
// PARTICLES
particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    size: { value: 3 },
    move: { speed: 2 },
    line_linked: { enable: true }
  }
});