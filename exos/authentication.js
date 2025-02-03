function generateToken(user) {
     return btoa(JSON.stringify(user));
}