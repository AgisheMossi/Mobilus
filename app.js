
/* =========================================
   MOBILUS — APPLICATION PRINCIPALE
   Catalogue Supabase + catalogue local
   TOP 10 + TENDANCES 24H / 7 JOURS
   FAVORIS + HISTORIQUE + RECHERCHE
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const STORAGE_FAVORITES = "mobilusFavoris";
    const STORAGE_RECENTS = "mobilusRecents";

    const movieGrid = document.getElementById("movieGrid");
    const searchInput = document.getElementById("searchInput");

    let catalogueFilms = [];
    let categorieActive = "Tous";
    let rechercheActive = "";

    let top10Section = null;
    let top10Grid = null;

    let tendancesSection = null;
    let tendancesGrid = null;

    let periodeTendancesActive = "24h";

    /* ======================================
       OUTILS
    ====================================== */

    function normaliserTexte(texte) {
        return String(texte || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function formaterNombreVues(nombre) {
        const vues = Math.max(0, Number(nombre) || 0);

        return vues.toLocaleString("fr-FR") +
            (vues === 1 ? " vue" : " vues");
    }

    function formaterNombreLectures(nombre) {
        const vues = Math.max(0, Number(nombre) || 0);

        return vues.toLocaleString("fr-FR") +
            (vues === 1 ? " lecture" : " lectures");
    }

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
        const nombreVues = Number(contenu.nombre_vues);

        return {
            id: contenu.id,

            title:
                contenu.titre ||
                contenu.title ||
                "Sans titre",

            year:
                contenu.annee ||
                contenu.year ||
                "",

            category:
                contenu.categorie ||
                contenu.category ||
                "",

            type:
                normaliserTexte(contenu.type) === "serie"
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

            description:
                contenu.description || "",

            emoji:
                contenu.emoji || "🎬",

            niveau_acces:
                contenu.niveau_acces || "gratuit",

            nombre_vues:
                Number.isFinite(nombreVues) && nombreVues >= 0
                    ? nombreVues
                    : 0
        };
    }

    /* ======================================
       CATALOGUE LOCAL DE SECOURS
    ====================================== */

    function recupererAncienCatalogue() {
        try {
            const anciensFilms = JSON.parse(
                localStorage.getItem("mobilusFilms") || "[]"
            );

            if (Array.isArray(anciensFilms) && anciensFilms.length > 0) {
                return anciensFilms.map(normaliserFilm);
            }
        } catch (erreur) {
            console.error("Erreur catalogue local :", erreur);
        }

        if (Array.isArray(window.films)) {
            return window.films.map(normaliserFilm);
        }

        return [];
    }

    /* ======================================
       CHARGEMENT SUPABASE
    ====================================== */

    function avecDelai(promise, duree) {
        let minuterie;

        const delai = new Promise(function (_, reject) {
            minuterie = setTimeout(function () {
                reject(new Error(
                    "Supabase ne répond pas après 10 secondes."
                ));
            }, duree);
        });

        return Promise.race([promise, delai]).finally(function () {
            clearTimeout(minuterie);
        });
    }

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
            console.warn("Supabase indisponible.");
            utiliserCatalogueLocal();
            return;
        }

        try {
            const requete = window.mobilusDB
                .from("contenus")
                .select("*")
                .eq("publie", true)
                .order("created_at", { ascending: false });

            const resultat = await avecDelai(requete, 10000);

            const data = resultat.data;
            const error = resultat.error;

            if (error) {
                throw error;
            }

            if (Array.isArray(data) && data.length > 0) {
                catalogueFilms = data.map(normaliserFilm);

                console.log(
                    "MOBILUS : catalogue Supabase chargé.",
                    catalogueFilms.length
                );

                afficherFilms();
                afficherTop10();
                chargerTendances("24h");
                return;
            }

            console.warn(
                "Aucun contenu publié dans Supabase. Utilisation du catalogue local."
            );

            utiliserCatalogueLocal();

        } catch (erreur) {
            console.error("Erreur de chargement du catalogue :", erreur);

            utiliserCatalogueLocal();
        }
    }

    function utiliserCatalogueLocal() {
        catalogueFilms = recupererAncienCatalogue();

        if (catalogueFilms.length > 0) {
            afficherFilms();
            afficherTop10();
            chargerTendances("24h");

            console.log(
                "MOBILUS : catalogue local chargé.",
                catalogueFilms.length
            );

        } else {
            afficherMessage(
                "Aucun contenu disponible pour le moment."
            );
        }
    }

    /* ======================================
       STYLE TOP 10 ET TENDANCES
    ====================================== */

    function installerStyleTop10() {
        if (document.getElementById("mobilusTop10Style")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "mobilusTop10Style";

        style.textContent = `
            .mobilus-top10-section,
            .mobilus-tendances-section {
                width: 100%;
                margin: 25px 0 35px;
            }

            .mobilus-top10-title,
            .mobilus-tendances-title {
                color: #ffffff;
                font-size: 22px;
                font-weight: 900;
                margin: 0 0 6px;
                letter-spacing: .5px;
            }

            .mobilus-top10-title span,
            .mobilus-tendances-title span {
                color: #e50920;
            }

            .mobilus-top10-subtitle,
            .mobilus-tendances-subtitle {
                color: #999999;
                font-size: 12px;
                margin: 0 0 17px;
            }

            .mobilus-top10-grid,
            .mobilus-tendances-grid {
                display: grid;
                grid-template-columns: repeat(
                    auto-fill,
                    minmax(135px, 1fr)
                );
                gap: 15px;
            }

            .mobilus-top10-card {
                position: relative;
                min-width: 0;
                background: #141414;
                border-radius: 10px;
                overflow: hidden;
                border: 1px solid #292929;
            }

            .mobilus-top10-card .movie-poster {
                position: relative;
                overflow: hidden;
            }

            .mobilus-top10-card .movie-poster img {
                width: 100%;
                display: block;
                aspect-ratio: 2 / 3;
                object-fit: cover;
            }

            .mobilus-top10-rank {
                position: absolute;
                z-index: 5;
                top: 8px;
                right: 8px;
                width: 34px;
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #e50920;
                color: #ffffff;
                border: 2px solid #ffffff;
                border-radius: 7px;
                font-size: 17px;
                font-weight: 900;
                box-shadow: 0 3px 12px #00000088;
            }

            .mobilus-top10-views {
                color: #ffd400;
                font-size: 11px;
                font-weight: bold;
                margin-top: 7px;
            }

            .mobilus-top10-empty,
            .mobilus-tendances-empty {
                color: #999999;
                font-size: 13px;
                padding: 15px 0;
                grid-column: 1 / -1;
            }

            .mobilus-tendances-tabs {
                display: flex;
                gap: 10px;
                margin: 15px 0 18px;
                flex-wrap: wrap;
            }

            .mobilus-tendances-tab {
                padding: 10px 17px;
                border: 1px solid #383838;
                border-radius: 7px;
                background: #171717;
                color: #ffffff;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                transition: .2s ease;
            }

            .mobilus-tendances-tab.active {
                background: #e50920;
                border-color: #e50920;
                color: #ffffff;
            }

            .mobilus-tendances-tab:disabled {
                opacity: .6;
                cursor: wait;
            }

            .mobilus-tendances-loading {
                color: #aaaaaa;
                font-size: 13px;
                padding: 18px 0;
            }

            .mobilus-tendances-error {
                color: #ff6878;
                font-size: 13px;
                padding: 15px 0;
            }

            @media (max-width: 480px) {
                .mobilus-top10-grid,
                .mobilus-tendances-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 12px;
                }

                .mobilus-top10-title,
                .mobilus-tendances-title {
                    font-size: 20px;
                }

                .mobilus-tendances-tab {
                    flex: 1;
                    padding: 10px 8px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* ======================================
       SECTION TOP 10 MOBILUS
       RÉUTILISE LE TOP 10 DE INDEX.HTML
    ====================================== */

    function installerSectionTop10() {
        if (!movieGrid || !movieGrid.parentNode) return null;

        let section =
            document.getElementById("top10") ||
            document.getElementById("mobilusTop10");

        if (!section) {
            section = document.createElement("section");
            section.id = "mobilusTop10";

            movieGrid.parentNode.insertBefore(section, movieGrid);
        }

        section.classList.add("mobilus-top10-section");

        let titre = section.querySelector(
            ".mobilus-top10-title"
        );

        if (!titre) {
            const titreExistant = section.querySelector("h1, h2, h3");

            if (titreExistant) {
                titreExistant.classList.add("mobilus-top10-title");
            } else {
                titre = document.createElement("h2");
                titre.className = "mobilus-top10-title";
                titre.innerHTML = 'TOP <span>10</span> MOBILUS';
                section.appendChild(titre);
            }
        }

        let sousTitre = section.querySelector(
            ".mobilus-top10-subtitle"
        );

        if (!sousTitre) {
            sousTitre = document.createElement("p");
            sousTitre.className = "mobilus-top10-subtitle";
            sousTitre.textContent =
                "Les films et séries les plus regardés.";

            section.appendChild(sousTitre);
        }

        top10Grid =
            document.getElementById("top10Grid") ||
            document.getElementById("mobilusTop10Grid");

        if (!top10Grid) {
            top10Grid = document.createElement("div");
            top10Grid.id = "mobilusTop10Grid";
            section.appendChild(top10Grid);
        }

        top10Grid.id = "mobilusTop10Grid";
        top10Grid.classList.add("mobilus-top10-grid");

        top10Section = section;

        return section;
    }

    /* ======================================
       CARTE TOP 10
    ====================================== */

    function creerCarteTop10(
        film,
        classement,
        vuesAffichees,
        etiquetteVues
    ) {
        const carte = document.createElement("article");
        carte.className = "mobilus-top10-card";

        const poster = document.createElement("div");
        poster.className = "movie-poster";

        const rang = document.createElement("span");
        rang.className = "mobilus-top10-rank";
        rang.textContent = classement;

        poster.appendChild(rang);

        if (film.image) {
            const image = document.createElement("img");

            image.src = film.image;
            image.alt = "Affiche de " + film.title;
            image.loading = "lazy";

            image.onerror = function () {
                image.style.display = "none";
                poster.classList.add("poster-placeholder");
                poster.appendChild(
                    document.createTextNode(film.emoji)
                );
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

        const vues = document.createElement("div");
        vues.className = "mobilus-top10-views";

        if (vuesAffichees !== undefined) {
            vues.textContent =
                "▶ " + formaterNombreLectures(vuesAffichees);
        } else {
            vues.textContent =
                "▶ " + formaterNombreVues(film.nombre_vues);
        }

        if (etiquetteVues) {
            vues.textContent += " · " + etiquetteVues;
        }

        const actions = document.createElement("div");
        actions.className = "movie-actions";

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "play-btn";
        bouton.textContent = "▶ Regarder";

        bouton.addEventListener("click", function () {
            regarderFilm(film.id);
        });

        const favori = document.createElement("button");
        favori.type = "button";
        favori.className = "favorite-btn";

        function actualiserFavori() {
            if (estFavori(film.id)) {
                favori.textContent = "♥ Favori";
                favori.style.color = "#ff405d";
            } else {
                favori.textContent = "♡ Favori";
                favori.style.color = "white";
            }
        }

        actualiserFavori();

        favori.addEventListener("click", function () {
            basculerFavori(film.id);
        });

        actions.appendChild(bouton);
        actions.appendChild(favori);

        informations.appendChild(titre);
        informations.appendChild(vues);
        informations.appendChild(actions);

        carte.appendChild(poster);
        carte.appendChild(informations);

        return carte;
    }

    /* ======================================
       AFFICHER TOP 10
    ====================================== */

    function afficherTop10() {
        if (!movieGrid) return;

        installerStyleTop10();

        installerSectionTop10();

        if (!top10Grid) return;

        top10Grid.innerHTML = "";

        const classement = catalogueFilms
            .slice()
            .sort(function (a, b) {
                return b.nombre_vues - a.nombre_vues;
            })
            .slice(0, 10);

        if (classement.length === 0) {
            const message = document.createElement("p");
            message.className = "mobilus-top10-empty";
            message.textContent = "Aucun classement disponible.";

            top10Grid.appendChild(message);
            return;
        }

        classement.forEach(function (film, index) {
            top10Grid.appendChild(
                creerCarteTop10(film, index + 1)
            );
        });
    }

    /* ======================================
       SECTION TENDANCES MOBILUS
    ====================================== */

    function installerSectionTendances() {
        if (!movieGrid || !movieGrid.parentNode) return null;

        let section = document.getElementById(
            "mobilusTendances"
        );

        if (!section) {
            section = document.createElement("section");
            section.id = "mobilusTendances";
            section.className = "mobilus-tendances-section";

            const titre = document.createElement("h2");
            titre.className = "mobilus-tendances-title";
            titre.innerHTML = 'TENDANCES <span>MOBILUS</span>';

            const sousTitre = document.createElement("p");
            sousTitre.className = "mobilus-tendances-subtitle";
            sousTitre.textContent =
                "Les contenus les plus regardés sur MOBILUS.";

            const onglets = document.createElement("div");
            onglets.className = "mobilus-tendances-tabs";

            const bouton24h = document.createElement("button");
            bouton24h.type = "button";
            bouton24h.className = "mobilus-tendances-tab";
            bouton24h.dataset.periode = "24h";
            bouton24h.textContent = "Dernières 24 heures";

            const bouton7j = document.createElement("button");
            bouton7j.type = "button";
            bouton7j.className = "mobilus-tendances-tab";
            bouton7j.dataset.periode = "7j";
            bouton7j.textContent = "7 derniers jours";

            onglets.appendChild(bouton24h);
            onglets.appendChild(bouton7j);

            const grille = document.createElement("div");
            grille.id = "mobilusTendancesGrid";
            grille.className = "mobilus-tendances-grid";

            section.appendChild(titre);
            section.appendChild(sousTitre);
            section.appendChild(onglets);
            section.appendChild(grille);

            if (
                top10Section &&
                top10Section.parentNode === movieGrid.parentNode
            ) {
                top10Section.insertAdjacentElement(
                    "afterend",
                    section
                );
            } else {
                movieGrid.parentNode.insertBefore(
                    section,
                    movieGrid
                );
            }
        }

        tendancesSection = section;

        tendancesGrid = document.getElementById(
            "mobilusTendancesGrid"
        );

        if (!tendancesGrid) {
            tendancesGrid = document.createElement("div");
            tendancesGrid.id = "mobilusTendancesGrid";
            tendancesGrid.className = "mobilus-tendances-grid";
            section.appendChild(tendancesGrid);
        }

        const boutons = section.querySelectorAll(
            ".mobilus-tendances-tab"
        );

        boutons.forEach(function (bouton) {
            if (bouton.dataset.mobilusListener === "true") {
                return;
            }

            bouton.dataset.mobilusListener = "true";

            bouton.addEventListener("click", function () {
                chargerTendances(bouton.dataset.periode);
            });
        });

        actualiserOngletsTendances();

        return section;
    }

    /* ======================================
       ACTUALISER LES ONGLETS TENDANCES
    ====================================== */

    function actualiserOngletsTendances() {
        if (!tendancesSection) return;

        tendancesSection.querySelectorAll(
            ".mobilus-tendances-tab"
        ).forEach(function (bouton) {
            bouton.classList.toggle(
                "active",
                bouton.dataset.periode === periodeTendancesActive
            );
        });
    }

    /* ======================================
       CHARGER LES TENDANCES DEPUIS SUPABASE
    ====================================== */

    async function chargerTendances(periode) {
        if (periode !== "24h" && periode !== "7j") {
            return;
        }

        periodeTendancesActive = periode;

        installerStyleTop10();
        installerSectionTop10();
        installerSectionTendances();

        actualiserOngletsTendances();

        if (!tendancesGrid) return;

        tendancesGrid.innerHTML = "";

        const chargement = document.createElement("p");
        chargement.className = "mobilus-tendances-loading";
        chargement.textContent =
            "Chargement des tendances...";

        tendancesGrid.appendChild(chargement);

        if (!window.mobilusDB) {
            tendancesGrid.innerHTML = "";

            const message = document.createElement("p");
            message.className = "mobilus-tendances-error";
            message.textContent =
                "Connexion à Supabase indisponible.";

            tendancesGrid.appendChild(message);
            return;
        }

        try {
            const resultat = await avecDelai(
                window.mobilusDB.rpc(
                    "obtenir_tendances_mobilus",
                    {
                        p_periode: periode
                    }
                ),
                10000
            );

            if (resultat.error) {
                throw resultat.error;
            }

            let contenus = resultat.data;

            if (typeof contenus === "string") {
                contenus = JSON.parse(contenus);
            }

            if (!Array.isArray(contenus)) {
                contenus = [];
            }

            afficherTendances(contenus, periode);

        } catch (erreur) {
            console.error(
                "Erreur de chargement des tendances :",
                erreur
            );

            tendancesGrid.innerHTML = "";

            const message = document.createElement("p");
            message.className = "mobilus-tendances-error";
            message.textContent =
                "Impossible de charger les tendances pour le moment.";

            tendancesGrid.appendChild(message);
        }
    }

    /* ======================================
       AFFICHER LES TENDANCES
    ====================================== */

    function afficherTendances(contenus, periode) {
        if (!tendancesGrid) return;

        tendancesGrid.innerHTML = "";

        if (!Array.isArray(contenus) || contenus.length === 0) {
            const message = document.createElement("p");
            message.className = "mobilus-tendances-empty";

            message.textContent =
                periode === "24h"
                    ? "Aucune lecture enregistrée durant les dernières 24 heures."
                    : "Aucune lecture enregistrée durant les 7 derniers jours.";

            tendancesGrid.appendChild(message);
            return;
        }

        contenus.forEach(function (contenu, index) {
            const filmNormalise = normaliserFilm(contenu);

            const filmExistant = catalogueFilms.find(
                function (element) {
                    return String(element.id) === String(filmNormalise.id);
                }
            );

            const film = filmExistant || filmNormalise;

            if (!filmExistant) {
                catalogueFilms.push(film);
            }

            const nombreLectures = Math.max(
                0,
                Number(contenu.vues_periode) || 0
            );

            tendancesGrid.appendChild(
                creerCarteTop10(
                    film,
                    index + 1,
                    nombreLectures,
                    periode === "24h" ? "24 h" : "7 jours"
                )
            );
        });
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
        afficherTop10();

        if (document.getElementById("favoris")) {
            afficherFavoris();
        }
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
                    to {
                        transform: rotate(360deg);
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
                "film.html?id=" +
                encodeURIComponent(film.id);
        }, 1500);
    }

    /* ======================================
       CRÉATION DES CARTES DU CATALOGUE
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

        const vues = document.createElement("div");
        vues.className = "mobilus-movie-views";
        vues.textContent =
            "▶ " + formaterNombreVues(film.nombre_vues);

        vues.style.cssText = `
            color: #ffd400;
            font-size: 12px;
            font-weight: bold;
            margin: 8px 0 10px;
        `;

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
        informations.appendChild(vues);
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
            const titre = normaliserTexte(film.title);
            const categorie = normaliserTexte(film.category);
            const description = normaliserTexte(film.description);

            const correspondRecherche =
                titre.includes(rechercheActive) ||
                categorie.includes(rechercheActive) ||
                description.includes(rechercheActive);

            const correspondCategorie =
                categorieActive === "Tous" ||
                categorie === normaliserTexte(categorieActive);

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
       BOUTON RECHERCHER
    ====================================== */

    function installerRecherche() {
        if (!searchInput) return;

        const conteneur = searchInput.closest(".search-box");

        if (!conteneur) return;

        let bouton = document.getElementById("mobilusSearchButton");

        if (!bouton) {
            bouton = document.createElement("button");

            bouton.id = "mobilusSearchButton";
            bouton.type = "button";
            bouton.textContent = "Rechercher";
            bouton.className = "mobilus-search-button";

            bouton.style.cssText = `
                padding: 12px 18px;
                background: #e50920;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                margin-left: 8px;
            `;

            conteneur.appendChild(bouton);
        }

        function lancerRecherche() {
            rechercheActive = normaliserTexte(searchInput.value);
            afficherFilms();

            if (movieGrid) {
                movieGrid.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }

        bouton.addEventListener("click", lancerRecherche);

        searchInput.addEventListener("input", function () {
            rechercheActive = normaliserTexte(searchInput.value);
            afficherFilms();
        });

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                lancerRecherche();
            }
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
       NAVIGATION DES SECTIONS
    ====================================== */

    window.afficherSection = function (id, bouton) {
        const sections = document.querySelectorAll(
            "main section[id], .page-section"
        );

        sections.forEach(function (section) {
            section.style.display =
                section.id === id ? "" : "none";
        });

        if (bouton) {
            document.querySelectorAll(
                ".bottom-nav button, .bottom-nav a"
            ).forEach(function (element) {
                element.classList.remove("active");
            });

            bouton.classList.add("active");
        }

        if (id === "favoris") {
            afficherFavoris();
        }

        if (id === "recent") {
            afficherRecents();
        }

        const cible = document.getElementById(id);

        if (cible) {
            cible.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    /* ======================================
       AFFICHER LES FAVORIS
    ====================================== */

    function afficherFavoris() {
        const section = document.getElementById("favoris");

        if (!section) return;

        const favoris = recupererFavoris();

        const filmsFavoris = catalogueFilms.filter(function (film) {
            return favoris.some(function (id) {
                return String(id) === String(film.id);
            });
        });

        let grille = section.querySelector(".movie-grid");

        if (!grille) {
            grille = document.createElement("div");
            grille.className = "movie-grid";
            section.appendChild(grille);
        }

        grille.innerHTML = "";

        if (filmsFavoris.length === 0) {
            grille.textContent = "Aucun favori pour le moment.";
            return;
        }

        filmsFavoris.forEach(function (film) {
            grille.appendChild(creerCarte(film));
        });
    }

    /* ======================================
       AFFICHER LES RÉCENTS
    ====================================== */

    function afficherRecents() {
        const section = document.getElementById("recent");

        if (!section) return;

        let recents = [];

        try {
            recents = JSON.parse(
                localStorage.getItem(STORAGE_RECENTS) || "[]"
            );
        } catch (erreur) {
            recents = [];
        }

        if (!Array.isArray(recents)) recents = [];

        let grille = section.querySelector(".movie-grid");

        if (!grille) {
            grille = document.createElement("div");
            grille.className = "movie-grid";
            section.appendChild(grille);
        }

        grille.innerHTML = "";

        const filmsRecents = recents.map(function (recent) {
            return catalogueFilms.find(function (film) {
                return String(film.id) === String(recent.id);
            });
        }).filter(Boolean);

        if (filmsRecents.length === 0) {
            grille.textContent = "Aucun contenu récemment regardé.";
            return;
        }

        filmsRecents.forEach(function (film) {
            grille.appendChild(creerCarte(film));
        });
    }

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

    installerRecherche();
    chargerCatalogue();

    console.log("MOBILUS : application initialisée.");

});
