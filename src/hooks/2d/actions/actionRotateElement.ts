import { AppGlobals } from "@/lib/appGlobals";
import { FeatureCollectionType, FeatureType } from "@/types/featureTypes";
import * as turf from "@turf/turf";
import { Feature, Point, Position } from "geojson";
import { Map, MapMouseEvent } from "maplibre-gl";
import { getSourceElement } from "../element/getDataElement";
import { isImageElement } from "../element/typeChecks";
import { ActionBoundingBox } from "./actionBoundingBox";
import { ActionHandleDragging } from "./actionHandleDragging";
import { LayerActions } from "./actionLayer";
import { ActionLoadImage } from "./actionLoadImage";
import { ActionSetData } from "./actionSetData";

export class ActionRotateElement {
  static handle: Feature<Point, { type: string }> | null = null;
  static startAngle: number | null = null;
  static center: Position | null = null;
  static polygonFeature: FeatureType | null = null;
  static map: Map | null = null;

  static setup(map: Map, polygonFeature: FeatureType) {
    this.map = map;
    this.polygonFeature = polygonFeature;
    if (isImageElement(polygonFeature)) {
      const convertedFeature = ActionLoadImage.convertPoligon(polygonFeature);
      this.center = turf.centroid(convertedFeature).geometry.coordinates;
    } else {
      this.center = turf.centroid(polygonFeature).geometry.coordinates;
    }

    this.bindEvents();
  }

  static addHandle(map: Map, polygonFeature: FeatureType) {
    if (!polygonFeature || !map) return;

    const bboxPolygons =
      ActionBoundingBox.getMinimumRotatedBBox(polygonFeature);
    if (!bboxPolygons) return;
    const coords = bboxPolygons.geometry.coordinates[0];
    const firstPoint = coords[0];
    const secondPoint = coords[1];

    const midX = (firstPoint[0] + secondPoint[0]) / 2;
    const midY = (firstPoint[1] + secondPoint[1]) / 2;

    const dx = secondPoint[0] - firstPoint[0];
    const dy = secondPoint[1] - firstPoint[1];
    const length = Math.sqrt(dx * dx + dy * dy);
    const normal = [dy / length, -dx / length];

    const distance = turf.distance(firstPoint, secondPoint, {
      units: "meters",
    });
    const offsetMeters = distance / 6;
    const offsetLng = normal[0] * (offsetMeters / 111320);
    const offsetLat = normal[1] * (offsetMeters / 111320);
    const handleCoord = [midX + offsetLng, midY + offsetLat];

    this.handle = turf.point(handleCoord, { type: "rotate-handle" });

    const data = {
      type: "FeatureCollection",
      features: [this.handle],
    } as FeatureCollectionType;

    const source = getSourceElement(map, "rotate-handle");

    if (source) {
      source.setData(data);
    } else {
      map.addSource("rotate-handle", {
        type: "geojson",
        data,
      });

      map.addLayer({
        id: "rotate-handle-layer",
        type: "circle",
        source: "rotate-handle",
        paint: {
          "circle-radius": 6,
          "circle-color": "#00f",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    }
  }

  static bindEvents() {
    if (!this.map) return;
    this.map.on("mousedown", this.onMouseDown);
  }

  static onMouseDown = (e: MapMouseEvent) => {
    if (!this.map || !this.handle) return;
    const point = [e.lngLat.lng, e.lngLat.lat];
    const pt = turf.point(point);

    if (this.map.getLayer("rotate-handle-layer")) {
      const featuresHandles = this.map.queryRenderedFeatures(e.point, {
        layers: ["rotate-handle-layer"],
      });

      if (featuresHandles.length === 0) return;
    }

    const isOnHandle = turf.booleanPointInPolygon(
      pt,
      turf.buffer(this.handle, 0.0002, { units: "degrees" }) as any
    );
    if (!isOnHandle) return;

    this.map.getCanvas().style.cursor = "grabbing";
    this.map.dragPan.disable();

    this.startAngle = this.angleTo(point);

    this.map.on("mousemove", this.onMouseMove);
    this.map.once("mouseup", this.onMouseUp);
    ActionBoundingBox.clearBoundingBox(this.map, "selected");
    ActionHandleDragging.removeHandlesPoint(this.map);
  };

  static onMouseMove = (e: MapMouseEvent) => {
    if (
      !this.map ||
      !this.startAngle ||
      !this.polygonFeature ||
      !this.center ||
      !this.handle
    )
      return;

    const currentPoint = [e.lngLat.lng, e.lngLat.lat];
    const currentAngle = this.angleTo(currentPoint);
    const angleDelta = currentAngle - this.startAngle;
    this.startAngle = currentAngle;

    this.rotateByAngle(this.map, this.polygonFeature, angleDelta);
  };

  static onMouseUp = () => {
    if (!this.map || !this.polygonFeature) return;
    this.map.getCanvas().style.cursor = "";
    this.map.dragPan.enable();
    this.map.off("mousemove", this.onMouseMove);

    const feature = isImageElement(this.polygonFeature)
      ? ActionLoadImage.convertPoligon(this.polygonFeature)
      : this.polygonFeature;

    ActionBoundingBox.drawBoundingBox(feature, this.map, "selected");
    ActionHandleDragging.newHandlesPoint(this.map, this.polygonFeature);
    AppGlobals.setDataToStore(this.polygonFeature);
  };

  static updateHandle(rotatedPoint = this.handle) {
    if (!this.map) return;
    const source = getSourceElement(this.map, "rotate-handle");
    if (source && rotatedPoint) {
      source.setData({
        type: "FeatureCollection",
        features: [rotatedPoint],
      });
    }
  }

  static destroy(map: Map) {
    const sourceId = "rotate-handle";
    const layerId = "rotate-handle-layer";

    LayerActions.remove(map, sourceId, layerId);
  }

  static angleTo(point: Position) {
    if (!this.center) return 0;
    const dx = point[0] - this.center[0];
    const dy = point[1] - this.center[1];
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  static rotateByAngle(
    map: Map,
    polygonFeature: FeatureType,
    angleDelta: number
  ) {
    this.map = map;
    this.polygonFeature = polygonFeature;
    const sourceId = LayerActions.findFeatureSourceId(map, polygonFeature);

    if (isImageElement(polygonFeature)) {
      const convertedFeature = ActionLoadImage.convertPoligon(polygonFeature);
      this.center = turf.centroid(convertedFeature).geometry.coordinates;
    } else {
      this.center = turf.centroid(polygonFeature).geometry.coordinates;
    }

    if (!this.polygonFeature || !this.center) return;

    if (isImageElement(this.polygonFeature)) {
      const convertedFeature = ActionLoadImage.convertPoligon(
        this.polygonFeature
      );
      const rotatedCoords = turf.transformRotate(
        convertedFeature,
        -angleDelta,
        {
          pivot: this.center,
        }
      );
      const convertedImage = ActionLoadImage.convertImage(rotatedCoords);
      this.polygonFeature.geometry.coordinates =
        convertedImage.geometry.coordinates;
    } else {
      const rotated = turf.transformRotate(this.polygonFeature, -angleDelta, {
        pivot: this.center,
        mutate: false,
      });
      this.polygonFeature = rotated;
    }

    if (this.handle) {
      this.handle = turf.transformRotate(this.handle, -angleDelta, {
        pivot: this.center,
        mutate: false,
      });
      this.updateHandle(this.handle);
    }

    ActionSetData.setSelectedData(map, this.polygonFeature, sourceId);

    return this.polygonFeature;
  }
}
