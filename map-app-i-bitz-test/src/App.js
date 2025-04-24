import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import LandingPage from "./pages/LandingPage";
import theme from "./theme";
import Auth from "./utils/auth";
import FrpMap from "./pages/FrpMap";
export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Navbar
          isLanding={isLanding}
          isMobile={isMobile}
          toggleDrawer={toggleDrawer}
        />

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {isLanding ? (
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
              </Routes>
            </Box>
          ) : (
            <>
              <Sidebar
                isMobile={isMobile}
                mobileOpen={mobileOpen}
                toggleDrawer={toggleDrawer}
              />
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 3,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <Auth>
                        <Dashboard />
                      </Auth>
                    }
                  />
                  <Route
                    path="/frpmap"
                    element={
                      <Auth>
                        <FrpMap />
                      </Auth>
                    }
                  />
                  <Route
                    path="/records"
                    element={
                      <Auth>
                        <Records />
                      </Auth>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
