import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import DynamicTable from '../components/share_components/DynamicTable';
import axiosInstance
 from '../utils/axiosInstance';
export default function Records() {
  const [data, setData] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async (page, rowsPerPage) => {
    const url = `https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?limit=${rowsPerPage}&offset=${
      (page - 1) * rowsPerPage
    }&api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC`;

    try {
      const res = await axiosInstance.get(url);
      setData(res.data);
      setTotal(res.data.numberMatched);
    } catch (err) {
      console.error("Error loading batch:", err);
    }
  };

  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Records
      </Typography>
      <DynamicTable
        data={data?.features.map((f) => ({
          ...f.properties,
          coordinates: f.geometry.coordinates,
        }))}
        headers={[
          { key: "ct_en", label: "Country" },
          { key: "latitude", label: "Latitude" },
          { key: "longitude", label: "Longitude" },
          { key: "village", label: "Village" },
          { key: "tambol", label: "Subdistrict" },
          { key: "amphoe", label: "District" },
          { key: "changwat", label: "Province" },
          { key: "lu_name", label: "Note" },
          { key: "brightness", label: "Brightness" },
          { key: "frp", label: "FRP" },
        ]}
        type="normal"
        sort
        search
        exportable
        serverMode
        totalCount={total}
        onPageChange={({ page, rowsPerPage }) => {
          setPage(page);
          setRowsPerPage(rowsPerPage);
          fetchData(page, rowsPerPage);
        }}
      />
    </motion.div>
  );
}
