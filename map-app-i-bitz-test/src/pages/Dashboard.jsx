import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";

export default function FrpDashboardSummary() {
  const [chartData, setChartData] = useState([]);
  const [nullFrpCount, setNullFrpCount] = useState(0);
  const [nonnullFrpCount, setNonNullFrpCount] = useState(0);
  const [nullFrpData, setNullFrpData] = useState([]);
  const [nonNullFrpData, setNonNullFrpData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const limit = 10000;
    const total = 100000;
    const batches = Math.ceil(total / limit);
    let all = [];

    setLoading(true);
    for (let i = 0; i < batches; i++) {
      const offset = i * limit;
      const url = `https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?limit=${limit}&offset=${offset}&api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC`;
      try {
        const res = await axiosInstance.get(url);
        all.push(...res.data.features.map((f) => f.properties));
      } catch (err) {
        console.error("Failed to fetch batch", err);
      }
    }

    const grouped = {};
    const nullGrouped = {};
    const nonNullGrouped = {};
    let nullCount = 0;
    let nonnullCount = 0;
    all.forEach((item) => {
      const country = item.ct_en || "Unknown";
      const frp = parseFloat(item.frp);
      if (!grouped[country]) grouped[country] = { highFrp: 0, count: 0 };
      if (!isNaN(frp)) {
        nonnullCount++;
        if (frp > 50) grouped[country].highFrp += 1;
        grouped[country].count += 1;
        nonNullGrouped[country] = (nonNullGrouped[country] || 0) + 1;
      } else {
        nullCount++;
        nullGrouped[country] = (nullGrouped[country] || 0) + 1;
      }
    });

    const summarized = Object.entries(grouped).map(([country, stat]) => ({
      country,
      highFrp: stat.highFrp,
      count: stat.count,
    }));

    const nullSummarized = Object.entries(nullGrouped).map(
      ([country, count]) => ({ country, count })
    );

    const nonNullSummarized = Object.entries(nonNullGrouped).map(
      ([country, count]) => ({ country, count })
    );

    setChartData(summarized);
    setNullFrpData(nullSummarized);
    setNonNullFrpData(nonNullSummarized);
    setNullFrpCount(nullCount);
    setNonNullFrpCount(nonnullCount);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            แนวโน้ม FRP (Fire Radiative Power) แยกตามประเทศ
          </Typography>
          <Typography variant="body2">
            จำนวนประเทศทั้งหมด: {chartData.length}
          </Typography>
          <Typography variant="body2">
            จำนวนข้อมูลที่ FRP ถูกประเมินแล้ว: {nonnullFrpCount}
          </Typography>
          <Typography variant="body2">
            จำนวนข้อมูลที่ FRP ยังประเมินไม่ได้: {nullFrpCount}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="subtitle2">
              ประเทศที่มีจุด FRP สูง (FRP &gt; 50)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData.filter((d) => d.highFrp > 0)}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={100} />
                <Tooltip formatter={(value) => `${value} จุด`} />
                <Bar dataKey="highFrp" fill="#e53935" name="FRP สูง" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box mt={4}>
            <Typography variant="subtitle2">
              จำนวนจุดที่ FRP ถูกประเมินแล้ว ต่อประเทศ
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={nonNullFrpData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4caf50"
                  name="FRP ถูกประเมินแล้ว"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box mt={4}>
            <Typography variant="subtitle2">
              จำนวนจุดที่ FRP ยังประเมินไม่ได้ ต่อประเทศ
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={nullFrpData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#ffa726"
                  name="FRP ยังประเมินไม่ได้"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backgroundColor: "rgba(255,255,255,0.75)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        )}
      </Card>
    </motion.div>
  );
}
