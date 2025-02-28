const express = require("express");
const authRoutes = require("./routes/authRoutes");
const viewRoutes = require("./routes/viewRoutes");



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());


app.use("/api", authRoutes);
app.use("/view", viewRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});