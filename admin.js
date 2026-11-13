
"use strict";

/* =========================================
   MOBILUS — ADMINISTRATION SUPABASE
========================================= */

const STORAGE_KEY = "mobilusFilms";

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

/* NOUVEAUX CHAMPS : INTRODUCTION */
const introDebutInput =
    document.getElementById("introDebutSecondes");

const introFinInput =
    document.getElementById("introFinSecondes");

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

let films = [];
let imageChoisie = "";
let imageObjectURL = "";
let chargementTermine = false;

/* =========================================
   CHAMPS GRATUIT / PREMIUM ET PUBLICATION
========================================= */

const optionsSecurite = document.createElement("div");
optionsSecurite.className = "form-grid";

optionsSecurite.innerHTML = `
    <div class="field">
        <label for="niveauAcces">Accès au contenu *</label>
        <select id="niveauAcces" required>
            <option value="gratuit">Gratuit</option>
            <option value="premium">Premium</option>
        </select>
    </div>

    <div class="field">
        <label for="statutPublication">Publication *</label>
        <select id="statutPublication" required>
            <option value="false">Brouillon</option>
            <option value="true">Publié</option>
        </select>
        <small>
            Les nouveaux contenus sont enregistrés comme brouillons.
        </small>
    </div>
`;

form.insertBefore(
    optionsSecurite,
    form.querySelector(".divider")
);

const niveauAccesInput = document.getElementById("niveauAcces");
const statutPublicationInput =
    document.getElementById("statutPublication");

/* =========================================
   CONNEXION SUPABASE
========================================= */

async function obtenirBase() {
    let tentatives = 0;

    while (!window.mobilusDB && tentatives < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        tentatives++;
    }

    if (!window.mobilusDB) {
        throw new Error("Connexion à Supabase impossible.");
    }

    const { data, error } =
        await window.mobilusDB.auth.getSession();

    if (error || !data.session) {
        throw new Error("Ta session a expiré. Reconnecte-toi.");
    }

    return window.mobilusDB;
}

/* =========================================
   OUTILS
========================================= */

function valeurTexte(valeur) {
    return valeur === null || valeur === undefined
        ? ""
        : String(valeur);
}

function obtenirTitre(film) {
    return film.titre || film.title || "Sans titre";
}

function obtenirType(film) {
    const type = valeurTexte(film.type).toLowerCase();

    return type === "serie" || type === "série"
        ? "Série"
        : "Film";
}

function obtenirImage(film) {
    return film.image_url || film.image || "";
}

function obtenirVideo(film) {
    return film.video_url || film.video || "";
}

function estPublie(film) {
    return film.publie === true;
}

function afficherErreur(erreur) {
    console.error("MOBILUS ADMIN :", erreur);

    alert(
        erreur.message ||
        "Une erreur est survenue pendant l'opération."
    );
}

/* =========================================
   VALIDATION DE L'INTRODUCTION
========================================= */

function obtenirParametresIntroduction() {
    const debutBrut = introDebutInput.value.trim();
    const finBrut = introFinInput.value.trim();

    // Les deux champs doivent être remplis ensemble.
    if (!debutBrut && !finBrut) {
        return {
            debut: null,
            fin: null
        };
    }

    if (!debutBrut || !finBrut) {
        throw new Error(
            "Renseigne le début ET la fin de l'introduction, " +
            "ou laisse les deux champs vides."
        );
    }

    const debut = Number(debutBrut);
    const fin = Number(finBrut);

    if (
        !Number.isInteger(debut) ||
        !Number.isInteger(fin) ||
        debut < 0 ||
        fin < 0
    ) {
        throw new Error(
            "Les temps de l'introduction doivent être des " +
            "nombres entiers positifs ou nuls."
        );
    }

    if (fin <= debut) {
        throw new Error(
            "La fin de l'introduction doit être supérieure " +
            "au début."
        );
    }

    return {
        debut: debut,
        fin: fin
    };
}

