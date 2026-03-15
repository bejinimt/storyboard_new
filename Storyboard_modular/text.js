function createTextElement(textValue, storyboard) {
  const wrapper = document.createElement("div");
  wrapper.className = "info";
  wrapper.textContent = textValue;

  const close = document.createElement("div");
  close.className = "close";
  close.textContent = "×";
  wrapper.appendChild(close);

  makeDraggable(wrapper, storyboard);

  return wrapper;
}
