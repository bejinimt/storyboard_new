// ---------------------------------------------------------
// STRG+V → Bild direkt ins Storyboard einfügen (150x150)
// ---------------------------------------------------------

document.addEventListener("paste", async (e) => {
  const items = e.clipboardData.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (!file) continue;

      const url = URL.createObjectURL(file);

      // Bild-Element erzeugen
      const el = createPastedImageElement(url);

      // Startgröße 150x150
      el.style.width = "150px";
      el.style.height = "150px";

      // Position: Mitte des Storyboards
      const rect = storyboard.getBoundingClientRect();
      el.style.left = rect.width / 2 - 75 + "px";
      el.style.top = rect.height / 2 - 75 + "px";

      storyboard.appendChild(el);
      makeDraggable(el);
    }
  }
});


// ---------------------------------------------------------
// Bild-Element für STRG+V erzeugen
// ---------------------------------------------------------
function createPastedImageElement(url) {
  const el = document.createElement("div");
  el.className = "info";

  const img = document.createElement("img");
  img.src = url;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.display = "block";

  const close = document.createElement("div");
  close.className = "close";
  close.textContent = "×";
  close.onclick = () => el.remove();

  el.appendChild(img);
  el.appendChild(close);

  return el;
}
