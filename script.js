const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

const levelTitle = document.getElementById("levelTitle");
const levelProgress = document.getElementById("levelProgress");
const missionTitle = document.getElementById("missionTitle");
const missionText = document.getElementById("missionText");
const scoreValue = document.getElementById("scoreValue");
const formulaText = document.getElementById("formulaText");
const guideLineBox = document.getElementById("guideLineBox");
const guideFormulaText = document.getElementById("guideFormulaText");
const feedbackBox = document.getElementById("feedbackBox");

const slopeSlider = document.getElementById("slopeSlider");
const interceptSlider = document.getElementById("interceptSlider");
const slopeValue = document.getElementById("slopeValue");
const interceptValue = document.getElementById("interceptValue");
const slopeMinus = document.getElementById("slopeMinus");
const slopePlus = document.getElementById("slopePlus");
const interceptMinus = document.getElementById("interceptMinus");
const interceptPlus = document.getElementById("interceptPlus");
const runButton = document.getElementById("runButton");
const hintButton = document.getElementById("hintButton");
const retryButton = document.getElementById("retryButton");

const world = {
  minX: -10,
  maxX: 10,
  minY: -10,
  maxY: 10,
  padding: 38
};

const levels = [
  {
    title: "1단계: y절편 찾기",
    type: "point",
    target: { x: 0, y: 3 },
    startA: 1,
    startB: 0,
    mission: "출구는 y축 위 (0, 3)에 있어요. 그래프가 y축을 만나는 높이 b를 맞춰 보세요.",
    hint: "x가 0이면 y = b입니다. 그래서 b를 3으로 맞추면 지나갈 수 있어요."
  },
  {
    title: "2단계: 기울기 느끼기",
    type: "point",
    target: { x: 4, y: 4 },
    startA: 0,
    startB: 0,
    mission: "보물은 (4, 4)에 있어요. 원점을 지나면서 오른쪽으로 갈수록 1칸씩 올라가는 그래프를 만들어 보세요.",
    hint: "b가 0일 때, x가 4가 되면 y도 4가 되어야 하므로 a는 1입니다."
  },
  {
    title: "3단계: 기울기와 절편 함께 보기",
    type: "point",
    target: { x: 4, y: 5 },
    startA: 1,
    startB: 0,
    mission: "출구는 (4, 5)에 있어요. y절편을 먼저 정하고, 기울기로 목표 높이에 맞춰 보세요.",
    hint: "예를 들어 b = 1이면 y = ax + 1입니다. x = 4에서 y = 5가 되려면 a는 1이에요."
  },
  {
    title: "4단계: 목표 좌표 통과하기",
    type: "point",
    target: { x: 3, y: 7 },
    startA: 1,
    startB: 1,
    mission: "캐릭터가 그래프를 따라 (3, 7)의 보물상자를 지나가야 해요.",
    hint: "y = ax + b에 x = 3, y = 7을 넣어 보세요. 2 x 3 + 1 = 7입니다."
  },
  {
    title: "5단계: 낮은 절편에서 출발",
    type: "point",
    target: { x: 5, y: 6 },
    startA: 0.5,
    startB: 0,
    mission: "목표는 (5, 6)에 있어요. y축을 만나는 위치와 기울기를 함께 조절하세요.",
    hint: "b = 1로 두면 5a + 1 = 6입니다. 그래서 a는 1이에요."
  },
  {
    title: "6단계: 더 가파른 그래프",
    type: "point",
    target: { x: 2, y: 7 },
    startA: 1,
    startB: 1,
    mission: "출구는 (2, 7)에 있어요. 짧은 x 이동에도 y가 많이 올라가야 합니다.",
    hint: "b = 1이면 2a + 1 = 7이므로 a는 3입니다."
  },
  {
    title: "7단계: 음의 기울기",
    type: "point",
    target: { x: 4, y: -2 },
    startA: 1,
    startB: 2,
    mission: "보물은 (4, -2)에 있어요. 오른쪽으로 갈수록 내려가는 직선을 만들어 보세요.",
    hint: "b = 2라면 4a + 2 = -2입니다. a는 -1이에요."
  },
  {
    title: "8단계: 내려가는 탈출길",
    type: "point",
    target: { x: -3, y: 5 },
    startA: 0,
    startB: 0,
    mission: "출구는 (-3, 5)에 있어요. 음의 기울기는 왼쪽으로 갈 때 그래프가 올라갑니다.",
    hint: "b = 2로 두면 -3a + 2 = 5입니다. a는 -1이에요."
  },
  {
    title: "9단계: 두 직선의 교점",
    type: "intersection",
    target: { x: 2, y: 4 },
    guide: { a: -1, b: 6 },
    startA: 1,
    startB: 0,
    mission: "분홍색 직선과 내가 만든 직선이 보물 (2, 4)에서 만나야 해요.",
    hint: "보물은 주어진 직선 y = -x + 6 위에 있어요. 내가 만든 직선도 (2, 4)를 지나게 만들면 됩니다. 예: y = x + 2"
  },
  {
    title: "10단계: 마지막 교점 탈출",
    type: "intersection",
    target: { x: -2, y: 3 },
    guide: { a: 0.5, b: 4 },
    startA: -1,
    startB: 0,
    mission: "마지막 출구는 두 직선의 교점 (-2, 3)에 있어요. 내 그래프도 그 점을 지나야 합니다.",
    hint: "x = -2, y = 3을 y = ax + b에 넣어 보세요. 예: a = -1, b = 1이면 3이 됩니다."
  }
];

