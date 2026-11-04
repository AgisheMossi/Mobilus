"use strict";
/* =========================================
   MOBILUS — ADMINISTRATION
   Stockage actuel : localStorage
========================================= */
const STORAGE_KEY = "mobilusFilms";
const FEATURED_KEY = "mobilusFeatured";
const form = document.getElementById("filmForm");
const filmIdInput = document.getElementById("filmId");
const titreInput = document.getElementById("titre");
const anneeInput = document.getElementById("annee");
const typeInput = document.getElementById("type");
const categorieInput = document.getElementById("categorie");
const emojiInput = document.getElementById("emoji");
const descriptionInput = document.getElementById("description");
const dureeInput = document.getElementById("duree");
const langueInput = document.getElementById("langue");
const classificationInput = document.getElementById("classification");
const featuredInput = document.getElementById("featured");
const imageFileInput = document.getElementById("imageFile");
const videoFileInput = document.getElementById("videoFile");
const imageUrlInput = document.getElementById("imageUrl");
const videoUrlInput = document.getElementById("videoUrl");
const localFields = document.getElementById("localFields");
const onlineFields = document.getElementById("onlineFields");
const modeLocalCard = document.getElementById("modeLocalCard");
const modeOnlineCard = document.getElementById("modeOnlineCard");
const imagePreview = document.getElementById("imagePreview");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const previewName = document.getElementById("previewName");
const filmsList = document.getElementById("filmsList");
const emptyMessage = document.getElementById("emptyMessage");
const searchAdmin = document.getElementById("searchAdmin");
const filterType = document.getElementById("filterType");
const saveButton = document.getElementById("saveButton");
const cancelEditButton = document.getElementById("cancelEdit");
let imageChoisie = "";
let imageObjectURL = "";
let videoLocaleTemporaire = "";
/* =========================================
   OUTILS
========================================= */
function valeurTexte(valeur) {
    return valeur === null || valeur === undefined
        ? ""
        : String(valeur);
}
function obtenirTitre(film) {
    return film.titre || film.title || film.nom || "Sans titre";
}
function obtenirType(film) {
    const type = valeurTexte(film.type || film.format).toLowerCase();
    return ["série", "serie", "series", "tv", "série tv"].includes(type)
        ? "Série"
        : "Film";
}
function obtenirImage(film) {
    return film.image || film.poster || film.affiche || film.imageUrl || "";
}
function obtenirVideo(film) {
    return film.video || film.videoUrl || film.urlVideo || film.src || "";
}
function lireVedette() {
    try {
        return localStorage.getItem(FEATURED_KEY) || "";
    } catch (erreur) {
        return "";
    }
}
function enregistrerVedette(id) {
    try {
        if (id === null || id === undefined || id === "") {
            localStorage.removeItem(FEATURED_KEY);
        } else {
            localStorage.setItem(FEATURED_KEY, String(id));
        }
        return true;
    } catch (erreur) {
        console.error("Impossible d'enregistrer le contenu à la une :", erreur);
        alert("Impossible d'enregistrer le choix du contenu à la une.");
        return false;
    }
}
/* =========================================
   CHARGER LE CATALOGUE
========================================= */
function lireFilms() {
    try {
        const donnees = localStorage.getItem(STORAGE_KEY);
        if (donnees !== null) {
            const films = JSON.parse(donnees);
            if (Array.isArray(films)) {
                return films;
            }
        }
    } catch (erreur) {
        console.error("Erreur de lecture du catalogue :", erreur);
        alert("Le catalogue enregistré ne peut pas être lu.");
    }
    if (Array.isArray(window.films)) {
        return window.films.map(film => ({ ...film }));
    }
    return [];
}
/* =========================================
   ENREGISTRER LE CATALOGUE
========================================= */
function enregistrerFilms(liste) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(liste));
        return true;
    } catch (erreur) {
        console.error("Erreur d'enregistrement :", erreur);
        alert(
            "L'enregistrement a échoué.\n\n" +
            "Le stockage du navigateur est peut-être plein. " +
            "Essaie une affiche plus petite. " +
            "Les vidéos locales ne doivent pas être enregistrées " +
            "comme des liens temporaires."
        );
        return false;
    }
}
/* =========================================
   MODE LOCAL / INTERNET
========================================= */
function modeSelectionne() {
    const radio = document.querySelector('input[name="mode"]:checked');
    return radio ? radio.value : "local";
}
function actualiserMode() {
    const modeLocal = modeSelectionne() === "local";
    localFields.classList.toggle("hidden", !modeLocal);
    onlineFields.classList.toggle("hidden", modeLocal);
    modeLocalCard.classList.toggle("selected", modeLocal);
    modeOnlineCard.classList.toggle("selected", !modeLocal);
    if (modeLocal && imageFileInput.files[0]) {
        afficherImageLocale(imageFileInput.files[0]);
    } else if (!modeLocal) {
        afficherImageEnLigne(imageUrlInput.value.trim());
    }
}
document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", actualiserMode);
});
/* =========================================
   APERÇU DE L'AFFICHE
========================================= */
function afficherImage(source) {
    if (source) {
        imagePreview.src = source;
        imagePreview.classList.add("visible");
        previewPlaceholder.classList.add("hidden");
    } else {
        imagePreview.removeAttribute("src");
        imagePreview.classList.remove("visible");
        previewPlaceholder.classList.remove("hidden");
    }
}
function afficherImageLocale(fichier) {
    if (!fichier || !fichier.type.startsWith("image/")) {
        return;
    }
    if (imageObjectURL) {
        URL.revokeObjectURL(imageObjectURL);
    }
    imageObjectURL = URL.createObjectURL(fichier);
    afficherImage(imageObjectURL);
}
function afficherImageEnLigne(url) {
    if (url) {
        afficherImage(url);
    } else {
        afficherImage(imageChoisie);
    }
}
imageFileInput.addEventListener("change", function () {
    const fichier = imageFileInput.files[0];
    if (fichier) {
        if (!fichier.type.startsWith("image/")) {
            alert("Choisis un fichier image valide.");
            imageFileInput.value = "";
            return;
        }
        afficherImageLocale(fichier);
    }
});
imageUrlInput.addEventListener("input", function () {
    if (modeSelectionne() === "online") {
        afficherImageEnLigne(imageUrlInput.value.trim());
    }
});
imagePreview.addEventListener("error", function () {
    afficherImage("");
});
titreInput.addEventListener("input", function () {
    previewName.textContent =
        titreInput.value.trim() || "Ton titre apparaîtra ici";
});
/* =========================================
   CONVERTIR UNE IMAGE EN DONNÉES
========================================= */
function fichierVersDataURL(fichier) {
    return new Promise((resolve, reject) => {
        const lecteur = new FileReader();
        lecteur.onload = () => resolve(lecteur.result);
        lecteur.onerror = () => reject(lecteur.error);
        lecteur.readAsDataURL(fichier);
    });
}
/* =========================================
   VIDÉO LOCALE
========================================= */
videoFileInput.addEventListener("change", function () {
    const fichier = videoFileInput.files[0];
    if (!fichier) {
        return;
    }
    if (!fichier.type.startsWith("video/")) {
        alert("Choisis un fichier vidéo valide.");
        videoFileInput.value = "";
        return;
    }
    if (videoLocaleTemporaire) {
        URL.revokeObjectURL(videoLocaleTemporaire);
    }
    videoLocaleTemporaire = URL.createObjectURL(fichier);
    alert(
        "Vidéo sélectionnée : " + fichier.name +
        "\n\nCette vidéo est disponible temporairement sur cet appareil. " +
        "Pour la diffuser sur le site en ligne, utilise une vidéo hébergée."
    );
});
/* =========================================
   STATISTIQUES
========================================= */
function actualiserStatistiques() {
    const liste = lireFilms();
    document.getElementById("totalFilms").textContent = liste.length;
    document.getElementById("totalMovies").textContent =
        liste.filter(film => obtenirType(film) === "Film").length;
    document.getElementById("totalSeries").textContent =
        liste.filter(film => obtenirType(film) === "Série").length;
}
/* =========================================
   AFFICHER LE CATALOGUE ADMIN
========================================= */
function afficherCatalogue() {
    const liste = lireFilms();
    const recherche = searchAdmin.value.trim().toLowerCase();
    const filtre = filterType.value;
    const vedetteId = lireVedette();
    const resultats = liste.filter(film => {
        const titre = obtenirTitre(film).toLowerCase();
        const correspondRecherche = titre.includes(recherche);
        const correspondType =
            filtre === "Tous" || obtenirType(film) === filtre;
        return correspondRecherche && correspondType;
    });
    filmsList.replaceChildren();
    emptyMessage.classList.toggle("hidden", resultats.length !== 0);
    resultats.forEach(film => {
        const ligne = document.createElement("article");
        ligne.className = "film-row";
        const image = obtenirImage(film);
        if (image) {
            const img = document.createElement("img");
            img.className = "film-thumb";
            img.src = image;
            img.alt = obtenirTitre(film);
            img.loading = "lazy";
            img.onerror = function () {
                const placeholder = document.createElement("div");
                placeholder.className = "film-thumb film-thumb-placeholder";
                placeholder.textContent = film.emoji || "🎬";
                img.replaceWith(placeholder);
            };
            ligne.appendChild(img);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "film-thumb film-thumb-placeholder";
            placeholder.textContent = film.emoji || "🎬";
            ligne.appendChild(placeholder);
        }
        const details = document.createElement("div");
        details.className = "film-details";
        const titre = document.createElement("h3");
        titre.textContent = obtenirTitre(film);
        const meta = document.createElement("p");
        meta.className = "film-meta";
        meta.textContent =
            obtenirType(film) + " • " +
            (film.annee || film.year || "Année inconnue") + " • " +
            (film.categorie || film.category || "Autre");
        const description = document.createElement("p");
        description.className = "film-description";
        description.textContent =
            film.description || "Aucune description.";
        details.appendChild(titre);
        details.appendChild(meta);
        details.appendChild(description);
        if (film.duree || film.langue || film.classification) {
            const informations = document.createElement("p");
            informations.className = "film-meta";
            informations.textContent = [
                film.duree,
                film.langue,
                film.classification
            ].filter(Boolean).join(" • ");
            details.appendChild(informations);
        }
        if (String(film.id) === String(vedetteId)) {
            const badge = document.createElement("p");
            badge.className = "film-meta";
            badge.textContent = "⭐ CONTENU À LA UNE";
            details.appendChild(badge);
        }
        const actions = document.createElement("div");
        actions.className = "film-actions";
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-button";
        editButton.textContent = "Modifier";
        editButton.addEventListener("click", function () {
            modifierFilm(film.id);
        });
        const featuredButton = document.createElement("button");
        featuredButton.type = "button";
        featuredButton.className = "edit-button";
        featuredButton.textContent =
            String(film.id) === String(vedetteId)
                ? "Retirer de la une"
                : "Mettre à la une";
        featuredButton.addEventListener("click", function () {
            choisirVedette(film.id);
        });
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Supprimer";
        deleteButton.addEventListener("click", function () {
            supprimerFilm(film.id);
        });
        actions.appendChild(editButton);
        actions.appendChild(featuredButton);
        actions.appendChild(deleteButton);
        ligne.appendChild(details);
        ligne.appendChild(actions);
        filmsList.appendChild(ligne);
    });
    actualiserStatistiques();
}
/* =========================================
   CHOISIR LE CONTENU À LA UNE
========================================= */
function choisirVedette(id) {
    const liste = lireFilms();
    const film = liste.find(
        element => String(element.id) === String(id)
    );
    if (!film) {
        alert("Ce contenu n'a pas été trouvé.");
        return;
    }
    const idActuel = lireVedette();
    if (String(idActuel) === String(id)) {
        if (!confirm("Retirer ce contenu de la une ?")) {
            return;
        }
        if (!enregistrerVedette("")) {
            return;
        }
        featuredInput.checked = false;
        alert("Le contenu a été retiré de la une.");
    } else {
        if (!enregistrerVedette(id)) {
            return;
        }
        featuredInput.checked = false;
        alert(
            '"' + obtenirTitre(film) +
            '" est maintenant le contenu à la une.'
        );
    }
    afficherCatalogue();
}
/* =========================================
   AJOUTER OU MODIFIER UN CONTENU
========================================= */
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const titre = titreInput.value.trim();
    const annee = Number(anneeInput.value);
    const type = typeInput.value;
    const categorie = categorieInput.value;
    const emoji = emojiInput.value.trim() || "🎬";
    const description = descriptionInput.value.trim();
    const duree = dureeInput.value.trim();
    const langue = langueInput.value;
    const classification = classificationInput.value;
    const estVedette = featuredInput.checked;
    const mode = modeSelectionne();
    if (!titre) {
        alert("Saisis le titre du film ou de la série.");
        return;
    }
    if (!Number.isInteger(annee) || annee < 1900 || annee > 2100) {
        alert("Saisis une année valide.");
        return;
    }
    const liste = lireFilms();
    const idExistant = filmIdInput.value;
    const ancienFilm = idExistant
        ? liste.find(film => String(film.id) === idExistant)
        : null;
    let image = ancienFilm ? obtenirImage(ancienFilm) : "";
    let video = ancienFilm ? obtenirVideo(ancienFilm) : "";
    /* IMAGE ET VIDÉO : MODE LOCAL */
    if (mode === "local") {
        const imageFile = imageFileInput.files[0];
        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                alert("Le fichier choisi pour l'affiche n'est pas une image.");
                return;
            }
            try {
                image = await fichierVersDataURL(imageFile);
            } catch (erreur) {
                alert("Impossible de lire l'image sélectionnée.");
                return;
            }
        }
        const videoFile = videoFileInput.files[0];
        if (videoFile) {
            if (!videoFile.type.startsWith("video/")) {
                alert("Le fichier choisi n'est pas une vidéo.");
                return;
            }
            /*
             * Ce lien temporaire sert à la lecture locale.
             * Il ne constitue pas un hébergement permanent.
             */
            video = URL.createObjectURL(videoFile);
        }
    }
    /* IMAGE ET VIDÉO : MODE INTERNET */
    if (mode === "online") {
        const imageUrl = imageUrlInput.value.trim();
        const videoUrl = videoUrlInput.value.trim();
        if (imageUrl) {
            try {
                const adresseImage = new URL(imageUrl);
                if (!["http:", "https:"].includes(adresseImage.protocol)) {
                    throw new Error("Protocole non accepté");
                }
                image = imageUrl;
            } catch (erreur) {
                alert("Le lien de l'affiche n'est pas valide.");
                return;
            }
        }
        if (videoUrl) {
            try {
                const adresseVideo = new URL(videoUrl);
                if (!["http:", "https:"].includes(adresseVideo.protocol)) {
                    throw new Error("Protocole non accepté");
                }
                video = videoUrl;
            } catch (erreur) {
                alert("Le lien de la vidéo n'est pas valide.");
                return;
            }
        }
    }
    /*
     * Si on modifie un contenu existant, les champs non remplacés
     * conservent leurs valeurs précédentes.
     */
    const film = {
        ...(ancienFilm || {}),
        id: ancienFilm ? ancienFilm.id : Date.now(),
        titre: titre,
        annee: annee,
        type: type,
        categorie: categorie,
        emoji: emoji,
        image: image,
        video: video,
        description: description,
        duree: duree,
        langue: langue,
        classification: classification,
        featured: estVedette
    };
    let nouvelleListe;
    if (ancienFilm) {
        nouvelleListe = liste.map(element =>
            String(element.id) === String(idExistant)
                ? film
                : element
        );
    } else {
        nouvelleListe = [film, ...liste];
    }
    saveButton.disabled = true;
    saveButton.textContent = "Enregistrement...";
    const succes = enregistrerFilms(nouvelleListe);
    if (!succes) {
        saveButton.disabled = false;
        saveButton.textContent = ancienFilm
            ? "Enregistrer les modifications"
            : "＋ Ajouter au catalogue";
        return;
    }
    /*
     * Une seule vedette est conservée.
     * Cocher la case remplace le choix précédent.
     */
    if (estVedette) {
        if (!enregistrerVedette(film.id)) {
            saveButton.disabled = false;
            saveButton.textContent = "Enregistrer les modifications";
            return;
        }
    } else if (String(lireVedette()) === String(film.id)) {
        if (!enregistrerVedette("")) {
            saveButton.disabled = false;
            saveButton.textContent = "Enregistrer les modifications";
            return;
        }
    }
    saveButton.disabled = false;
    alert(
        ancienFilm
            ? "Le contenu a été modifié."
            : "Le contenu a été ajouté au catalogue."
    );
    reinitialiserFormulaire();
    afficherCatalogue();
});
/* =========================================
   MODIFIER UN CONTENU EXISTANT
========================================= */
function modifierFilm(id) {
    const liste = lireFilms();
    const film = liste.find(
        element => String(element.id) === String(id)
    );
    if (!film) {
        alert("Ce contenu n'a pas été trouvé.");
        return;
    }
    filmIdInput.value = String(film.id);
    titreInput.value = obtenirTitre(film);
    anneeInput.value = film.annee || film.year || "";
    typeInput.value = obtenirType(film);
    emojiInput.value = film.emoji || "🎬";
    descriptionInput.value =
        film.description || film.synopsis || "";
    dureeInput.value = film.duree || "";
    langueInput.value = film.langue || "";
    classificationInput.value = film.classification || "";
    const categorie = film.categorie || film.category || "Autre";
    const categorieExiste = Array.from(categorieInput.options)
        .some(option => option.value === categorie);
    categorieInput.value = categorieExiste ? categorie : "Autre";
    imageChoisie = obtenirImage(film);
    imageUrlInput.value = "";
    videoUrlInput.value = "";
    imageFileInput.value = "";
    videoFileInput.value = "";
    if (videoLocaleTemporaire) {
        URL.revokeObjectURL(videoLocaleTemporaire);
        videoLocaleTemporaire = "";
    }
    featuredInput.checked =
        String(lireVedette()) === String(film.id);
    const video = obtenirVideo(film);
    if (
        /^https?:\/\//i.test(video) ||
        /^data:/i.test(video)
    ) {
        document.querySelector(
            'input[name="mode"][value="online"]'
        ).checked = true;
        if (/^https?:\/\//i.test(video)) {
            videoUrlInput.value = video;
        }
        imageUrlInput.value =
            /^https?:\/\//i.test(imageChoisie)
                ? imageChoisie
                : "";
    } else {
        document.querySelector(
            'input[name="mode"][value="local"]'
        ).checked = true;
    }
    actualiserMode();
    if (imageChoisie) {
        afficherImage(imageChoisie);
    } else {
        afficherImage("");
    }
    previewName.textContent = obtenirTitre(film);
    document.getElementById("formTitle").textContent =
        "Modifier un film ou une série";
    saveButton.textContent = "Enregistrer les modifications";
    cancelEditButton.classList.remove("hidden");
    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
/* =========================================
   SUPPRIMER UN CONTENU
========================================= */
function supprimerFilm(id) {
    const liste = lireFilms();
    const film = liste.find(
        element => String(element.id) === String(id)
    );
    if (!film) {
        alert("Ce contenu n'a pas été trouvé.");
        return;
    }
    const confirmation = confirm(
        'Veux-tu vraiment supprimer "' +
        obtenirTitre(film) +
        '" ?'
    );
    if (!confirmation) {
        return;
    }
    const nouvelleListe = liste.filter(
        element => String(element.id) !== String(id)
    );
    if (!enregistrerFilms(nouvelleListe)) {
        return;
    }
    if (String(lireVedette()) === String(id)) {
        enregistrerVedette("");
    }
    try {
        const favoris = JSON.parse(
            localStorage.getItem("mobilusFavoris") || "[]"
        );
        if (Array.isArray(favoris)) {
            localStorage.setItem(
                "mobilusFavoris",
                JSON.stringify(
                    favoris.filter(
                        favori => String(favori) !== String(id)
                    )
                )
            );
        }
    } catch (erreur) {
        console.error("Impossible de mettre à jour les favoris :", erreur);
    }
    if (String(filmIdInput.value) === String(id)) {
        reinitialiserFormulaire();
    }
    afficherCatalogue();
}
/* =========================================
   RÉINITIALISER LE FORMULAIRE
========================================= */
function reinitialiserFormulaire() {
    form.reset();
    filmIdInput.value = "";
    imageChoisie = "";
    if (imageObjectURL) {
        URL.revokeObjectURL(imageObjectURL);
        imageObjectURL = "";
    }
    if (videoLocaleTemporaire) {
        URL.revokeObjectURL(videoLocaleTemporaire);
        videoLocaleTemporaire = "";
    }
    imageFileInput.value = "";
    videoFileInput.value = "";
    imageUrlInput.value = "";
    videoUrlInput.value = "";
    document.querySelector(
        'input[name="mode"][value="local"]'
    ).checked = true;
    actualiserMode();
    afficherImage("");
    previewName.textContent = "Ton titre apparaîtra ici";
    document.getElementById("formTitle").textContent =
        "Ajouter un film ou une série";
    saveButton.textContent = "＋ Ajouter au catalogue";
    saveButton.disabled = false;
    cancelEditButton.classList.add("hidden");
}
cancelEditButton.addEventListener(
    "click",
    reinitialiserFormulaire
);
/* =========================================
   RECHERCHE ET FILTRES
========================================= */
searchAdmin.addEventListener("input", afficherCatalogue);
filterType.addEventListener("change", afficherCatalogue);
/* =========================================
   INITIALISATION
========================================= */
actualiserMode();
afficherCatalogue();