// queue.js

// Anzahl der Zeilen in der Queue
const QUEUE_SIZE = 10;
const queueSlots = [];

/**
 * Initialisiert die Queue-Spalte mit festen Slots.
 */
function initQueue() {
  const queue = document.getElementById("queue");
  queue.innerHTML = "<b>Warteschlange:</b><br><br>";

  for (let i = 0; i < QUEUE_SIZE; i++) {
    const slot = document.createElement("div");
    slot.className = "queue-slot empty";
    slot.dataset.index = i;
    queue.appendChild(slot);
    queueSlots.push(slot);
  }
}

/**
 * Platziert ein neues Element in der ersten freien Queue-Zeile.
 * Gibt true zurück, wenn erfolgreich, sonst false.
 */
function placeInQueue(el) {
  const freeSlot = queueSlots.find(slot => slot.children.length === 0);
  if (!freeSlot) {
    console.warn("Queue ist voll – Element wird nicht platziert.");
    return false;
  }

  freeSlot.classList.remove("empty");
  freeSlot.appendChild(el);

  // Element im Slot fixieren
  el.style.position = "absolute";
  el.style.left = "2px";
  el.style.top = "2px";

  // Slot-Index merken
  el.dataset.queueSlotIndex = freeSlot.dataset.index;

  // Draggable relativ zum Slot
  makeDraggable(el, el.parentElement);

  return true;
}

/**
 * Wird von drag.js beim Loslassen aufgerufen.
 * Prüft, ob ein Queue-Element über dem Storyboard losgelassen wurde.
 */
window.handleElementDrop = function(el, e) {
  if (!el.dataset.queueSlotIndex) return;

  const sb = document.getElementById("storyboard");
  const sbRect = sb.getBoundingClientRect();

  // Position vor dem Verschieben merken
  const rectBefore = el.getBoundingClientRect();

  const isOverStoryboard =
    rectBefore.left < sbRect.right &&
    rectBefore.right > sbRect.left &&
    rectBefore.top < sbRect.bottom &&
    rectBefore.bottom > sbRect.top;

  if (!isOverStoryboard) return;

  moveElementFromQueueToStoryboard(el, sb, sbRect, rectBefore);
};

let zCounter = 10;

/**
 * Verschiebt ein Element aus der Queue ins Storyboard
 * und gibt den Slot wieder frei.
 */
function moveElementFromQueueToStoryboard(el, storyboard, sbRect, rectBefore) {
  // Slot freigeben
  const idx = el.dataset.queueSlotIndex;
  if (idx !== undefined) {
    const slot = queueSlots[Number(idx)];
    if (slot) {
      slot.classList.add("empty");

      // Slot WIRKLICH leeren (auch Textknoten!)
      while (slot.firstChild) slot.removeChild(slot.firstChild);
    }
    delete el.dataset.queueSlotIndex;
  }

  // Element ins Storyboard verschieben
  storyboard.appendChild(el);

  // Position relativ zum Storyboard setzen
  el.style.position = "absolute";
  el.style.left = (rectBefore.left - sbRect.left) + "px";
  el.style.top = (rectBefore.top - sbRect.top) + "px";

  // Draggable relativ zum Storyboard aktivieren
  makeDraggable(el, storyboard);

  // Element nach vorne holen
  el.style.zIndex = ++zCounter;
}

// Funktionen global verfügbar machen
window.initQueue = initQueue;
window.placeInQueue = placeInQueue;