let levelIndex = 0;
let score = 0;
let isRunning = false;
let animationId = null;
let runnerX = world.minX;
let runnerY = getY(1, 0, runnerX);
let reachedThisRun = false;

function getCurrentLevel() {
  return levels[levelIndex];
}

function getA() {
  return Number(slopeSlider.value);
}

function getB() {
  return Number(interceptSlider.value);
}

function getY(a, b, x) {
  return a * x + b;
}

function niceNumber(value) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1).replace(/\.0$/, "");
}

function formatFormula(a, b) {
  const bSign = b >= 0 ? "+" : "-";
  return `y = ${niceNumber(a)}x ${bSign} ${niceNumber(Math.abs(b))}`;
}

function toScreenX(x) {
  const span = world.maxX - world.minX;
  return world.padding + ((x - world.minX) / span) * (canvas.width - world.padding * 2);
}

function toScreenY(y) {
  const span = world.maxY - world.minY;
  return canvas.height - world.padding - ((y - world.minY) / span) * (canvas.height - world.padding * 2);
}

function fromScreenY(pixelY) {
  const span = world.maxY - world.minY;
  return world.minY + ((canvas.height - world.padding - pixelY) / (canvas.height - world.padding * 2)) * span;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#e5edf7";
  ctx.font = "13px Segoe UI, Arial";
  ctx.fillStyle = "#6c7890";

  for (let x = world.minX; x <= world.maxX; x += 1) {
    const sx = toScreenX(x);
    ctx.beginPath();
    ctx.moveTo(sx, world.padding);
    ctx.lineTo(sx, canvas.height - world.padding);
    ctx.stroke();
    if (x !== 0 && x % 2 === 0) {
      ctx.fillText(String(x), sx - 6, toScreenY(0) + 18);
    }
  }

  for (let y = world.minY; y <= world.maxY; y += 1) {
    const sy = toScreenY(y);
    ctx.beginPath();
    ctx.moveTo(world.padding, sy);
    ctx.lineTo(canvas.width - world.padding, sy);
    ctx.stroke();
    if (y !== 0 && y % 2 === 0) {
      ctx.fillText(String(y), toScreenX(0) + 8, sy + 4);
    }
  }

  ctx.strokeStyle = "#35435b";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(world.padding, toScreenY(0));
  ctx.lineTo(canvas.width - world.padding, toScreenY(0));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toScreenX(0), world.padding);
  ctx.lineTo(toScreenX(0), canvas.height - world.padding);
  ctx.stroke();

  drawArrow(canvas.width - world.padding, toScreenY(0), 0);
  drawArrow(toScreenX(0), world.padding, -Math.PI / 2);

  ctx.fillStyle = "#35435b";
  ctx.font = "bold 16px Segoe UI, Arial";
  ctx.fillText("x", canvas.width - world.padding + 10, toScreenY(0) + 5);
  ctx.fillText("y", toScreenX(0) - 5, world.padding - 12);
  ctx.fillText("0", toScreenX(0) + 8, toScreenY(0) + 18);
}

