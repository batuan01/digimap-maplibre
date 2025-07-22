export function rad2deg(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function deg2rad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}