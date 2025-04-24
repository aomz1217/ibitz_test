import React from "react";
import { motion } from "framer-motion";
import MapView from "../components/MapView";
import SearchFilter from "../components/SearchFilter";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";

export default function FrpMap() {
  const [filter, setFilter] = React.useState({
    search: "",
    minBrightness: 0,
    minFrp: 0,
  });
  const [viewMode, setViewMode] = React.useState("markers");
  const [showOnlyFRP, setShowOnlyFRP] = React.useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" sx={{mb:2}}>
        FRP Map
      </Typography>
      <Card elevation={3} sx={{ overflow: "hidden" }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <SearchFilter filter={filter} onChange={setFilter} />

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, m) => m && setViewMode(m)}
                size="small"
                sx={{ mt: { xs: 2, md: 0 }, mb:2 , ml:1}}
              >
                <ToggleButton value="markers">Markers</ToggleButton>
                <ToggleButton value="heatmap">Heatmap</ToggleButton>
              </ToggleButtonGroup>

              <FormControlLabel
                sx={{ mt: { xs: 2, md: 0 }, ml: { md: "auto" } }}
                control={
                  <Switch
                    checked={showOnlyFRP}
                    onChange={() => setShowOnlyFRP((prev) => !prev)}
                    size="small"
                  />
                }
                label="แสดงเฉพาะจุดที่มี FRP"
              />
            </Box>
          </Box>
          <Box
            sx={{
              height: { xs: "50vh", sm: "60vh", md: "63vh" },
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <MapView
              filter={filter}
              viewMode={viewMode}
              showOnlyFRP={showOnlyFRP}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