/* =========================================
   EXTRAIRE LE CHEMIN D'UNE VIDÉO SUPABASE
========================================= */

function extraireCheminVideoPrivee(lien) {
    if (!lien) return "";

    try {
        const url = new URL(lien);

        // Vérifier qu'il s'agit bien de ton projet Supabase.
        if (
            url.hostname !==
            "uoxccezhznxmgggjupqd.supabase.co"
        ) {
            return "";
        }

        const parties = url.pathname.split("/");

        // Format attendu :
        // /storage/v1/object/sign/mobilus-videos/Videos/fichier.mp4

        if (
            parties[1] !== "storage" ||
            parties[2] !== "v1" ||
            parties[3] !== "object"
        ) {
            return "";
        }

        const typeLien = parties[4];

        if (
            typeLien !== "sign" &&
            typeLien !== "authenticated" &&
            typeLien !== "public"
        ) {
            return "";
        }

        const bucket = parties[5];

        if (bucket !== "mobilus-videos") {
            return "";
        }

        const cheminEncode = parties.slice(6).join("/");

        if (!cheminEncode) {
            return "";
        }

        const cheminFichier = decodeURIComponent(cheminEncode);

        if (
            !cheminFichier ||
            cheminFichier.includes("..")
        ) {
            return "";
        }

        // Ne jamais enregistrer le jeton de signature.
        return "mobilus-videos/" + cheminFichier;

    } catch (erreur) {
        console.error(
            "Impossible d'extraire le chemin Supabase :",
            erreur
        );

        return "";
    }
}

/* =========================================
   CHARGER LES CONTENUS DEPUIS SUPABASE
========================================= */

async function chargerFilms() {
    try {
        const db = await obtenirBase();

        const { data, error } = await db
            .from("contenus")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        films = Array.isArray(data) ? data : [];

        chargementTermine = true;

        afficherCatalogue();
        actualiserStatistiques();

    } catch (erreur) {
        afficherErreur(erreur);

        filmsList.innerHTML =
            "<p>Impossible de charger le catalogue.</p>";
    }
}

/* =========================================
   MODE LOCAL / INTERNET
========================================= */

function modeSelectionne() {
    const radio = document.querySelector(
        'input[name="mode"]:checked'
    );

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
    afficherImage(url || imageChoisie);
}

imageFileInput.addEventListener("change", () => {
    const fichier = imageFileInput.files[0];

    if (!fichier) return;

    if (!fichier.type.startsWith("image/")) {
        alert("Choisis une image valide.");
        imageFileInput.value = "";
        return;
    }

    afficherImageLocale(fichier);
});

imageUrlInput.addEventListener("input", () => {
    if (modeSelectionne() === "online") {
        afficherImageEnLigne(imageUrlInput.value.trim());
    }
});

imagePreview.addEventListener("error", () => {
    afficherImage("");
});

titreInput.addEventListener("input", () => {
    previewName.textContent =
        titreInput.value.trim() || "Ton titre apparaîtra ici";
});

/* =========================================
   VALIDATION DES URL
========================================= */

function urlValide(valeur) {
    if (!valeur) return "";

    try {
        const url = new URL(valeur);

        if (!["http:", "https:"].includes(url.protocol)) {
            return "";
        }

        return url.href;

    } catch {
        return "";
    }
}

/* =========================================
   TÉLÉVERSEMENT DES AFFICHES
========================================= */

async function televerserImage(fichier, db) {
    if (!fichier) return "";

    if (!fichier.type.startsWith("image/")) {
        throw new Error("Le fichier d'affiche est invalide.");
    }

    const extension =
        fichier.name.split(".").pop().toLowerCase();

    const nomFichier =
        crypto.randomUUID() + "." + extension;

    const chemin = "affiches/" + nomFichier;

    const { error } = await db.storage
        .from("mobilus-images")
        .upload(chemin, fichier, {
            cacheControl: "3600",
            upsert: false
        });

    if (error) throw error;

    const { data } = db.storage
        .from("mobilus-images")
        .getPublicUrl(chemin);

    return data.publicUrl;
}

