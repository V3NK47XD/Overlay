

window.addEventListener("load", () => {
  document.querySelector(".back").style.opacity = "1";
  document.querySelector("body").style.backgroundColor = "rgba(0, 0, 0, 0.7)";
});

async function loadTimePercent() {
  const negativePercentage = await window.api.getNegativePercent();
  const positive = Math.max(0, Math.min(100, 100 - negativePercentage));

  const mid = positive;
  const left = Math.max(0, mid - 5);
  const right = Math.min(100, mid + 5);

  const gradient = document.getElementById("timeGradient");
  const text = document.getElementById("positiveText");

  gradient.style.background = `
    linear-gradient(
      90deg,
      rgba(0, 255, 13, 1) 0%,
      rgba(0, 255, 13, 1) ${left}%,
      rgba(221, 255, 0, 1) ${mid}%,
      rgba(255, 0, 0, 1) ${right}%,
      rgba(255, 0, 0, 1) 100%
    )
  `;

  text.textContent = positive + "%";
}
loadTimePercent();



async function loadTimeRecords() {
  const records = await window.api.getTimeRecords();

  const list = document.getElementById("recordList");
  list.innerHTML = "";

  if (!records || Object.keys(records).length === 0) {
    list.innerHTML = "<li>😴 No records yet</li>";
    return;
  }

  // Helper to convert hh:mm:ss to total seconds
  const timeToSeconds = (t) => {
    const [h, m, s] = t.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  // Sort by total seconds descending
  const sortedRecords = Object.entries(records).sort(
    (a, b) => timeToSeconds(b[1]) - timeToSeconds(a[1])
  );

  sortedRecords.forEach(([app, time]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${app}</span>
      <span>${time}</span>
    `;
    list.appendChild(li);
  });
}

loadTimeRecords();

