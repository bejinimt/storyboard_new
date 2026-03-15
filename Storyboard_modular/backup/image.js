function createImageElement(img, storyboard) {
  const wrapper = document.createElement("div");
  wrapper.className = "info";

  const canvas = document.createElement("canvas");
  wrapper.appendChild(canvas);

  const close = document.createElement("div");
  close.className = "close";
  close.textContent = "×";
  wrapper.appendChild(close);

  attachResize(wrapper, img, canvas);
  makeDraggable(wrapper, storyboard);

  return wrapper;
}

function createImageElementFromData(dataURL, storyboard) {
  const img = new Image();
  img.src = dataURL;

  const wrapper = document.createElement("div");
  wrapper.className = "info";

  const canvas = document.createElement("canvas");
  wrapper.appendChild(canvas);

  const close = document.createElement("div");
  close.className = "close";
  close.textContent = "×";
  wrapper.appendChild(close);

  img.onload = () => {
    attachResize(wrapper, img, canvas);
  };

  makeDraggable(wrapper, storyboard);

  return wrapper;
}
