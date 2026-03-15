function attachResize(wrapper, img, canvas) {
  wrapper.originalImage = img;

  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  wrapper.addEventListener("mouseup", ev => {
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;

    if (w <= 0 || h <= 0) return;

    let newW = w;
    let newH = h;

    if (ev.shiftKey) {
      const aspect = img.width / img.height;

      if (w / h > aspect) {
        newW = h * aspect;
        wrapper.style.width = newW + "px";
      } else {
        newH = w / aspect;
        wrapper.style.height = newH + "px";
      }
    }

    const finalW = wrapper.clientWidth;
    const finalH = wrapper.clientHeight;

    canvas.width = finalW;
    canvas.height = finalH;

    const ctx2 = canvas.getContext("2d");
    ctx2.drawImage(img, 0, 0, finalW, finalH);
  });
}
