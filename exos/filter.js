/**
 * J'ai utilisé l'IA uniquement pour générer la liste de users
 */
const users = [
    { id: 1, name: "Alice Dupont", age: 28, email: "alice.dupont@gmail.com", role: "admin" },
    { id: 2, name: "Bob Martin", age: 34, email: "bob.martin@outlook.com", role: "user" },
    { id: 3, name: "Claire Bernard", age: 22, email: "claire.bernard@gmail.com", role: "moderator" },
    { id: 4, name: "David Leroy", age: 45, email: "david.leroy@free.fr", role: "user" },
    { id: 5, name: "Emma Faure", age: 30, email: "emma.faure@gmail.com", role: "admin" },
    { id: 6, name: "François Petit", age: 27, email: "francois.petit@outlook.com", role: "user" },
    { id: 7, name: "Gabrielle Moreau", age: 40, email: "gabrielle.moreau@free.fr", role: "moderator" },
    { id: 8, name: "Hugo Caron", age: 31, email: "hugo.caron@gmail.com", role: "user" },
    { id: 9, name: "Isabelle Noël", age: 36, email: "isabelle.noel@outlook.com", role: "admin" },
    { id: 10, name: "Julien Dubois", age: 29, email: "julien.dubois@gmail.com", role: "user" }
];

/**
 * Retourne les utilisateurs dont l'âge est inférieur ou égal à "criteria"
 */
function filterByAge(array, criteria){
    return array.filter(user => user.age <= criteria);
}

/**
 * Retourne les utilisateurs dont l'adresse email contient "domain"
 */
function filterByEmailDomain(array, domain){
    return array.filter(user => user.email.includes(domain));
}

/**
 * Retourne les utilisateurs qui ont le rôle "role"
 */
function filterByRole(array, role){
    return array.filter(user => user.role.toLowerCase() === role.toLowerCase());
}

console.log("Filtre par âge : ",filterByAge(users, 30));
console.log("\nFiltre par email : ", filterByEmailDomain(users, 'free'));
console.log("\nFiltre par rôle : ", filterByRole(users, "moderator"));

