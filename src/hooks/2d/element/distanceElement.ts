import { FeatureType, LonLat, Path } from "@/types/featureTypes";
import * as turf from "@turf/turf";
import { Position } from "geojson";
import { getCoordinates } from "./getDataElement";

export interface PointNearAnySegment {
  point: Position | null;
  segment: Position[] | null;
}

export class DistanceElement {
  /**
   * Tính khoảng cách Euclidean giữa 2 điểm
   */
  static getDistance(p1: Position, p2: Position) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Trả về điểm gần nhất trên đoạn thẳng AB tới điểm P
   */
  static getClosestPointOnSegment(p: Position, a: Position, b: Position) {
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
  static isPointNearAnySegment(
    point: Position,
    lines: Position[][],
    tolerance: number
  ): PointNearAnySegment | null {
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
    if (minDistance <= tolerance) {
      return {
        point: closestPoint,
        segment: matchedSegment,
      };
    }

    return null;
  }

  static getFirstPointInPolygon(
    polygonFeature: FeatureType,
    pathFeature: FeatureType
  ) {
    const coordinatesPolygon = getCoordinates(polygonFeature.geometry);
    const coordinatesPath = getCoordinates(
      pathFeature.geometry
    ) as Position[][];

    if (!coordinatesPolygon || !coordinatesPath) return null;

    const polygon = turf.polygon(coordinatesPolygon as Position[][]);

    for (let i = 0; i < coordinatesPath.length; i++) {
      const line = coordinatesPath[i];

      for (let j = 0; j < line.length; j++) {
        const coord = line[j];
        const pt = turf.point(coord);

        if (turf.booleanPointInPolygon(pt, polygon)) {
          return coord;
        }
      }
    }

    return null; // Không có điểm nào nằm trong polygon
  }
}
