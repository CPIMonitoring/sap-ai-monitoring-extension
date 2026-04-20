const output = document.getElementById("output");

document.getElementById("loginBtn").onclick = () => {
  chrome.tabs.create({ url: CONFIG.API_BASE + "/login" });
};

document.getElementById("loadBtn").onclick = async () => {
  const res = await fetch(CONFIG.API_BASE + "/iflows");
  const data = await res.json();

  render(data.d.results);
};

document.getElementById("failBtn").onclick = async () => {
  const res = await fetch(CONFIG.API_BASE + "/failed");
  const data = await res.json();

  render(data.d.results, true);
};

document.getElementById("aiBtn").onclick = async () => {
  const res = await fetch(CONFIG.API_BASE + "/ai/fix-suggestions");
  const data = await res.json();

  output.innerHTML = data.map(i => `
    <div class="card">
      <b>${i.iflow}</b><br/>
      ❌ ${i.error}<br/>
      💡 ${i.suggestion}
    </div>
  `).join("");
};

function render(items, showRetry = false) {
  output.innerHTML = "";

  items.forEach(i => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>${i.Name || i.iflow}</b><br/>
      ${i.errorMessage || ""}
      ${showRetry ? `<button onclick="retry('${i.MessageGuid}')">Retry</button>` : ""}
    `;

    output.appendChild(div);
  });
}

async function retry(id) {
  await fetch(CONFIG.API_BASE + "/retry-smart/" + id, { method: "POST" });
  alert("Retry triggered");
}