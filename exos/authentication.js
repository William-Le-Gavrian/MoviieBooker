function generateToken(user) {
    return btoa(JSON.stringify(user));
}

function verifyToken(token) {
    return JSON.parse(atob(token));
}

let user = {
    id: 1,
    name: "Alice Dupont",
    age: 28,
    email: "alice.dupont@example.com",
    role: "admin"
}

let userToken = generateToken(user);
console.log("Le token crypté du user : ", userToken);
console.log("La vérification du token : ", verifyToken(userToken));