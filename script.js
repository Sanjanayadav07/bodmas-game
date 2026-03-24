let score = 0;
let current = 0;
let timer;
let timeLeft = 10;
let answered = false;
let level = "easy";
let q;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// unlock sound
document.body.addEventListener("click", () => {
  correctSound.play().then(()=>correctSound.pause()).catch(()=>{});
  wrongSound.play().then(()=>wrongSound.pause()).catch(()=>{});
}, {once:true});

// START GAME
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameArea").classList.remove("hidden");
  loadQuestion();
}

// LEVEL
function setLevel(lvl) {
  level = lvl;
  current = 0;
  score = 0;

  document.getElementById("score").innerText = "Score: 0";

  // highlight active level
  document.querySelectorAll(".levels button").forEach(btn => {
    btn.style.background = "";
  });

  event.target.style.background = "orange";

  loadQuestion();
}

// RANDOM QUESTION
function randomQuestion() {
  let range = level === "easy" ? 10 : level === "medium" ? 20 : 50;

  let a = Math.floor(Math.random()*range)+1;
  let b = Math.floor(Math.random()*range)+1;
  let c = Math.floor(Math.random()*range)+1;

  let ops = ["+","-","×","÷"];
  let op1 = ops[Math.floor(Math.random()*4)];
  let op2 = ops[Math.floor(Math.random()*4)];

  let expression = `${a} ${op1} ${b} ${op2} ${c}`;

  let correct;
  if(op1==="×"||op1==="÷") correct=`${a} ${op1} ${b}`;
  else if(op2==="×"||op2==="÷") correct=`${b} ${op2} ${c}`;
  else correct=`${a} ${op1} ${b}`;

  return {
    expression,
    correct,
    options:[`${a} ${op1} ${b}`,`${b} ${op2} ${c}`]
  };
}

// LOAD
function loadQuestion() {
  clearInterval(timer);
  answered=false;

  q = randomQuestion();

  document.getElementById("question").innerText = q.expression;
  document.getElementById("result").innerText="";
  document.getElementById("explanation").innerText="";

  let html="";
  q.options.forEach(opt=>{
    html+=`<button onclick="checkAnswer('${opt}')">${opt}</button>`;
  });

  document.getElementById("options").innerHTML=html;

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

    // ✅ Correct answer → GREEN
    if (btn.innerText === q.correct) {
      btn.style.background = "green";
      btn.style.color = "white";
    }

    // ❌ Wrong selected → RED
    if (btn.innerText === ans && ans !== q.correct) {
      btn.style.background = "red";
      btn.style.color = "white";
    }
  });

  correctSound.currentTime = 0;
  wrongSound.currentTime = 0;

  if (ans === q.correct) {
    score++;
    correctSound.play().catch(()=>{});
    document.getElementById("result").innerText = "✅ Correct!";
  } else {
    wrongSound.play().catch(()=>{});
    document.getElementById("result").innerText = "❌ Wrong!";
  }

  document.getElementById("score").innerText = "Score: " + score;

  setTimeout(nextQuestion, 1500);
}

// TIMER
function startTimer(){
  clearInterval(timer);
  timeLeft=10;

  document.getElementById("timer").innerText="Time: "+timeLeft;

  timer=setInterval(()=>{
    if(timeLeft<=0){
      clearInterval(timer);
      document.getElementById("timer").innerText="Time: 0";
      document.getElementById("result").innerText="⏰ Time's up!";
      answered=true;

      document.querySelectorAll("#options button").forEach(btn=>btn.disabled=true);
      setTimeout(nextQuestion,1500);
      return;
    }

    timeLeft--;
    document.getElementById("timer").innerText="Time: "+timeLeft;

  },1000);
}

// NEXT
function nextQuestion(){
  current++;

  if(current>=10){
    endGame();
    return;
  }

  loadQuestion();
}

// PROGRESS
function updateProgress(){
  document.getElementById("progress").style.width=(current*10)+"%";
}

// END GAME
function endGame(){
  clearInterval(timer);

  document.getElementById("gameArea").classList.add("hidden");
  document.getElementById("gameOver").classList.remove("hidden");
  document.getElementById("finalScore").innerText="Your Score: "+score;

  confetti({particleCount:150,spread:70});
}

// RESTART
function restartGame(){
  score=0;
  current=0;

  document.getElementById("gameOver").classList.add("hidden");
  document.getElementById("startScreen").style.display="block";
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