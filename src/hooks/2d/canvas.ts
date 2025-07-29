export function completelyDisableDragging(map: maplibregl.Map) {
  // map.dragPan.disable();

  // const canvas = map.getCanvas();

  // function preventDefault(e: MouseEvent | TouchEvent) {
  //   if (e instanceof MouseEvent) {
  //     if (e.button !== 0) return; // chỉ chặn chuột trái
  //   }

  //   e.preventDefault();
  //   e.stopPropagation();
  // }

  // canvas.addEventListener("mousedown", preventDefault, { passive: false });
  // canvas.addEventListener("touchstart", preventDefault, { passive: false });
  // canvas.addEventListener("touchmove", preventDefault, { passive: false });

  // (map as any)._customDragBlockers = preventDefault;
}

export function enableDraggingAgain(map: maplibregl.Map) {
  map.dragPan.enable();

  const canvas = map.getCanvas();
  const preventDefault = (map as any)._customDragBlockers;

  if (preventDefault) {
    canvas.removeEventListener("mousedown", preventDefault);
    canvas.removeEventListener("touchstart", preventDefault);
    canvas.removeEventListener("touchmove", preventDefault);
  }
}
