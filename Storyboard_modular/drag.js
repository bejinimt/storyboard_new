// drag.js
let currentDraggedElement = null;

function makeDraggable(el, bounds) {
  let dragging = false;
  let hasMoved = false;
  let offsetX = 0;
  let offsetY = 0;

  el.addEventListener("mousedown", e => {
    const rect = el.getBoundingClientRect();
    const resizeZone = 16;

    const inResizeCorner =
      e.clientX > rect.right - resizeZone &&
      e.clientY > rect.bottom - resizeZone;

    if (inResizeCorner) return;
    if (e.target.classList.contains("close")) return;

    dragging = true;
    hasMoved = false;
    currentDraggedElement = el;

    // Abstand Maus → Elementkante (Viewport-Koordinaten)
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;

    const dx = e.clientX;
    const dy = e.clientY;

    // Drag-Threshold
    if (!hasMoved && Math.abs(dx) < 3 && Math.abs(dy) < 3) {
      return;
    }

    if (!hasMoved) {
      // Slot freigeben, falls aus Queue
      if (currentDraggedElement.dataset.queueSlotIndex !== undefined) {
        const idx = Number(currentDraggedElement.dataset.queueSlotIndex);
        const slot = queueSlots[idx];

        if (slot) {
          slot.classList.add("empty");
          while (slot.firstChild) slot.removeChild(slot.firstChild);
        }

        delete currentDraggedElement.dataset.queueSlotIndex;
      }

      // In den Body hängen
      document.body.appendChild(currentDraggedElement);
      currentDraggedElement.style.position = "absolute";
    }

    hasMoved = true;

    // Position direkt aus Mauskoordinaten ableiten
    currentDraggedElement.style.left = (e.clientX - offsetX) + "px";
    currentDraggedElement.style.top  = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", e => {
    if (dragging && hasMoved && typeof window.handleElementDrop === "function") {
      window.handleElementDrop(currentDraggedElement, e);
    }

    dragging = false;
    currentDraggedElement = null;
    document.body.style.userSelect = "";
  });
}
