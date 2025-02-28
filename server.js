const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("./database");

const app = express();
const SECRET_KEY = "secreto123"; // Clave para JWT, usa variables de entorno en producción

app.use(cors());
app.use(express.json()); // Para recibir datos en JSON

// egistro de usuario
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        (err) => {
            if (err) {
                return res.status(400).json({ message: "Usuario ya registrado" });
            }
            res.json({ message: "Usuario registrado exitosamente" });
        }
    );
});

// 🔵 Inicio de sesión
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (!user) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    });
});

// 🟠 Ruta protegida
app.get("/mensaje", verifyToken, (req, res) => {
    res.json({ message: `Bienvenido, ${req.user.username}` });
});

// Middleware para verificar JWT
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ message: "Token inválido" });
        req.user = user;
        next();
    });
}

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