/* =========================================
   TÉLVERSEMENT DES VIDÉOS PRIVÉES
========================================= */

async function televerserVideo(fichier, db) {
    if (!fichier) return "";

    if (!fichier.type.startsWith("video/")) {
        throw new Error("Le fichier vidéo est invalide.");
    }

    const extension =
        fichier.name.split(".").pop().toLowerCase();

    const nomFichier =
        crypto.randomUUID() + "." + extension;

    const chemin = "videos/" + nomFichier;

    const { error } = await db.storage
        .from("mobilus-videos")
        .upload(chemin, fichier, {
            cacheControl: "0",
            upsert: false
        });

    if (error) throw error;

    return "mobilus-videos/" + chemin;
}

/* =========================================
   STATISTIQUES
========================================= */

function actualiserStatistiques() {
    document.getElementById("totalFilms").textContent =
        films.length;

    document.getElementById("totalMovies").textContent =
        films.filter(
            film => obtenirType(film) === "Film"
        ).length;

    document.getElementById("totalSeries").textContent =
        films.filter(
            film => obtenirType(film) === "Série"
        ).length;
}

/* =========================================
   AFFICHAGE DU CATALOGUE ADMIN
========================================= */

function afficherCatalogue() {
    if (!chargementTermine) return;

    const recherche =
        searchAdmin.value.trim().toLowerCase();

    const filtre = filterType.value;

    const resultats = films.filter(film => {
        const titre = obtenirTitre(film).toLowerCase();

        const correspondRecherche =
            titre.includes(recherche);

        const correspondType =
            filtre === "Tous" ||
            obtenirType(film) === filtre;

        return correspondRecherche && correspondType;
    });

    filmsList.replaceChildren();

    emptyMessage.classList.toggle(
        "hidden",
        resultats.length !== 0
    );

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

            img.onerror = () => {
                const placeholder =
                    document.createElement("div");

                placeholder.className =
                    "film-thumb film-thumb-placeholder";

                placeholder.textContent =
                    film.emoji || "🎬";

                img.replaceWith(placeholder);
            };

            ligne.appendChild(img);

        } else {
            const placeholder =
                document.createElement("div");

            placeholder.className =
                "film-thumb film-thumb-placeholder";

            placeholder.textContent =
                film.emoji || "🎬";

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
            (film.annee || "Année inconnue") + " • " +
            (film.categorie || "Autre");

        const description = document.createElement("p");
        description.className = "film-description";

        description.textContent =
            film.description || "Aucune description.";

        const acces = document.createElement("p");
        acces.className = "film-meta";

        acces.textContent =
            "Accès : " +
            (
                film.niveau_acces === "premium"
                    ? "PREMIUM"
                    : "GRATUIT"
            );

        const publication = document.createElement("p");
        publication.className = "film-meta";

        publication.textContent = estPublie(film)
            ? "🟢 PUBLIÉ"
            : "🟠 BROUILLON";

        details.append(
            titre,
            meta,
            description,
            acces,
            publication
        );

        if (film.duree || film.langue || film.classification) {
            const informations =
                document.createElement("p");

            informations.className = "film-meta";

            informations.textContent = [
                film.duree,
                film.langue,
                film.classification
            ].filter(Boolean).join(" • ");

            details.appendChild(informations);
        }

        /* AFFICHER LES PARAMÈTRES DE L'INTRODUCTION */
        if (
            film.intro_debut_secondes !== null &&
            film.intro_debut_secondes !== undefined &&
            film.intro_fin_secondes !== null &&
            film.intro_fin_secondes !== undefined
        ) {
            const introduction =
                document.createElement("p");

            introduction.className = "film-meta";

            introduction.textContent =
                "⏭ Introduction : " +
                film.intro_debut_secondes +
                " s → " +
                film.intro_fin_secondes +
                " s";

            details.appendChild(introduction);
        }

        if (film.featured) {
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

        editButton.addEventListener("click", () => {
            modifierFilm(film.id);
        });

        const publicationButton =
            document.createElement("button");

        publicationButton.type = "button";
        publicationButton.className = "edit-button";

        publicationButton.textContent = estPublie(film)
            ? "Mettre en brouillon"
            : "Publier";

        publicationButton.addEventListener("click", () => {
            changerPublication(film);
        });

        const featuredButton =
            document.createElement("button");

        featuredButton.type = "button";
        featuredButton.className = "edit-button";

        featuredButton.textContent = film.featured
            ? "Retirer de la une"
            : "Mettre à la une";

        featuredButton.addEventListener("click", () => {
            choisirVedette(film);
        });

        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Supprimer";

        deleteButton.addEventListener("click", () => {
            supprimerFilm(film.id);
        });

        actions.append(
            editButton,
            publicationButton,
            featuredButton,
            deleteButton
        );

        ligne.append(details, actions);
        filmsList.appendChild(ligne);
    });

    actualiserStatistiques();
}

