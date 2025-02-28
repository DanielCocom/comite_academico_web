const jwt = require("jsonwebtoken");
const path = require("path");
const SECRET_KEY = "secreto123"; // Clave para JWT, usa variables de entorno en producción

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



// function protectView(req, res) {
//     const token = req.headers["authorization"];

//     if (!token) {
//         return res.status(403).json({ message: "Acceso denegado" }); // Devuelve acceso denegado si no hay token
//     }

//     jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(401).json({ message: "Token inválido" }); // Devuelve token inválido si hay error
//         }
//         req.user = user;
//         res.sendFile(path.join(__dirname, "../public/mensaje.html")); // Devuelve la vista /mensaje
//     });
// }

module.exports = { verifyToken };
