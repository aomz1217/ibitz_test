import React, { useState } from 'react';
import { Box, TextField, Slider, Typography } from '@mui/material';

export default function SearchFilter({ filter, onChange }) {
  const [search, setSearch] = useState(filter.search);
  const [minBrightness, setMinBrightness] = useState(filter.minBrightness);
  const [minFrp, setMinFrp] = useState(filter.minFrp || 0);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    onChange({ search: val, minBrightness, minFrp });
  };

  const handleBrightnessChange = (e, value) => {
    setMinBrightness(value);
    onChange({ search, minBrightness: value, minFrp });
  };

  const handleFrpChange = (e, value) => {
    setMinFrp(value);
    onChange({ search, minBrightness, minFrp: value });
  };

  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        gap: 4,
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
        flexWrap: "wrap",
        justifyContent:'center'
      }}
    >
      <TextField
        label="Search Country"
        value={search}
        onChange={handleSearchChange}
        size="small"
        sx={{ width: 300 }}
      />{" "}
      <Box sx={{ width: 200, mt: { xs: 2, md: 0 } }}>
        <Typography gutterBottom>Min Brightness</Typography>
        <Slider
          value={minBrightness}
          onChange={handleBrightnessChange}
          valueLabelDisplay="auto"
          min={0}
          max={500}
        />
      </Box>
      <Box sx={{ width: 200, mt: { xs: 2, md: 0 } }}>
        <Typography gutterBottom>Min FRP</Typography>
        <Slider
          value={minFrp}
          onChange={handleFrpChange}
          valueLabelDisplay="auto"
          min={0}
          max={200}
        />
      </Box>
    </Box>
  );
}
