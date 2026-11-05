/* ==========================================
MOBILUS — APPLICATION PRINCIPALE
Catalogue connecté à Supabase
========================================== */

document.addEventListener(“DOMContentLoaded”, function () {
“use strict”;

const STORAGE_FAVORITES = "mobilusFavoris";
const STORAGE_RECENTS = "mobilusRecents";
const movieGrid = document.getElementById("movieGrid");
const searchInput = document.getElementById("searchInput");
let catalogueFilms = [];
let categorieActive = "Tous";
let rechercheActive = "";
/* ======================================
   AFFICHAGE DES MESSAGES
====================================== */
function afficherMessage(message) {
    if (!movieGrid) return;
    movieGrid.innerHTML = "";
    const paragraphe = document.createElement("p");
    paragraphe.className = "empty-message";
    paragraphe.textContent = message;
    movieGrid.appendChild(paragraphe);
}
/* ======================================
   NORMALISATION DES CONTENUS
====================================== */
function normaliserFilm(contenu) {
    return {
        id: contenu.id,
        title: contenu.titre || contenu.title || "Sans titre",
        year: contenu.annee || contenu.year || "",
        category: contenu.categorie || contenu.category || "",
        type:
            contenu.type === "serie" ||
            contenu.type === "série"
                ? "serie"
                : "film",
        image:
            contenu.image_url ||
            contenu.image ||
            "",
        video:
            contenu.video_url ||
            contenu.video ||
            "",
        description: contenu.description || "",
        emoji: contenu.emoji || "🎬",
        niveau_acces:
            contenu.niveau_acces || "gratuit"
    };
}
/* ======================================
   RÉCUPÉRATION DE L'ANCIEN CATALOGUE
====================================== */
function recupererAncienCatalogue() {
    if (Array.isArray(window.films)) {
        return window.films.map(normaliserFilm);
    }
    try {
        const anciensFilms = JSON.parse(
            localStorage.getItem("mobilusFilms") || "[]"
        );
        if (Array.isArray(anciensFilms)) {
            return anciensFilms.map(normaliserFilm);
        }
    } catch (erreur) {
        console.error("Erreur ancien catalogue :", erreur);
    }
    return [];
}
/* ======================================
   CONNEXION AU CATALOGUE SUPABASE
====================================== */
async function chargerCatalogue() {
    afficherMessage("Chargement des films et séries...");
    let essais = 0;
    while (!window.mobilusDB && essais < 30) {
        await new Promise(function (resolve) {
            setTimeout(resolve, 300);
        });
        essais++;
    }
    if (!window.mobilusDB) {
        console.error("Supabase n'est pas initialisé.");
        catalogueFilms = recupererAncienCatalogue();
        afficherFilms();
        if (catalogueFilms.length === 0) {
            afficherMessage(
                "Impossible de connecter le catalogue. Vérifie la configuration Supabase."
            );
        }
        return;
    }
    try {
        const { data, error } = await window.mobilusDB
            .from("contenus")
            .select("*")
            .eq("publie", true)
            .order("created_at", { ascending: false });
        if (error) {
            throw error;
        }
        catalogueFilms = (data || []).map(normaliserFilm);
        if (catalogueFilms.length === 0) {
            afficherMessage(
                "Aucun contenu disponible pour le moment."
            );
            return;
        }
        afficherFilms();
        console.log(
            "MOBILUS : catalogue Supabase chargé.",
            catalogueFilms.length,
            "contenus."
        );
    } catch (erreur) {
        console.error(
            "Erreur de chargement Supabase :",
            erreur
        );
        catalogueFilms = recupererAncienCatalogue();
        if (catalogueFilms.length > 0) {
            afficherFilms();
        } else {
            afficherMessage(
                "Impossible de charger le catalogue. Vérifie ta connexion Internet et les autorisations Supabase."
            );
        }
    }
}
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
        console.error("Erreur historique :", erreur);
    }
}
/* ======================================
   ANIMATION DE LECTURE
====================================== */
function afficherChargementLecture() {
    let loader = document.getElementById(
        "mobilus-action-loading"
    );
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
            }
            .mobilus-action-spinner {
                width: 43px;
                height: 43px;
                border: 4px solid #333;
                border-top-color: #ffd400;
                border-right-color: #ffd400;
                border-radius: 50%;
                animation: mobilusActionRotate .8s linear infinite;
            }
            @keyframes mobilusActionRotate {
                to { transform: rotate(360deg); }
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
    }, 1500);
}
/* ======================================
   CRÉATION DES CARTES
====================================== */
function creerCarte(film) {
    const carte = document.createElement("article");
    carte.className = "movie-card";
    carte.dataset.id = film.id;
    carte.dataset.category = film.category;
    carte.dataset.type = film.type;
    const poster = document.createElement("div");
    poster.className = "movie-poster";
    if (film.image) {
        const image = document.createElement("img");
        image.src = film.image;
        image.alt = "Affiche de " + film.title;
        image.loading = "lazy";
        image.onerror = function () {
            image.style.display = "none";
            poster.textContent = film.emoji;
            poster.classList.add("poster-placeholder");
        };
        poster.appendChild(image);
    } else {
        const placeholder = document.createElement("div");
        placeholder.className = "poster-placeholder";
        placeholder.textContent = film.emoji;
        poster.appendChild(placeholder);
    }
    const badge = document.createElement("span");
    badge.className = "movie-badge";
    badge.textContent =
        film.type === "serie" ? "SÉRIE" : "FILM";
    poster.appendChild(badge);
    const informations = document.createElement("div");
    informations.className = "movie-info";
    const titre = document.createElement("h3");
    titre.textContent = film.title;
    const meta = document.createElement("div");
    meta.className = "movie-meta";
    const annee = document.createElement("span");
    annee.textContent = film.year;
    const categorie = document.createElement("span");
    categorie.textContent = film.category;
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
        const titre = film.title.toLowerCase();
        const categorie = film.category.toLowerCase();
        const description = film.description.toLowerCase();
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
    if (!movieGrid) return;
    movieGrid.innerHTML = "";
    const resultats = filtrerFilms();
    if (resultats.length === 0) {
        afficherMessage(
            "Aucun film ou série ne correspond à ta recherche."
        );
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
    document.querySelectorAll(".category-btn").forEach(
        function (element) {
            element.classList.remove("active");
        }
    );
    if (bouton) {
        bouton.classList.add("active");
    }
    afficherFilms();
};
/* ======================================
   ANNÉE ACTUELLE
====================================== */
const annee = document.getElementById("anneeActuelle");
if (annee) {
    annee.textContent = new Date().getFullYear();
}
/* ======================================
   DÉMARRAGE
====================================== */
chargerCatalogue();
console.log("MOBILUS : application initialisée.");

});