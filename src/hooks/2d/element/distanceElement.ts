import { FeatureType, LonLat, Path } from "@/types/featureTypes";
import * as turf from "@turf/turf";
import { Position } from "geojson";

interface PointNearAnySegment {
  point: LonLat;
  segment: Path;
}

export class DistanceElement {
  /**
   * Tính khoảng cách Euclidean giữa 2 điểm
   */
  static getDistance(p1: LonLat, p2: LonLat) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Trả về điểm gần nhất trên đoạn thẳng AB tới điểm P
   */
  static getClosestPointOnSegment(p: LonLat, a: LonLat, b: LonLat): LonLat {
    const [x, y] = p;
    const [x1, y1] = a;
    const [x2, y2] = b;

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) return a; // A trùng B

    const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    const tClamped = Math.max(0, Math.min(1, t));

    return [x1 + tClamped * dx, y1 + tClamped * dy];
  }

  /**
   * Kiểm tra điểm có gần bất kỳ đoạn thẳng nào không
   * @param {number[]} point - [lng, lat]
   * @param {number[][][]} lines - array các line [[p1, p2, p3], ...]
   * @param {number} tolerance - ngưỡng khoảng cách
   * @returns {boolean}
   */
  static isPointNearAnySegment({
    point,
    lines,
    distance,
  }: {
    point: LonLat;
    lines: Path[];
    distance: number;
  }): PointNearAnySegment | null {
    let closestPoint = null;
    let minDistance = Infinity;
    let matchedSegment = null;

    for (const line of lines) {
      for (let i = 0; i < line.length - 1; i++) {
        const a = line[i];
        const b = line[i + 1];
        const candidate = this.getClosestPointOnSegment(point, a, b);
        const dist = this.getDistance(point, candidate);

        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = candidate;
          matchedSegment = [a, b]; // ghi nhớ đoạn line gần nhất
        }
      }
    }

    // Chỉ trả về nếu gần trong khoảng tolerance
    if (minDistance <= distance) {
      return {
        point: closestPoint as LonLat,
        segment: matchedSegment as Path,
      };
    }

    return null;
  }

  static getFirstPointInPolygon(
    polygonFeature: FeatureType,
    pathFeature: FeatureType
  ) {
    const polygon = turf.polygon(
      polygonFeature.geometry.coordinates as Position[][]
    );
    const geometry = pathFeature.geometry;

    for (let i = 0; i < geometry.coordinates.length; i++) {
      const line = geometry.coordinates[i];

      for (let j = 0; j < line.length; j++) {
        const coord = line[j];
        const pt = turf.point(coord as Position);

        if (turf.booleanPointInPolygon(pt, polygon)) {
          return coord;
        }
      }
    }

    return null; // Không có điểm nào nằm trong polygon
  }
}