/* =========================================
   CONTENU À LA UNE
========================================= */

async function choisirVedette(film) {
    try {
        const db = await obtenirBase();

        if (film.featured) {
            if (!confirm(
                "Retirer ce contenu de la une ?"
            )) return;

            const { error } = await db
                .from("contenus")
                .update({ featured: false })
                .eq("id", film.id);

            if (error) throw error;

        } else {
            if (!confirm(
                "Mettre « " + obtenirTitre(film) +
                " » à la une ?"
            )) return;

            const { error: retraitErreur } = await db
                .from("contenus")
                .update({ featured: false })
                .eq("featured", true);

            if (retraitErreur) throw retraitErreur;

            const { error } = await db
                .from("contenus")
                .update({ featured: true })
                .eq("id", film.id);

            if (error) throw error;
        }

        await chargerFilms();

    } catch (erreur) {
        afficherErreur(erreur);
    }
}

/* =========================================
   PUBLICATION / BROUILLON
========================================= */

async function changerPublication(film) {
    const nouveauStatut = !estPublie(film);

    const confirmation = confirm(
        nouveauStatut
            ? "Publier « " + obtenirTitre(film) + " » ?"
            : "Retirer « " + obtenirTitre(film) +
              " » du catalogue public ?"
    );

    if (!confirmation) return;

    try {
        const db = await obtenirBase();

        const { error } = await db
            .from("contenus")
            .update({ publie: nouveauStatut })
            .eq("id", film.id);

        if (error) throw error;

        alert(
            nouveauStatut
                ? "Le contenu est maintenant publié."
                : "Le contenu est maintenant en brouillon."
        );

        await chargerFilms();

    } catch (erreur) {
        afficherErreur(erreur);
    }
}

/* =========================================
   AJOUTER / MODIFIER UN CONTENU
========================================= */

