import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  Paper,
  Backdrop,
  Container,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../assets/bg.png";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [opendialog, setOpenDialog] = useState(false);
  const [values, setValues] = useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const handleChange = (prop) => (e) =>
    setValues({ ...values, [prop]: e.target.value });
  const handleClickShowPassword = () =>
    setValues({ ...values, showPassword: !values.showPassword });
  const handleMouseDownPassword = (e) => e.preventDefault();
  const Login = () => {
    localStorage.setItem("mockToken", "mock1234");
    setOpen(false);
    setOpenDialog(false);
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Fire Alarm App
          </Typography>

          <Typography variant="h6" sx={{ mb: 4 }}>
            ติดตามความร้อนจากดาวเทียม รู้ก่อน ป้องกันก่อน
          </Typography>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setOpen(true);
                setOpenDialog(true);
              }}
              sx={{
                backgroundColor: "#fff",
                color: "#b32f13",
                fontWeight: 600,
                px: 5,
                py: 1.5,
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#fce4ec",
                },
              }}
            >
              Get Start
            </Button>
          </motion.div>
        </motion.div>

        {opendialog && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 21000,
              display: "flex",
              flexDirection: width <= 1200 ? "column" : "row",
              backgroundColor: "#fff",
              borderRadius: 4,
              boxShadow: 24,
              overflow: "hidden",
              width: width <= 1024 ? "90%" : width <= 1200 ? "75%" : "50%",
              maxWidth: 900,
              minWidth: 320,
              height: 500,
              alignItems: width <= 1200 ? "center" : "normal",
            }}
          >
            <Box
              sx={{
                width: width <= 768 ? "100%" : "50%",
                px: 3,
                py: 4,
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#b32f13", mb: 3 }}>
                LOGIN
              </Typography>
              <Paper
                elevation={6}
                sx={{
                  p: 1,
                  borderRadius: 5,
                  width: "100%",
                  maxWidth: 340,
                  mb: 2,
                  height: 45,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <TextField
                    label="Username"
                    variant="standard"
                    fullWidth
                    onChange={handleChange("username")}
                    inputProps={{ maxLength: 22 }}
                    InputProps={{ disableUnderline: true }}
                    sx={{ mb: 1.5 }}
                  />
                </Box>
              </Paper>
              <Paper
                elevation={6}
                sx={{
                  p: 1,
                  borderRadius: 5,
                  width: "100%",
                  maxWidth: 340,
                  height: 45,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
                  <LockIcon sx={{ mr: 1 }} />
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Password</InputLabel>
                    <Input
                      sx={{ mb: 1.5 }}
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange("password")}
                      disableUnderline
                      inputProps={{ maxLength: 22 }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              </Paper>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, borderRadius: 5, height: 48, maxWidth: 340 }}
                onClick={Login}
              >
                Login
              </Button>
              <a
                href="#"
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 45,
                }}
              >
                Forgot Password
              </a>
              <div
                style={{ display: width <= 1200 ? "" : "none", marginTop: 20 }}
              >
                <Typography variant="body1" color="black">
                  Don't have an account? <a href="#">Register</a>
                </Typography>
              </div>
            </Box>
            <Box
              sx={{
                width: width <= 1200 ? "100%" : "50%",
                background: "linear-gradient(135deg, #b32f13 0%, #ff7043 100%)",
                color: "#fff",
                display: width <= 1200 ? "none" : "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Welcome to Fire Alarm App
              </Typography>
              <Typography variant="body1" gutterBottom>
                Don't have an account?
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  mt: 2,
                  width: 150,
                  borderRadius: 5,
                }}
              >
                Register
              </Button>
            </Box>
          </Box>
        )}

        <Backdrop
          sx={{ color: "#fff", zIndex: 20000 }}
          open={open}
          onClick={() => {
            setOpen(false);
            setOpenDialog(false);
          }}
        />
      </Container>
    </Box>
  );
}
