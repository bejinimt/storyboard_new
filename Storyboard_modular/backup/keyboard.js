function initKeyboard() {
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();

      const textarea = document.getElementById("text");
      const storyboard = document.getElementById("storyboard");

      const value = textarea.value.trim();
      if (!value) return;

      const el = createTextElement(value, storyboard);

      // NEU: in die Queue stellen statt direkt ins Storyboard
      const placed = placeInQueue(el);
      if (!placed) {
        // Fallback: wenn Queue voll, direkt ins Storyboard
        storyboard.appendChild(el);
        placeElement(el);
      }

      textarea.value = "";
    }
  });
}

window.initKeyboard = initKeyboard;