form.addEventListener("submit", async event => {
    event.preventDefault();

    const titre = titreInput.value.trim();
    const annee = Number(anneeInput.value);

    if (!titre) {
        alert("Saisis un titre.");
        return;
    }

    if (
        !Number.isInteger(annee) ||
        annee < 1900 ||
        annee > 2100
    ) {
        alert("Saisis une année valide.");
        return;
    }

    /* VALIDATION DES TEMPS DE L'INTRODUCTION */
    let parametresIntroduction;

    try {
        parametresIntroduction =
            obtenirParametresIntroduction();

    } catch (erreur) {
        alert(erreur.message);
        return;
    }

    const idExistant = filmIdInput.value;

    const ancienFilm = idExistant
        ? films.find(
            film => String(film.id) === idExistant
        )
        : null;

    const mode = modeSelectionne();

    saveButton.disabled = true;
    saveButton.textContent = "Enregistrement...";

    try {
        const db = await obtenirBase();

        let image = ancienFilm
            ? obtenirImage(ancienFilm)
            : "";

        let video = ancienFilm
            ? obtenirVideo(ancienFilm)
            : "";

        /* AFFICHES */

        if (mode === "local") {
            const imageFile = imageFileInput.files[0];

            if (imageFile) {
                image = await televerserImage(imageFile, db);
            }

        } else {
            const imageUrl = imageUrlInput.value.trim();

            if (imageUrl) {
                image = urlValide(imageUrl);

                if (!image) {
                    throw new Error(
                        "Le lien de l'affiche est invalide."
                    );
                }
            }
        }

        /* VIDÉOS */

        if (mode === "local") {
            const videoFile = videoFileInput.files[0];

            if (videoFile) {
                video = await televerserVideo(videoFile, db);
            }

        } else {
            const videoUrl = videoUrlInput.value.trim();

            if (videoUrl) {
                const cheminPrive =
                    extraireCheminVideoPrivee(videoUrl);

                if (cheminPrive) {
                    // Enregistrer uniquement le chemin,
                    // jamais le jeton temporaire.
                    video = cheminPrive;

                } else if (
                    niveauAccesInput.value === "premium"
                ) {
                    throw new Error(
                        "Lien vidéo Premium non reconnu. " +
                        "Utilise un lien signé du bucket privé " +
                        "mobilus-videos de ton projet Supabase."
                    );

                } else {
                    video = urlValide(videoUrl);

                    if (!video) {
                        throw new Error(
                            "Le lien vidéo est invalide."
                        );
                    }
                }
            }
        }

        /* VÉRIFICATION DES VIDÉOS PREMIUM */

        if (
            niveauAccesInput.value === "premium" &&
            video &&
            !video.startsWith("mobilus-videos/")
        ) {
            throw new Error(
                "Une vidéo Premium doit être hébergée " +
                "dans le stockage privé MOBILUS."
            );
        }

        if (
            niveauAccesInput.value === "premium" &&
            !video
        ) {
            throw new Error(
                "Ajoute une vidéo Premium avant d'enregistrer."
            );
        }

        /* DONNÉES DU CONTENU */

        const contenu = {
            titre: titre,
            annee: annee,
            type: typeInput.value === "Série"
                ? "serie"
                : "film",
            categorie: categorieInput.value,
            emoji: emojiInput.value.trim() || "🎬",
            description: descriptionInput.value.trim(),
            duree: dureeInput.value.trim(),
            langue: langueInput.value,
            classification: classificationInput.value,
            image_url: image,
            video_url: video,
            niveau_acces: niveauAccesInput.value,
            publie: ancienFilm
                ? statutPublicationInput.value === "true"
                : false,
            featured: featuredInput.checked,

            /* NOUVEAUX PARAMÈTRES DE L'INTRODUCTION */
            intro_debut_secondes:
                parametresIntroduction.debut,

            intro_fin_secondes:
                parametresIntroduction.fin
        };

        /* UNE SEULE VEDETTE */

        if (contenu.featured) {
            const { error } = await db
                .from("contenus")
                .update({ featured: false })
                .eq("featured", true);

            if (error) throw error;
        }

        /* INSERTION OU MODIFICATION */

        let resultat;

        if (ancienFilm) {
            resultat = await db
                .from("contenus")
                .update(contenu)
                .eq("id", ancienFilm.id);

        } else {
            resultat = await db
                .from("contenus")
                .insert({
                    ...contenu,
                    publie: false
                });
        }

        if (resultat.error) {
            throw resultat.error;
        }

        alert(
            ancienFilm
                ? "Le contenu a été modifié."
                : "Le contenu a été enregistré comme brouillon. " +
                  "Tu peux maintenant cliquer sur Publier dans le catalogue."
        );

        reinitialiserFormulaire();

        await chargerFilms();

    } catch (erreur) {
        afficherErreur(erreur);

    } finally {
        saveButton.disabled = false;

        saveButton.textContent = filmIdInput.value
            ? "Enregistrer les modifications"
            : "＋ Ajouter au catalogue";
    }
});

/* =========================================
   MODIFIER UN CONTENU
========================================= */

