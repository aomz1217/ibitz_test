import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ isLanding, isMobile, toggleDrawer }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mockToken");
    navigate("/");
  };

  if (isLanding) return null;

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={{ zIndex: 21000 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ color: "#ff7043" }}>
            Fire Alarm
          </Typography>
        </Box>
        <Button
          variant="outlined"
          sx={{ color: "#ff7043", borderColor: "#ff7043" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
