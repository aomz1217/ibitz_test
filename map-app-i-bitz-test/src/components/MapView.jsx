import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Typography, CircularProgress, Box } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function MapView({ filter, viewMode, showOnlyFRP }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiresInViewport = async () => {
    if (!map.current) return;
    const bounds = map.current.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const batchSize = 1000;
    const maxBatch = 5;
    let allFeatures = [];
    setIsLoading(true);

    for (let i = 0; i < maxBatch; i++) {
      const offset = i * batchSize;
      const url = `https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?bbox=${bbox.join(
        ","
      )}&limit=${batchSize}&offset=${offset}&api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC`;

      try {
        const res = await axiosInstance.get(url); 
        const features = res.data.features.map((f) => ({
          ...f.properties,
          coordinates: f.geometry.coordinates,
        }));
        allFeatures.push(...features);

        if (features.length < batchSize) break;
      } catch (err) {
        console.error("Error loading batch:", err);
        break;
      }
    }

    setData(allFeatures);
    setIsLoading(false);
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [100.5, 13.7],
      zoom: 7,
      minZoom: 4,
      maxZoom: 15,
    });

    map.current.on("load", () => {
      map.current.addSource("fires", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.current.addLayer({
        id: "heatmap",
        type: "heatmap",
        source: "fires",
        maxzoom: 15,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "brightness"],
            0,
            0,
            500,
            1,
          ],
          "heatmap-intensity": 1,
          "heatmap-radius": 20,
          "heatmap-opacity": 0.6,
        },
      });

      map.current.addLayer({
        id: "circles",
        type: "circle",
        source: "fires",
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "frp"], -1], 
            -1,
            "#cccccc", 
            0,
            "#ffff66", 
            10,
            "#ff9900", 
            50,
            "#ff0000", 
          ],
        },
      });

    
      map.current.setLayoutProperty("heatmap", "visibility", "none");

   
      fetchFiresInViewport();
    });

    map.current.on("moveend", fetchFiresInViewport);
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const geojson = {
      type: "FeatureCollection",
      features: data
        .filter(
          (f) => f.coordinates?.length === 2 && (!showOnlyFRP || f.frp != null)
        )
        .map((f) => ({
          type: "Feature",
          properties: f,
          geometry: { type: "Point", coordinates: f.coordinates },
        })),
    };

    const source = map.current.getSource("fires");
    if (source) source.setData(geojson);
  }, [data, showOnlyFRP]);

 
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const filters = [
      "all",
      [">=", ["coalesce", ["get", "brightness"], 0], filter.minBrightness],
      [">=", ["coalesce", ["get", "frp"], 0], filter.minFrp],
    ];

    if (filter.search?.trim()) {
      filters.push(["==", ["get", "ct_en"], filter.search.trim()]);
    }

    ["circles", "heatmap"].forEach((layer) => {
      if (map.current.getLayer(layer)) {
        map.current.setFilter(layer, filters);
        map.current.setLayoutProperty(
          layer,
          "visibility",
          viewMode === "heatmap"
            ? layer === "heatmap"
              ? "visible"
              : "none"
            : layer === "circles"
            ? "visible"
            : "none"
        );
      }
    });
  }, [filter, viewMode]);

 
  useEffect(() => {
    if (!map.current) return;

    const onClick = (e) => {
      const props = e.features[0].properties;
      const coords = e.features[0].geometry.coordinates.slice();
      new mapboxgl.Popup()
        .setLngLat(coords)
        .setDOMContent(createPopup(props))
        .addTo(map.current);
    };

    map.current.on("click", "circles", onClick);
    map.current.on("mouseenter", "circles", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "circles", () => {
      map.current.getCanvas().style.cursor = "";
    });

    return () => {
      map.current.off("click", "circles", onClick);
    };
  }, []);

  const createPopup = (props) => {
    const container = document.createElement("div");
    const root = document.createElement("div");
    container.appendChild(root);
    ReactDOM.render(
      <div style={{ minWidth: 200 }}>
        <Typography variant="subtitle1">
          Country: {props.ct_en || "-"}
        </Typography>
        <Typography variant="body2">
          Latitude: {props.latitude || props.lat || "-"}
        </Typography>
        <Typography variant="body2">
          Longitude: {props.longitude || props.lon || "-"}
        </Typography>
        <Typography variant="body2">
          Address: {props.village || "-"} , {props.tambol || "-"} ,{" "}
          {props.amphoe || "-"} , {props.changwat || "-"}
        </Typography>
        <Typography variant="body2">Note: {props.lu_name || "-"}</Typography>
        <Typography variant="body2">
          Brightness: {props.brightness || "-"}
        </Typography>
        <Typography variant="body2">
          FRP:{" "}
          {props.frp != null
            ? `${props.frp} ( ${
                props.frp < 10
                  ? "ความเสี่ยงต่ำ"
                  : props.frp <= 50
                  ? "ความเสี่ยงปานกลาง"
                  : "ความเสี่ยงสูง"
              } )`
            : "-"}
        </Typography>
        <Typography variant="body2">
          DateTime:{" "}
          {props.th_date +
            " " +
            props.th_time.slice(0, 2) +
            ":" +
            props.th_time.slice(2, 4) || "-"}
        </Typography>
      </div>,
      root
    );
    return container;
  };

  return (
    <Box sx={{ height: "63vh", display: "flex", flexDirection: "column" }}>
      <Box
        ref={mapContainer}
        sx={{
          flexGrow: 1,
          position: "relative",
          width: "100%",
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "calc(50% + 120px)", 
              transform: "translate(-50%, -50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backgroundColor: "rgba(255,255,255,0.85)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 4,
          fontSize: "0.875rem",
          px: 3,
          py: 2,
          backgroundColor: "#f8f8f8",
          borderTop: "1px solid #ddd",
        }}
      >
        <Box sx={{ maxWidth: 400 }}>
          <Typography variant="subtitle2" gutterBottom>
            FRP (Fire Radiative Power)
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#cccccc",
                mr: 1,
              }}
            />
            <Typography variant="body2">
              FRP ไม่ระบุ → ประเมินความอันตรายไม่ได้
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ffff66",
                mr: 1,
              }}
            />
            <Typography variant="body2">
              FRP &lt; 10 → ความร้อนต่ำ อาจเป็นควันหรือไฟเล็กน้อย
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff9900",
                mr: 1,
              }}
            />
            <Typography variant="body2">
              FRP 10–50 → ไฟระดับกลาง ควรติดตามอย่างใกล้ชิด
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff0000",
                mr: 1,
              }}
            />
            <Typography variant="body2">
              FRP &gt; 50 → ความร้อนสูง มีโอกาสเกิดไฟไหม้จริง
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "right", maxWidth: 400 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong style={{ color: "red" }}>*</strong> ข้อจำกัดการแสดงผล
          </Typography>
          <Typography variant="body2">
            ข้อมูลแสดงสูงสุด 5,000 จุดในพื้นที่ที่มองเห็น
            <br />
            กรุณา Zoom in ไปยังพื้นที่ที่สนใจเพื่อดูจุดทั้งหมด
            <br />
            หาก Zoom ออกมาก อาจทำให้ข้อมูลบางจุดไม่ถูกแสดง
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
