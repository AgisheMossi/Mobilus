(function () {
    "use strict";
    const CLE_FILMS = "mobilusFilms";
    const CLE_FAVORIS = "mobilusFavoris";
    const parametres = new URLSearchParams(window.location.search);
    const id = parametres.get("id");
    const chargement = document.getElementById("chargement");
    const details = document.getElementById("detailsFilm");
    const introuvable = document.getElementById("filmIntrouvable");
    const titre = document.getElementById("titreFilm");
    const type = document.getElementById("typeFilm");
    const meta = document.getElementById("metaFilm");
    const description = document.getElementById("descriptionFilm");
    const affiche = document.getElementById("afficheFilm");
    const emoji = document.getElementById("emojiFilm");
    const lecteur = document.getElementById("lecteurVideo");
    const messageVideo = document.getElementById("messageVideo");
    const boutonFavori = document.getElementById("boutonFavori");
    function obtenirFilms() {
        try {
            const sauvegarde = localStorage.getItem(CLE_FILMS);
            if (sauvegarde !== null) {
                const donnees = JSON.parse(sauvegarde);
                if (Array.isArray(donnees)) {
                    return donnees;
                }
            }
        } catch (erreur) {
            console.error("Erreur de lecture :", erreur);
        }
        return Array.isArray(window.films) ? window.films : [];
    }
    function obtenirFavoris() {
        try {
            const donnees = JSON.parse(
                localStorage.getItem(CLE_FAVORIS) || "[]"
            );
            return Array.isArray(donnees) ? donnees : [];
        } catch (erreur) {
            return [];
        }
    }
    function urlValide(adresse) {
        if (!adresse) return "";
        try {
            const url = new URL(adresse);
            if (
                url.protocol === "https:" ||
                url.protocol === "http:"
            ) {
                return url.href;
            }
        } catch (erreur) {
            return "";
        }
        return "";
    }
    function afficherErreur() {
        chargement.hidden = true;
        details.hidden = true;
        introuvable.hidden = false;
        document.title = "Contenu introuvable | MOBILUS";
    }
    function afficherFavori(film) {
        const favoris = obtenirFavoris();
        const estFavori = favoris.includes(String(film.id));
        boutonFavori.textContent = estFavori
            ? "❤️ Retirer des favoris"
            : "🤍 Ajouter aux favoris";
        boutonFavori.setAttribute(
            "aria-pressed",
            String(estFavori)
        );
    }
    function configurerLecteur(film) {
        const video = urlValide(film.video);
        if (!video) {
            lecteur.pause();
            lecteur.removeAttribute("src");
            lecteur.load();
            lecteur.hidden = true;
            messageVideo.textContent =
                "Aucune adresse vidéo en ligne n'est enregistrée pour ce contenu.";
            messageVideo.hidden = false;
            return;
        }
        lecteur.src = video;
        lecteur.hidden = false;
        messageVideo.hidden = true;
        lecteur.load();
    }
    function afficherFilm(film) {
        chargement.hidden = true;
        introuvable.hidden = true;
        details.hidden = false;
        document.title = film.titre + " | MOBILUS";
        titre.textContent = film.titre || "Sans titre";
        type.textContent = film.type || "Film";
        meta.textContent = [
            film.annee || "",
            film.categorie || ""
        ].filter(Boolean).join(" · ");
        description.textContent =
            film.description || "Aucune description disponible.";
        const adresseImage = urlValide(film.image);
        if (adresseImage) {
            affiche.src = adresseImage;
            affiche.alt = "Affiche de " + (film.titre || "");
            affiche.hidden = false;
            emoji.hidden = true;
            affiche.onerror = function () {
                affiche.hidden = true;
                emoji.hidden = false;
            };
        } else {
            affiche.removeAttribute("src");
            affiche.hidden = true;
            emoji.textContent = film.emoji || "🎬";
            emoji.hidden = false;
        }
        configurerLecteur(film);
        afficherFavori(film);
        boutonFavori.addEventListener("click", function () {
            let favoris = obtenirFavoris();
            const filmId = String(film.id);
            if (favoris.includes(filmId)) {
                favoris = favoris.filter(function (element) {
                    return element !== filmId;
                });
            } else {
                favoris.push(filmId);
            }
            localStorage.setItem(
                CLE_FAVORIS,
                JSON.stringify(favoris)
            );
            afficherFavori(film);
        });
    }
    if (!id) {
        afficherErreur();
        return;
    }
    const film = obtenirFilms().find(function (element) {
        return String(element.id) === id;
    });
    if (!film) {
        afficherErreur();
        return;
    }
    afficherFilm(film);
})();