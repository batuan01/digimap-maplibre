import { Feature, Point } from "geojson";
import { Map } from "maplibre-gl";

export class ActionLoadLabel {
  static textLabels(map: Map) {
    if (!map.getSource("source-labels-text")) {
      map.addSource("source-labels-text", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    // Add symbol layer
    if (!map.getLayer("layer-labels-text")) {
      map.addLayer({
        id: "layer-labels-text",
        type: "symbol",
        source: "source-labels-text",
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          // "text-size": 12, // 👈 Luôn giữ cố định kích thước
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            10,
            15.5,
            11,
            16,
            12,
            16.5,
            13,
            17,
            14,
            17.5,
            15,
            18,
            16,
          ],
          "text-anchor": "top",
          // "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1,
          // 👇 dịch label lên phía trên (gần giống chiều cao khối)
          "text-translate": ["literal", [0, -20]], // dịch lên theo pixel (tạm)
        },
      });
    }
  }

  static async imageLabels(map: Map) {
    // 1. Thêm source
    if (!map.getSource("source-labels-image")) {
      map.addSource("source-labels-image", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    // 2. Thêm layer
    if (!map.getLayer("layer-labels-image")) {
      map.addLayer({
        id: "layer-labels-image",
        type: "symbol",
        source: "source-labels-image",
        layout: {
          "icon-image": ["get", "id"], // mỗi feature có image riêng
          "icon-size": 1,
          "icon-anchor": "bottom",
          "icon-allow-overlap": false, // tự ẩn nếu chạm nhau
          "icon-ignore-placement": false,
          // "icon-size": [
          //   "interpolate",
          //   ["linear"],
          //   ["zoom"],
          //   15,
          //   0.5, // Zoom 15 thì nhỏ
          //   17,
          //   1.0, // Zoom 17 thì bình thường
          //   19,
          //   1.5, // Zoom 19 thì to hơn
          // ],
        },
      });
    }
  }

  static loadAllImagesLabel = async (map: Map, features: Feature<Point>[]) => {
    const featuresHasIcon = features.filter((f) => f.properties?.labelImage);
    for (const feature of featuresHasIcon) {
      const id = feature.properties?.id;
      const url = feature.properties?.labelImage;
      if (!url) continue;

      const canvasImage = await this.loadImageAndConvertToCanvas(url);

      if (!map.hasImage(id)) {
        map.addImage(id, canvasImage as any, { pixelRatio: 2 }); // pixelRatio để ảnh rõ hơn
      }
    }
  };

  static loadImageAndConvertToCanvas(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvasWidth = 100;
        const canvasHeight = 50;

        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d");

        if(!ctx) return;
        // Bo tròn
        const radius = 10;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvasWidth - radius, 0);
        ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, radius);
        ctx.lineTo(canvasWidth, canvasHeight - radius);
        ctx.quadraticCurveTo(
          canvasWidth,
          canvasHeight,
          canvasWidth - radius,
          canvasHeight
        );
        ctx.lineTo(radius, canvasHeight);
        ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();

        // object-fit: cover
        const aspectRatio = img.width / img.height;
        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (aspectRatio > 1) {
          drawHeight = canvasHeight;
          drawWidth = canvasHeight * aspectRatio;
          offsetX = -(drawWidth - canvasWidth) / 2;
        } else {
          drawWidth = canvasWidth;
          drawHeight = canvasWidth / aspectRatio;
          offsetY = -(drawHeight - canvasHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        resolve(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
      };

      img.onerror = reject;
      img.src = url;
    });
  }
}

// labelFeatures.slice(0, 100).forEach((f) => {
//   const img = document.createElement("img");
//   img.src =
//     "https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg";
//   img.style.width = "40px";
//   img.style.height = "40px";
//   img.style.borderRadius = "5px"; // nếu muốn bo tròn
//   img.style.border = "1px solid white"; // tuỳ chọn

//   // Thêm marker vào map
//   new maplibregl.Marker({ element: img })
//     .setLngLat(f.geometry.coordinates)
//     .addTo(map);
// });
