const express = require("express");
const router = express.Router();
const { protectView, verifyToken } = require("../middleware/authMiddleware");
const { verify } = require("jsonwebtoken");
// RUTAS VISTA


router.get("/register", (req, res) => {
    res.sendFile(process.cwd()+ "/public/index.html");
});
router.get("/login", (req, res) => {
    res.sendFile(process.cwd() + "/public/login.html");
});
router.get("/verify", verifyToken, (req, res) => {
    res.sendFile(process.cwd() + "/public/mensaje.html");
});

router.get("/comentarios", (req, res) => {
    res.sendFile(process.cwd() + "/public/mensaje.html");
});


module.exports = router;