function drawArrow(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#35435b";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-12, -7);
  ctx.lineTo(-12, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLine(a, b, color, width, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();

  let first = true;
  for (let px = world.padding; px <= canvas.width - world.padding; px += 3) {
    const x = world.minX + ((px - world.padding) / (canvas.width - world.padding * 2)) * (world.maxX - world.minX);
    const y = getY(a, b, x);
    const py = toScreenY(y);
    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.stroke();
  ctx.restore();
}

function drawTarget() {
  const level = getCurrentLevel();
  const { x, y } = level.target;
  const sx = toScreenX(x);
  const sy = toScreenY(y);

  ctx.save();
  ctx.shadowColor = "rgba(255, 107, 107, 0.35)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = level.type === "intersection" ? "#ff6b6b" : "#ffd166";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(sx, sy, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#263347";
  ctx.font = "bold 18px Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(level.type === "intersection" ? "X" : "★", sx, sy + 1);

  ctx.fillStyle = "#35435b";
  ctx.font = "bold 14px Segoe UI, Arial";
  ctx.fillText(`(${niceNumber(x)}, ${niceNumber(y)})`, sx, sy - 28);
  ctx.restore();
}

function drawRunner(x, y) {
  const sx = toScreenX(x);
  const sy = toScreenY(y);
  const bob = Math.sin(Date.now() / 120) * 2;

  ctx.save();
  ctx.translate(sx, sy + bob);
  ctx.fillStyle = "rgba(47, 128, 237, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 20, 18, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2f80ed";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -4, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-5, -7, 2.2, 0, Math.PI * 2);
  ctx.arc(5, -7, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -2, 7, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.strokeStyle = "#2f80ed";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-7, 13);
  ctx.lineTo(-17, 25);
  ctx.moveTo(7, 13);
  ctx.lineTo(18, 24);
  ctx.stroke();
  ctx.restore();
}

function drawScene() {
  const a = getA();
  const b = getB();
  const level = getCurrentLevel();

  drawGrid();
  if (level.type === "intersection") {
    drawLine(level.guide.a, level.guide.b, "#ff6b8a", 4, [10, 7]);
  }
  drawLine(a, b, "#22b8a6", 5);
  drawTarget();
  drawRunner(runnerX, runnerY);
}

function updateUi() {
  const level = getCurrentLevel();
  const a = getA();
  const b = getB();

  levelTitle.textContent = level.title;
  levelProgress.textContent = `${levelIndex + 1} / ${levels.length}`;
  missionTitle.textContent = level.type === "intersection" ? "교점 미션" : "좌표 미션";
  missionText.textContent = level.mission;
  scoreValue.textContent = String(score);
  slopeValue.textContent = niceNumber(a);
  interceptValue.textContent = niceNumber(b);
  formulaText.textContent = formatFormula(a, b);

  if (level.type === "intersection") {
    guideLineBox.classList.remove("hidden");
    guideFormulaText.textContent = formatFormula(level.guide.a, level.guide.b);
  } else {
    guideLineBox.classList.add("hidden");
  }

  drawScene();
}

function resetRunner() {
  runnerX = world.minX;
  runnerY = getY(getA(), getB(), runnerX);
  reachedThisRun = false;
}

function setFeedback(message, state = "") {
  feedbackBox.textContent = message;
  feedbackBox.className = "feedback-box";
  if (state) feedbackBox.classList.add(state);
}

function loadLevel(index) {
  levelIndex = index;
  const level = getCurrentLevel();
  slopeSlider.value = level.startA;
  interceptSlider.value = level.startB;
  resetRunner();
  setFeedback("준비되면 달리기 버튼을 눌러 보세요.");
  updateUi();
}

function isCloseToTarget(x, y) {
  const { target } = getCurrentLevel();
  return Math.hypot(x - target.x, y - target.y) < 0.18;
}

function graphSolvesMission() {
  const a = getA();
  const b = getB();
  const level = getCurrentLevel();
  const targetY = getY(a, b, level.target.x);
  const passesTarget = Math.abs(targetY - level.target.y) <= 0.001;

  if (level.type === "point") {
    return passesTarget;
  }

  const guideY = getY(level.guide.a, level.guide.b, level.target.x);
  return passesTarget && Math.abs(guideY - level.target.y) <= 0.001;
}

function finishSuccess() {
  isRunning = false;
  score += 100;
  setFeedback("정답입니다!", "success");
  updateUi();

  setTimeout(() => {
    if (levelIndex < levels.length - 1) {
      loadLevel(levelIndex + 1);
    } else {
      setFeedback(`정답입니다! 모든 단계를 탈출했어요. 최종 점수는 ${score}점입니다.`, "success");
    }
  }, 1200);
}

function finishFail() {
  isRunning = false;
  setFeedback("기울기와 절편을 다시 생각해 보세요.", "fail");
  resetRunner();
  updateUi();
}

function runGraph() {
  if (isRunning) return;
  cancelAnimationFrame(animationId);
  isRunning = true;
  reachedThisRun = false;
  const startedAt = performance.now();
  const duration = 2800;
  const a = getA();
  const b = getB();
  const solves = graphSolvesMission();

  setFeedback("캐릭터가 그래프 위를 달리는 중입니다.");

  function animate(now) {
    const t = Math.min((now - startedAt) / duration, 1);
    runnerX = world.minX + (world.maxX - world.minX) * t;
    runnerY = getY(a, b, runnerX);

    if (solves && isCloseToTarget(runnerX, runnerY)) {
      runnerX = getCurrentLevel().target.x;
      runnerY = getCurrentLevel().target.y;
      reachedThisRun = true;
      drawScene();
      finishSuccess();
      return;
    }

    drawScene();

    if (t < 1) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    if (reachedThisRun) {
      finishSuccess();
    } else {
      finishFail();
    }
  }

  animationId = requestAnimationFrame(animate);
}

function changeSlider(slider, amount) {
  const next = Number(slider.value) + amount;
  const min = Number(slider.min);
  const max = Number(slider.max);
  const clamped = Math.max(min, Math.min(max, next));
  slider.value = String(clamped);
  resetRunner();
  updateUi();
}

function showHint() {
  score -= 20;
  setFeedback(getCurrentLevel().hint, "");
  updateUi();
}

function resizeCanvasForSharpness() {
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(420, Math.round(rect.width));
  canvas.width = size;
  canvas.height = size;
  updateUi();
}

startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  loadLevel(0);
  resizeCanvasForSharpness();
});

[slopeSlider, interceptSlider].forEach((slider) => {
  slider.addEventListener("input", () => {
    if (isRunning) return;
    resetRunner();
    updateUi();
  });
});

slopeMinus.addEventListener("click", () => changeSlider(slopeSlider, -0.5));
slopePlus.addEventListener("click", () => changeSlider(slopeSlider, 0.5));
interceptMinus.addEventListener("click", () => changeSlider(interceptSlider, -0.5));
interceptPlus.addEventListener("click", () => changeSlider(interceptSlider, 0.5));
runButton.addEventListener("click", runGraph);
hintButton.addEventListener("click", showHint);
retryButton.addEventListener("click", () => {
  cancelAnimationFrame(animationId);
  isRunning = false;
  resetRunner();
  setFeedback("다시 도전할 수 있어요. a와 b를 조절해 보세요.");
  updateUi();
});

window.addEventListener("resize", () => {
  if (!gameScreen.classList.contains("hidden")) {
    resizeCanvasForSharpness();
  }
});

loadLevel(0);
