const MAX_ATTEMPTS = 5; // Máximo intentos permitidos
const LOCK_TIME = 5 * 60 * 1000; // Bloqueo por 5 minutos

const loginAttempts = {}; // Objeto en memoria para rastrear intentos fallidos

function checkBruteForce(username) {
    if (loginAttempts[username] && loginAttempts[username].lockedUntil > Date.now()) {
        return { blocked: true, message: "Muchas Solicitudes, inténtalo más tarde." };
    }
    return { blocked: false };
}

function recordFailedAttempt(username) {
    if (!loginAttempts[username]) {
        loginAttempts[username] = { attempts: 1, lockedUntil: null };
    } else {
        loginAttempts[username].attempts++;
    }

    if (loginAttempts[username].attempts >= MAX_ATTEMPTS) {
        loginAttempts[username].lockedUntil = Date.now() + LOCK_TIME;
        return { blocked: true, message: "Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos." };
    }
    return { blocked: false };
}

function resetAttempts(username) {
    delete loginAttempts[username];
}

module.exports = { checkBruteForce, recordFailedAttempt, resetAttempts };
