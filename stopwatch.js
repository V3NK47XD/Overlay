let mode = 10 * 60; // default 10min
let timer = mode;
let interval = null;
let running = false;

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const mode10Btn = document.getElementById("mode10");
const mode30Btn = document.getElementById("mode30");
const checkboxes = document.querySelectorAll(".timeCheck");

// store checkbox states separately
let sessions = {
  10: Array(10).fill(false),
  30: Array(10).fill(false)
};
let currentMode = 10;

function updateDisplay() {
  let hrs = Math.floor(timer / 3600);
  let mins = Math.floor((timer % 3600) / 60);
  let secs = timer % 60;
  display.textContent = `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function startTimer() {
  if (running) return;
  running = true;
  interval = setInterval(() => {
    if (timer > 0) {
      timer--;
      updateDisplay();
    } else {
      clearInterval(interval);
      running = false;
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  running = false;
}

function resetTimer() {
  timer = mode;
  updateDisplay();
  running = false;
  clearInterval(interval);
}

function loadCheckboxes() {
  sessions[currentMode].forEach((val, i) => {
    checkboxes[i].checked = val;
  });
}

function saveCheckboxes() {
  checkboxes.forEach((cb, i) => {
    sessions[currentMode][i] = cb.checked;
  });
}

// checkbox change listener
checkboxes.forEach(cb => cb.addEventListener('change', saveCheckboxes));

// mode buttons
mode10Btn.addEventListener("click", () => {
  saveCheckboxes();
  currentMode = 10;
  mode = 10 * 60;
  timer = mode;
  pauseTimer();     // pause the clock
  resetTimer();     // reset display
  loadCheckboxes();
});

mode30Btn.addEventListener("click", () => {
  saveCheckboxes();
  currentMode = 30;
  mode = 30 * 60;
  timer = mode;
  pauseTimer();     // pause the clock
  resetTimer();     // reset display
  loadCheckboxes();
});


startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
loadCheckboxes();
