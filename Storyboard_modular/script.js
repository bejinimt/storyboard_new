// ---------------------------------------------------------
// Globale Variablen
// ---------------------------------------------------------
let selectedQueueItem = null;

const queue = document.getElementById("queue");
const storyboard = document.getElementById("storyboard");
const inputText = document.getElementById("eingabetext");
const pool = document.getElementById("pool");


// ---------------------------------------------------------
// STRG+ENTER → Text in Queue
// ---------------------------------------------------------
inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    e.preventDefault();
    const text = inputText.value.trim();
    if (!text) return;

    addToQueue(text, "text");
    inputText.value = "";
  }
});


// ---------------------------------------------------------
// Queue-Element erzeugen
// ---------------------------------------------------------
function addToQueue(content, type = "text") {
  const item = document.createElement("div");
  item.className = "queue-item";
  item.dataset.type = type;
  item.dataset.content = content;

  if (type === "text") {
    item.textContent = content;
  }

  if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "60px";
    item.appendChild(img);
  }

  queue.appendChild(item);
}


// ---------------------------------------------------------
// Buttons
// ---------------------------------------------------------

document.getElementById("addText").addEventListener("click", () => {
  const text = inputText.value.trim();
  if (!text) return;

  addToQueue(text, "text");
  inputText.value = "";
});

document.getElementById("addImage").addEventListener("click", () => {
  const url = prompt("Bild-URL eingeben:");
  if (!url) return;

  addToQueue(url, "image");
});

document.getElementById("clearQueue").addEventListener("click", () => {
  queue.innerHTML = "";
  selectedQueueItem = null;
});


// ---------------------------------------------------------
// Queue-Element auswählen
// ---------------------------------------------------------
queue.addEventListener("click", e => {
  const item = e.target.closest(".queue-item");
  if (!item) return;

  document.querySelectorAll(".queue-item").forEach(el => el.classList.remove("selected"));
  item.classList.add("selected");

  selectedQueueItem = item;
});


// ---------------------------------------------------------
// Storyboard-Klick → Element platzieren
// ---------------------------------------------------------
storyboard.addEventListener("click", e => {
  if (!selectedQueueItem) return;

  const type = selectedQueueItem.dataset.type;
  const content = selectedQueueItem.dataset.content;

  const el = createInfoElement(type, content);

  el.style.left = e.offsetX + "px";
  el.style.top = e.offsetY + "px";

  storyboard.appendChild(el);
  makeDraggable(el);

  selectedQueueItem.remove();
  selectedQueueItem = null;
});


// ---------------------------------------------------------
// Info-Element erzeugen
// ---------------------------------------------------------
function createInfoElement(type, content) {
  const el = document.createElement("div");
  el.className = "info";

  if (type === "text") {
    el.textContent = content;
  }

  if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    el.appendChild(img);
  }

  const close = document.createElement("div");
  close.className = "close";
  close.textContent = "×";

  // X = in den Pool verschieben
  close.onclick = () => moveToPool(el);

  el.appendChild(close);

  return el;
}


// ---------------------------------------------------------
// Draggable (mit KORREKTER Resize-Erkennung → kein Springen)
// ---------------------------------------------------------
function makeDraggable(el) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  el.addEventListener("mousedown", e => {
    if (e.target.classList.contains("close")) return;

    // KORREKT: Resize-Erkennung über BoundingClientRect
    const rect = el.getBoundingClientRect();
    const isResizing =
      e.clientX > rect.right - 20 &&
      e.clientY > rect.bottom - 20;

    if (isResizing) return;

    dragging = true;

    // KORREKT: Offset relativ zum .info-Element
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;

    el.style.left = (e.clientX - offsetX) + "px";
    el.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    document.body.style.userSelect = "";
  });
}


// ---------------------------------------------------------
// POOL-FUNKTIONALITÄT
// ---------------------------------------------------------

// Storyboard → Pool (X oder Doppelklick)
function moveToPool(el) {

  // Position speichern
  el.dataset.oldLeft = el.style.left;
  el.dataset.oldTop = el.style.top;

  el.style.position = "relative";
  el.style.left = "";
  el.style.top = "";
  el.style.width = "150px";
  el.style.height = "150px";

  pool.appendChild(el);
}

storyboard.addEventListener("dblclick", e => {
  const el = e.target.closest(".info");
  if (!el) return;
  moveToPool(el);
});

// Pool → Storyboard (Doppelklick)
pool.addEventListener("dblclick", e => {
  const el = e.target.closest(".info");
  if (!el) return;

  el.style.position = "absolute";

  // Alte Position wiederherstellen
  el.style.left = el.dataset.oldLeft || "100px";
  el.style.top = el.dataset.oldTop || "100px";

  storyboard.appendChild(el);
  makeDraggable(el);
});