function modifierFilm(id) {
    const film = films.find(
        element => String(element.id) === String(id)
    );

    if (!film) {
        alert("Contenu introuvable.");
        return;
    }

    filmIdInput.value = film.id;

    titreInput.value = film.titre || "";
    anneeInput.value = film.annee || "";

    typeInput.value =
        film.type === "serie" ? "Série" : "Film";

    categorieInput.value = film.categorie || "Autre";
    emojiInput.value = film.emoji || "🎬";

    descriptionInput.value = film.description || "";
    dureeInput.value = film.duree || "";
    langueInput.value = film.langue || "";
    classificationInput.value = film.classification || "";

    niveauAccesInput.value =
        film.niveau_acces || "gratuit";

    statutPublicationInput.value =
        film.publie ? "true" : "false";

    featuredInput.checked = film.featured === true;

    /* RESTAURER LES PARAMÈTRES DE L'INTRODUCTION */
    introDebutInput.value =
        film.intro_debut_secondes ?? "";

    introFinInput.value =
        film.intro_fin_secondes ?? "";

    imageChoisie = obtenirImage(film);

    imageUrlInput.value = "";
    videoUrlInput.value = "";

    imageFileInput.value = "";
    videoFileInput.value = "";

    if (
        /^https?:\/\//i.test(obtenirVideo(film)) &&
        !obtenirVideo(film).startsWith("mobilus-videos/")
    ) {
        document.querySelector(
            'input[name="mode"][value="online"]'
        ).checked = true;

        videoUrlInput.value = obtenirVideo(film);

    } else {
        document.querySelector(
            'input[name="mode"][value="local"]'
        ).checked = true;
    }

    if (/^https?:\/\//i.test(imageChoisie)) {
        imageUrlInput.value = imageChoisie;
    }

    actualiserMode();
    afficherImage(imageChoisie);

    previewName.textContent = obtenirTitre(film);

    document.getElementById("formTitle").textContent =
        "Modifier un film ou une série";

    saveButton.textContent =
        "Enregistrer les modifications";

    cancelEditButton.classList.remove("hidden");

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================
   SUPPRIMER UN CONTENU
========================================= */

async function supprimerFilm(id) {
    const film = films.find(
        element => String(element.id) === String(id)
    );

    if (!film) {
        alert("Contenu introuvable.");
        return;
    }

    if (!confirm(
        'Veux-tu vraiment supprimer "' +
        obtenirTitre(film) + '" ?'
    )) {
        return;
    }

    try {
        const db = await obtenirBase();

        const { error } = await db
            .from("contenus")
            .delete()
            .eq("id", id);

        if (error) throw error;

        alert("Le contenu a été supprimé.");

        reinitialiserFormulaire();

        await chargerFilms();

    } catch (erreur) {
        afficherErreur(erreur);
    }
}

/* =========================================
   RÉINITIALISER LE FORMULAIRE
========================================= */

function reinitialiserFormulaire() {
    form.reset();

    filmIdInput.value = "";
    imageChoisie = "";

    /* VIDER LES PARAMÈTRES DE L'INTRODUCTION */
    introDebutInput.value = "";
    introFinInput.value = "";

    if (imageObjectURL) {
        URL.revokeObjectURL(imageObjectURL);
        imageObjectURL = "";
    }

    imageFileInput.value = "";
    videoFileInput.value = "";

    imageUrlInput.value = "";
    videoUrlInput.value = "";

    niveauAccesInput.value = "gratuit";
    statutPublicationInput.value = "false";

    document.querySelector(
        'input[name="mode"][value="local"]'
    ).checked = true;

    actualiserMode();
    afficherImage("");

    previewName.textContent =
        "Ton titre apparaîtra ici";

    document.getElementById("formTitle").textContent =
        "Ajouter un film ou une série";

    saveButton.textContent =
        "＋ Ajouter au catalogue";

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

searchAdmin.addEventListener(
    "input",
    afficherCatalogue
);

filterType.addEventListener(
    "change",
    afficherCatalogue
);

/* =========================================
   INITIALISATION
========================================= */

actualiserMode();
chargerFilms();
