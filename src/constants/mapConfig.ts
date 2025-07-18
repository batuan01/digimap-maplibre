export const LOCAL_STORAGE_KEY = "draw-data";
export const ZOOM_OVERVIEW = 17;
export const DEFAULT_COORDINATES = [139.7977668232757, 35.63168006521393];

export const calculateImageBounds = (lngLat, size = 0.001) => {
  const { lng, lat } = lngLat;
  return [
    [lng - size, lat + size],
    [lng + size, lat + size],
    [lng + size, lat - size],
    [lng - size, lat - size],
  ];
};

export const calculateImageBoundsWithAspect = (lngLat, size, aspectRatio) => {
  const { lng, lat } = lngLat;

  const halfWidth = size;
  const halfHeight = size / aspectRatio;

  return [
    [lng - halfWidth, lat + halfHeight], // top-left
    [lng + halfWidth, lat + halfHeight], // top-right
    [lng + halfWidth, lat - halfHeight], // bottom-right
    [lng - halfWidth, lat - halfHeight], // bottom-left
  ];
};

export function generateUUID() {
  return "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
