“use strict”;

(async function protegerAdministration() {
// Masquer la page pendant la vérification.
document.documentElement.style.visibility = “hidden”;

const ADMINS_MOBILUS = [
    "mobiluscinema@gmail.com",
    "agishemossi@gmail.com"
];
function refuserAcces(message) {
    alert(message);
    window.location.replace("index.html");
}
try {
    // Attendre l'initialisation de Supabase.
    let tentatives = 0;
    while (!window.mobilusDB && tentatives < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        tentatives++;
    }
    if (!window.mobilusDB) {
        refuserAcces("Impossible de vérifier la connexion.");
        return;
    }
    const { data, error } =
        await window.mobilusDB.auth.getSession();
    if (error || !data.session) {
        refuserAcces("Connecte-toi pour accéder à l'administration.");
        return;
    }
    const email = data.session.user.email?.toLowerCase();
    if (!email || !ADMINS_MOBILUS.includes(email)) {
        refuserAcces("Accès réservé aux administrateurs MOBILUS.");
        return;
    }
    // Accès autorisé.
    document.documentElement.style.visibility = "visible";
} catch (erreur) {
    console.error("Erreur de vérification admin :", erreur);
    refuserAcces("Une erreur empêche de vérifier ton accès.");
}

})();
