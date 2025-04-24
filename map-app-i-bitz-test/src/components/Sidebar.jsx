import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import HistoryIcon from "@mui/icons-material/History";

export default function Sidebar({ isMobile, mobileOpen, toggleDrawer }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
    { label: "FRP Map", path: "/frpmap", icon: <MapIcon /> },
    { label: "Records", path: "/records", icon: <HistoryIcon /> },
  ];

  const drawerContent = (
    <List sx={{ py: 1 }}>
      {menuItems.map((item) => {
        const selected = location.pathname === item.path;
        return (
          <ListItem disablePadding key={item.path} sx={{ px: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={selected}
              sx={{
                my: 0.5,
                borderRadius: 2,
                px: 2,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                  color: theme.palette.secondary.contrastText,
                },
                "&.Mui-selected": {
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={toggleDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: 200,
        flexShrink: 0,
        zIndex: theme.zIndex.appBar,
        "& .MuiDrawer-paper": {
          width: 200,
          top:"54px",
          height: isMobile ? "100%" : "calc(100% - 64px)",
          boxSizing: "border-box",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRight: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
