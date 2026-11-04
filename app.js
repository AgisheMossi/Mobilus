document.addEventListener("DOMContentLoaded", function () {
    const intro = document.getElementById("mobilus-intro");
    const home = document.getElementById("home-page");
    // Vérifier que les éléments existent
    if (!intro || !home) {
        return;
    }
    // Masquer la page d'accueil pendant le démarrage
    home.classList.add("hidden");
    // Afficher le logo et le chargement pendant 5 secondes
    setTimeout(function () {
        // Faire disparaître l'écran de démarrage
        intro.classList.add("fade-out");
        // Afficher la page d'accueil
        home.classList.remove("hidden");
        // Retirer l'écran de démarrage après la transition
        setTimeout(function () {
            intro.style.display = "none";
        }, 500);
    }, 5000);
});