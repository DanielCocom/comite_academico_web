const db = require("./config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkBruteForce, recordFailedAttempt, resetAttempts } = require("./config/security");

const SECRET_KEY = "secreto123";

async function register(req, res) {
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
}

function login(req, res) {
    const { username, password } = req.body;

    const bruteForceCheck = checkBruteForce(username);
    if (bruteForceCheck.blocked) {
        return res.status(403).json({ message: bruteForceCheck.message });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (!user) {
            const attempt = recordFailedAttempt(username);
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const attempt = recordFailedAttempt(username);
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        resetAttempts(username); // Restablecer intentos fallidos si el inicio de sesión es exitoso

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    });
}

module.exports = { register, login };