/* ==========================================
   MOBILUS — APPLICATION PRINCIPALE
   Catalogue, recherche, favoris et lecture
========================================== */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    /* ======================================
       CONFIGURATION
    ====================================== */
    const STORAGE_FILMS = "mobilusFilms";
    const STORAGE_FAVORITES = "mobilusFavoris";
    const STORAGE_RECENTS = "mobilusRecents";
    const movieGrid = document.getElementById("movieGrid");
    const searchInput = document.getElementById("searchInput");
    let categorieActive = "Tous";
    let rechercheActive = "";
    /* ======================================
       RÉCUPÉRATION DU CATALOGUE
    ====================================== */
    function recupererFilms() {
        let catalogue = Array.isArray(window.films)
            ? window.films
            : [];
        try {
            const filmsAdmin = localStorage.getItem(STORAGE_FILMS);
            if (filmsAdmin) {
                const filmsEnregistres = JSON.parse(filmsAdmin);
                if (Array.isArray(filmsEnregistres)) {
                    catalogue = filmsEnregistres;
                }
            }
        } catch (erreur) {
            console.error(
                "Erreur de récupération du catalogue MOBILUS :",
                erreur
            );
        }
        return catalogue;
    }
    let catalogueFilms = recupererFilms();
    /* ======================================
       FAVORIS
    ====================================== */
    function recupererFavoris() {
        try {
            const favoris = JSON.parse(
                localStorage.getItem(STORAGE_FAVORITES) || "[]"
            );
            return Array.isArray(favoris) ? favoris : [];
        } catch (erreur) {
            return [];
        }
    }
    function enregistrerFavoris(favoris) {
        localStorage.setItem(
            STORAGE_FAVORITES,
            JSON.stringify(favoris)
        );
    }
    function estFavori(id) {
        return recupererFavoris().some(function (favori) {
            return String(favori) === String(id);
        });
    }
    function basculerFavori(id) {
        let favoris = recupererFavoris();
        const existe = favoris.some(function (favori) {
            return String(favori) === String(id);
        });
        if (existe) {
            favoris = favoris.filter(function (favori) {
                return String(favori) !== String(id);
            });
        } else {
            favoris.push(id);
        }
        enregistrerFavoris(favoris);
        afficherFilms();
    }
    /* ======================================
       HISTORIQUE
    ====================================== */
    function enregistrerRecent(film) {
        try {
            let recents = JSON.parse(
                localStorage.getItem(STORAGE_RECENTS) || "[]"
            );
            if (!Array.isArray(recents)) {
                recents = [];
            }
            recents = recents.filter(function (element) {
                return String(element.id) !== String(film.id);
            });
            recents.unshift({
                id: film.id,
                title: film.title,
                year: film.year,
                category: film.category,
                type: film.type,
                image: film.image || "",
                date: new Date().toISOString()
            });
            recents = recents.slice(0, 50);
            localStorage.setItem(
                STORAGE_RECENTS,
                JSON.stringify(recents)
            );
        } catch (erreur) {
            console.error("Impossible d'enregistrer l'historique.", erreur);
        }
    }
    /* ======================================
       ANIMATION DE CHARGEMENT SANS LOGO
    ====================================== */
    function afficherChargementLecture() {
        let loader = document.getElementById("mobilus-action-loading");
        if (!loader) {
            loader = document.createElement("div");
            loader.id = "mobilus-action-loading";
            loader.innerHTML = `
                <div class="mobilus-action-spinner"></div>
                <p>PRÉPARATION DE VOTRE CONTENU</p>
            `;
            const style = document.createElement("style");
            style.textContent = `
                #mobilus-action-loading {
                    position: fixed;
                    inset: 0;
                    z-index: 1000001;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    background: #090909;
                    color: #aaaaaa;
                    font-family: Arial, sans-serif;
                    font-size: 10px;
                    letter-spacing: 2px;
                    opacity: 1;
                }
                .mobilus-action-spinner {
                    width: 43px;
                    height: 43px;
                    border: 4px solid #333333;
                    border-top-color: #ffd400;
                    border-right-color: #ffd400;
                    border-radius: 50%;
                    animation: mobilusActionRotate 0.8s linear infinite;
                }
                @keyframes mobilusActionRotate {
                    to {
                        transform: rotate(360deg);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .mobilus-action-spinner {
                        animation-duration: 2s;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(loader);
        }
        loader.style.display = "flex";
    }
    /* ======================================
       OUVRIR UN FILM
    ====================================== */
    function regarderFilm(id) {
        const film = catalogueFilms.find(function (element) {
            return String(element.id) === String(id);
        });
        if (!film) {
            alert("Ce contenu est introuvable.");
            return;
        }
        enregistrerRecent(film);
        afficherChargementLecture();
        setTimeout(function () {
            window.location.href =
                "film.html?id=" + encodeURIComponent(film.id);
        }, 3000);
    }
    /* ======================================
       CRÉATION DES CARTES
    ====================================== */
    function creerCarte(film) {
        const carte = document.createElement("article");
        carte.className = "movie-card";
        carte.dataset.id = film.id;
        carte.dataset.category = film.category || "";
        carte.dataset.type = film.type || "film";
        const poster = document.createElement("div");
        poster.className = "movie-poster";
        if (film.image) {
            const image = document.createElement("img");
            image.src = film.image;
            image.alt = "Affiche de " + film.title;
            image.loading = "lazy";
            image.onerror = function () {
                image.style.display = "none";
                poster.textContent = film.emoji || "🎬";
                poster.classList.add("poster-placeholder");
            };
            poster.appendChild(image);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "poster-placeholder";
            placeholder.textContent = film.emoji || "🎬";
            poster.appendChild(placeholder);
        }
        const badge = document.createElement("span");
        badge.className = "movie-badge";
        badge.textContent =
            film.type === "série" || film.type === "serie"
                ? "SÉRIE"
                : "FILM";
        poster.appendChild(badge);
        const informations = document.createElement("div");
        informations.className = "movie-info";
        const titre = document.createElement("h3");
        titre.textContent = film.title || film.titre || "Sans titre";
        const meta = document.createElement("div");
        meta.className = "movie-meta";
        const annee = document.createElement("span");
        annee.textContent = film.year || film.annee || "";
        const categorie = document.createElement("span");
        categorie.textContent = film.category || film.categorie || "";
        meta.appendChild(annee);
        meta.appendChild(categorie);
        const actions = document.createElement("div");
        actions.className = "movie-actions";
        const boutonRegarder = document.createElement("button");
        boutonRegarder.type = "button";
        boutonRegarder.className = "play-btn";
        boutonRegarder.textContent = "▶ Regarder";
        boutonRegarder.addEventListener("click", function () {
            regarderFilm(film.id);
        });
        const boutonFavori = document.createElement("button");
        boutonFavori.type = "button";
        boutonFavori.className = "favorite-btn";
        function actualiserBoutonFavori() {
            if (estFavori(film.id)) {
                boutonFavori.textContent = "♥ Favori";
                boutonFavori.style.color = "#ff405d";
            } else {
                boutonFavori.textContent = "♡ Favori";
                boutonFavori.style.color = "white";
            }
        }
        actualiserBoutonFavori();
        boutonFavori.addEventListener("click", function () {
            basculerFavori(film.id);
        });
        actions.appendChild(boutonRegarder);
        actions.appendChild(boutonFavori);
        informations.appendChild(titre);
        informations.appendChild(meta);
        informations.appendChild(actions);
        carte.appendChild(poster);
        carte.appendChild(informations);
        return carte;
    }
    /* ======================================
       RECHERCHE ET FILTRAGE
    ====================================== */
    function filtrerFilms() {
        return catalogueFilms.filter(function (film) {
            const titre = (
                film.title ||
                film.titre ||
                ""
            ).toLowerCase();
            const categorie = (
                film.category ||
                film.categorie ||
                ""
            ).toLowerCase();
            const description = (
                film.description ||
                ""
            ).toLowerCase();
            const correspondRecherche =
                titre.includes(rechercheActive) ||
                categorie.includes(rechercheActive) ||
                description.includes(rechercheActive);
            const correspondCategorie =
                categorieActive === "Tous" ||
                categorie === categorieActive.toLowerCase();
            return correspondRecherche && correspondCategorie;
        });
    }
    /* ======================================
       AFFICHAGE DU CATALOGUE
    ====================================== */
    function afficherFilms() {
        if (!movieGrid) {
            return;
        }
        catalogueFilms = recupererFilms();
        movieGrid.innerHTML = "";
        const resultats = filtrerFilms();
        if (resultats.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-message";
            message.textContent =
                "Aucun film ou série ne correspond à ta recherche.";
            movieGrid.appendChild(message);
            return;
        }
        resultats.forEach(function (film) {
            movieGrid.appendChild(creerCarte(film));
        });
    }
    /* ======================================
       RECHERCHE EN DIRECT
    ====================================== */
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            rechercheActive = searchInput.value
                .trim()
                .toLowerCase();
            afficherFilms();
        });
    }
    /* ======================================
       FILTRAGE PAR CATÉGORIE
    ====================================== */
    window.filtrerCategorie = function (categorie, bouton) {
        categorieActive = categorie || "Tous";
        document.querySelectorAll(".category-btn").forEach(function (element) {
            element.classList.remove("active");
        });
        if (bouton) {
            bouton.classList.add("active");
        }
        afficherFilms();
    };
    /* ======================================
       NAVIGATION ET ANNÉE
    ====================================== */
    const annee = document.getElementById("anneeActuelle");
    if (annee) {
        annee.textContent = new Date().getFullYear();
    }
    /* ======================================
       INITIALISATION
    ====================================== */
    afficherFilms();
    console.log("MOBILUS : application initialisée.");
});