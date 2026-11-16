
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#090909">
<meta name="description" content="Regardez vos films sur MOBILUS.">
<title>Film | MOBILUS</title>

<style>
:root {
    --fond:#090909;
    --fond-secondaire:#151515;
    --rouge:#e50914;
    --jaune:#ffd400;
    --blanc:#fff;
    --gris:#aaa;
}
* {margin:0;padding:0;box-sizing:border-box}
body {
    font-family:Arial,Helvetica,sans-serif;
    background:var(--fond);
    color:var(--blanc);
    min-height:100vh;
}
body.chargement-actif {overflow:hidden}
button,select {font:inherit;cursor:pointer}

.ecran-chargement {
    position:fixed;inset:0;z-index:99999;
    background:#090909;display:flex;
    justify-content:center;align-items:center;
    transition:opacity .3s,visibility .3s;
}
.ecran-chargement.termine {
    opacity:0;visibility:hidden;pointer-events:none;
}
.cercle-chargement {
    width:48px;height:48px;border:4px solid #333;
    border-top-color:var(--jaune);border-radius:50%;
    animation:tourner .8s linear infinite;
}
@keyframes tourner {to{transform:rotate(360deg)}}

.entete {
    width:100%;min-height:65px;padding:14px 5%;
    display:flex;align-items:center;justify-content:space-between;
    gap:15px;background:#090909;border-bottom:1px solid #242424;
}
.logo {
    font-size:27px;font-weight:900;letter-spacing:1px;
    color:white;text-decoration:none;
}
.lettre-rouge {color:var(--rouge)}
.bouton-retour {
    border:1px solid #393939;background:#191919;color:white;
    padding:10px 15px;border-radius:7px;font-size:14px;
}

.conteneur {
    width:100%;max-width:1100px;margin:0 auto;
    padding:25px 18px 45px;
}
.etiquette {
    display:inline-block;color:var(--jaune);
    font-size:12px;font-weight:bold;letter-spacing:2px;
    margin-bottom:12px;
}
.titre-principal {
    font-size:28px;line-height:1.3;margin-bottom:12px;
    overflow-wrap:anywhere;
}
.informations {
    display:flex;flex-wrap:wrap;gap:10px;
    color:var(--gris);font-size:13px;margin-bottom:15px;
}
.informations span {
    background:#191919;padding:6px 9px;border-radius:5px;
}
.compteur-vues {
    display:inline-flex;align-items:center;gap:8px;
    padding:9px 13px;margin-bottom:18px;
    background:#191919;border:1px solid #343434;
    border-radius:7px;color:#ccc;font-size:13px;
}
.compteur-vues[hidden] {display:none}
.compteur-vues svg {
    width:18px;height:18px;flex-shrink:0;
    stroke:var(--jaune);
}
.compteur-vues strong {
    color:var(--jaune);font-size:15px;
}

.lecteur {
    width:100%;aspect-ratio:16/9;background:#000;
    border-radius:10px;overflow:hidden;position:relative;
    border:1px solid #252525;margin-bottom:12px;
}
.lecteur iframe,.lecteur video {
    width:100%;height:100%;border:none;
    display:block;background:#000;
}
.lecteur video {object-fit:contain}

/* NOUVELLES COMMANDES DU LECTEUR */

.commandes-avancees {
    display:none;
    flex-wrap:wrap;
    align-items:center;
    justify-content:center;
    gap:9px;
    padding:12px;
    margin-bottom:18px;
    background:#151515;
    border:1px solid #292929;
    border-radius:9px;
}
.commandes-avancees.visible {display:flex}

.commandes-avancees button,
.commandes-avancees select {
    min-height:42px;
    padding:9px 13px;
    border-radius:7px;
    border:1px solid #444;
    background:#252525;
    color:#fff;
    font-size:13px;
}
.commandes-avancees button:active {
    background:var(--rouge);
}
.commandes-avancees button:focus-visible,
.commandes-avancees select:focus-visible,
.bouton-deverrouiller:focus-visible {
    outline:2px solid var(--jaune);
    outline-offset:3px;
}
.commandes-avancees .bouton-verrouiller {
    background:#351010;
    border-color:#7c2020;
}
.commandes-avancees .bouton-plein-ecran {
    background:#202020;
}
.groupe-vitesse {
    display:flex;
    flex-direction:column;
    gap:5px;
    min-width:105px;
}
.groupe-vitesse label {
    color:#aaa;
    font-size:10px;
    font-weight:bold;
}
.groupe-vitesse select {
    width:100%;
}
.bouton-deverrouiller {
    position:absolute;
    z-index:5;
    right:14px;
    top:14px;
    min-width:48px;
    min-height:48px;
    display:none;
    align-items:center;
    justify-content:center;
    padding:10px;
    border-radius:50%;
    border:1px solid #777;
    color:#fff;
    background:rgba(20,20,20,.9);
    font-size:21px;
}
.bouton-deverrouiller.visible {
    display:flex;
}
.lecteur.commandes-verrouillees video {
    pointer-events:none;
}
.lecteur.commandes-verrouillees .bouton-deverrouiller {
    pointer-events:auto;
}
.commandes-avancees[hidden] {display:none}

/* MESSAGE VIDÉO */

.message-video {
    position:absolute;inset:0;z-index:2;
    display:flex;flex-direction:column;align-items:center;
    justify-content:center;text-align:center;gap:14px;
    padding:20px;color:#bbb;font-size:14px;
    line-height:1.6;background:#000;
}
.message-video.cache {display:none}
.indicateur-video {
    width:38px;height:38px;border:4px solid #333;
    border-top-color:var(--rouge);border-radius:50%;
    animation:tourner .8s linear infinite;
}
.indicateur-video.cache {display:none}

.commandes-video {
    display:none;flex-wrap:wrap;align-items:center;
    gap:10px;padding:13px;margin-bottom:18px;
    background:#151515;border:1px solid #292929;
    border-radius:9px;
}
.commandes-video.visible {display:flex}
.commande-groupe {
    display:flex;flex-direction:column;gap:6px;
    flex:1 1 145px;min-width:0;
}
.commande-groupe[hidden] {display:none}
.commande-groupe label {
    color:#aaa;font-size:11px;font-weight:bold;
    letter-spacing:.5px;
}
.commande-groupe select {
    width:100%;min-height:40px;padding:8px 10px;
    color:white;background:#252525;
    border:1px solid #444;border-radius:6px;outline:none;
}
.commande-groupe select:focus {border-color:var(--rouge)}

.etat-connexion {
    display:none;padding:12px;margin-bottom:18px;
    border-radius:7px;background:#351010;
    border:1px solid #7c2020;color:#ffbaba;
    font-size:13px;line-height:1.5;
}
.etat-connexion.visible {display:block}

.actions {
    display:flex;flex-wrap:wrap;gap:12px;margin-bottom:30px;
}
.bouton-principal,.bouton-favori,.bouton-reessayer {
    min-height:46px;padding:12px 18px;border-radius:7px;
    font-size:14px;font-weight:bold;border:none;
}
.bouton-principal {background:var(--rouge);color:white}
.bouton-favori {
    background:#242424;color:white;border:1px solid #393939;
}
.bouton-favori.actif {
    border-color:var(--jaune);color:var(--jaune);
}
.bouton-reessayer {
    display:none;background:#292929;color:white;
    border:1px solid #555;
}
.bouton-reessayer.visible {display:inline-block}
button:disabled {opacity:.5;cursor:not-allowed}

.bloc-description {
    background:var(--fond-secondaire);
    border:1px solid #242424;border-radius:10px;padding:20px;
}
.bloc-description h2 {font-size:19px;margin-bottom:12px}
.description {
    font-size:14px;line-height:1.8;color:#c5c5c5;
    white-space:pre-line;overflow-wrap:anywhere;
}

.section-similaires {margin-top:30px}
.section-similaires[hidden] {display:none}
.titre-similaires {font-size:20px;margin-bottom:16px}
.grille-similaires {
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:14px;
}
.carte-similaire {
    display:block;min-width:0;color:white;
    text-decoration:none;background:#151515;
    border:1px solid #292929;border-radius:9px;
    overflow:hidden;transition:transform .2s,border-color .2s;
}
.carte-similaire:active {transform:scale(.98)}
.carte-similaire:hover {border-color:var(--rouge)}
.image-similaire {
    width:100%;aspect-ratio:2/3;display:block;
    object-fit:cover;background:#222;
}
.image-similaire-manquante {
    width:100%;aspect-ratio:2/3;
    display:flex;align-items:center;justify-content:center;
    background:#222;color:#777;font-size:13px;
    text-align:center;padding:10px;
}
.infos-similaire {padding:10px}
.titre-carte-similaire {
    font-size:13px;line-height:1.4;font-weight:bold;
    overflow-wrap:anywhere;
}
.details-carte-similaire {
    color:#999;font-size:11px;margin-top:6px;
}

footer {
    text-align:center;color:#777;padding:25px 15px;
    font-size:12px;border-top:1px solid #222;
}

@media(min-width:700px) {
    .conteneur {padding-top:35px}
    .titre-principal {font-size:36px}
    .grille-similaires {
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:18px;
    }
    .titre-carte-similaire {font-size:14px}
}
@media(max-width:480px) {
    .commandes-avancees {
        display:none;
        gap:7px;
        padding:10px;
    }
    .commandes-avancees.visible {display:flex}
    .commandes-avancees button {
        flex:1 1 40%;
        min-width:0;
        padding:9px 7px;
        font-size:12px;
    }
    .groupe-vitesse {
        flex:1 1 40%;
    }
}
@media(prefers-reduced-motion:reduce) {
    .cercle-chargement,.indicateur-video {animation:none}
    .ecran-chargement {transition:none}
}
</style>
</head>

<body class="chargement-actif">

<div class="ecran-chargement" id="ecranChargement">
    <div class="cercle-chargement"></div>
</div>

<header class="entete">
    <a href="index.html" class="logo" aria-label="Accueil MOBILUS">
        M<span class="lettre-rouge">O</span>BILUS
    </a>
    <button type="button" class="bouton-retour" id="boutonRetour">
        ← Retour
    </button>
</header>

<main class="conteneur">

    <span class="etiquette">TON UNIVERS CINÉMA</span>

    <h1 class="titre-principal" id="titreFilm">
        Chargement du film...
    </h1>

    <div class="informations">
        <span id="anneeFilm">Année inconnue</span>
        <span id="categorieFilm">Film</span>
        <span id="dureeFilm">Durée inconnue</span>
    </div>

    <div class="compteur-vues" id="compteurVues" hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
        <span><strong id="nombreVues">0</strong> vues</span>
    </div>

    <section class="lecteur" id="videoContainer" aria-label="Lecteur vidéo">
        <div class="message-video" id="messageVideo">
            <div class="indicateur-video" id="indicateurVideo"></div>
            <span id="texteMessageVideo">
                Préparation de la vidéo...
            </span>
        </div>

        <button
            type="button"
            class="bouton-deverrouiller"
            id="boutonDeverrouiller"
            aria-label="Déverrouiller les commandes"
            title="Déverrouiller les commandes"
        >🔓</button>
    </section>

    <section class="commandes-avancees" id="commandesAvancees" aria-label="Commandes avancées">

        <button type="button" id="boutonReculer" title="Reculer de 10 secondes">
            ↶ 10 s
        </button>

        <button type="button" id="boutonAvancer" title="Avancer de 10 secondes">
            10 s ↷
        </button>

        <div class="groupe-vitesse">
            <label for="choixVitesse">VITESSE</label>
            <select id="choixVitesse">
                <option value="0.5">0,5×</option>
                <option value="0.75">0,75×</option>
                <option value="1" selected>Normal (1×)</option>
                <option value="1.25">1,25×</option>
                <option value="1.5">1,5×</option>
                <option value="1.75">1,75×</option>
                <option value="2">2×</option>
            </select>
        </div>

        <button type="button" class="bouton-plein-ecran" id="boutonPleinEcran">
            ⛶ Plein écran
        </button>

        <button type="button" class="bouton-verrouiller" id="boutonVerrouiller">
            🔒 Verrouiller
        </button>

    </section>

    <section class="commandes-video" id="commandesVideo">

        <div class="commande-groupe" id="groupeQualite" hidden>
            <label for="choixQualite">QUALITÉ VIDÉO</label>
            <select id="choixQualite"></select>
        </div>

        <div class="commande-groupe" id="groupeSousTitres" hidden>
            <label for="choixSousTitres">SOUS-TITRES</label>
            <select id="choixSousTitres">
                <option value="-1">Désactivés</option>
            </select>
        </div>

        <div class="commande-groupe" id="groupeAudio" hidden>
            <label for="choixAudio">LANGUE AUDIO</label>
            <select id="choixAudio"></select>
        </div>

    </section>

    <div class="etat-connexion" id="etatConnexion">
        Votre connexion Internet est interrompue.
        Vérifiez votre réseau pour continuer la lecture.
    </div>

    <div class="actions">
        <button type="button" class="bouton-principal" id="boutonRegarder">
            ▶ Regarder le film
        </button>

        <button type="button" class="bouton-reessayer" id="boutonReessayer">
            ↻ Réessayer
        </button>

        <button type="button" class="bouton-favori" id="boutonFavori">
            ♡ Ajouter aux favoris
        </button>
    </div>

    <section class="bloc-description">
        <h2>À propos du film</h2>
        <p class="description" id="descriptionFilm">
            Aucune description disponible.
        </p>
    </section>

    <section class="section-similaires" id="sectionFilmsSimilaires" hidden>
        <h2 class="titre-similaires">Films similaires</h2>
        <div class="grille-similaires" id="grilleFilmsSimilaires"></div>
    </section>

</main>

<footer>
    © <span id="anneeActuelle"></span> MOBILUS —
    YOUR CINEMA, EVERYWHERE
</footer>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script src="supabase-config.js"></script>
<script src="films.js"></script>

<script>
(function () {
"use strict";

const CLE_FAVORIS = "mobilusFavoris";
const CLE_RECENTS = "mobilusRecents";

const elements = {
    titre:document.getElementById("titreFilm"),
    annee:document.getElementById("anneeFilm"),
    categorie:document.getElementById("categorieFilm"),
    duree:document.getElementById("dureeFilm"),
    description:document.getElementById("descriptionFilm"),
    lecteur:document.getElementById("videoContainer"),
    message:document.getElementById("messageVideo"),
    texteMessage:document.getElementById("texteMessageVideo"),
    indicateur:document.getElementById("indicateurVideo"),
    regarder:document.getElementById("boutonRegarder"),
    reessayer:document.getElementById("boutonReessayer"),
    favori:document.getElementById("boutonFavori"),
    retour:document.getElementById("boutonRetour"),
    chargement:document.getElementById("ecranChargement"),
    connexion:document.getElementById("etatConnexion"),
    commandes:document.getElementById("commandesVideo"),
    groupeQualite:document.getElementById("groupeQualite"),
    groupeSousTitres:document.getElementById("groupeSousTitres"),
    groupeAudio:document.getElementById("groupeAudio"),
    qualite:document.getElementById("choixQualite"),
    sousTitres:document.getElementById("choixSousTitres"),
    audio:document.getElementById("choixAudio"),
    compteurVues:document.getElementById("compteurVues"),
    nombreVues:document.getElementById("nombreVues"),
    sectionSimilaires:document.getElementById("sectionFilmsSimilaires"),
    grilleSimilaires:document.getElementById("grilleFilmsSimilaires"),

    commandesAvancees:document.getElementById("commandesAvancees"),
    reculer:document.getElementById("boutonReculer"),
    avancer:document.getElementById("boutonAvancer"),
    vitesse:document.getElementById("choixVitesse"),
    pleinEcran:document.getElementById("boutonPleinEcran"),
    verrouiller:document.getElementById("boutonVerrouiller"),
    deverrouiller:document.getElementById("boutonDeverrouiller")
};

document.getElementById("anneeActuelle").textContent =
    new Date().getFullYear();

let filmActuel = null;
let utilisateurActuel = null;
let chargementTermine = false;
let videoActuelle = null;
let utilisateurPremium = false;

let sessionLectureId = null;
let vueComptageEffectue = false;
let comptageEnCours = false;

let operationSource = 0;
let operationSousTitres = 0;
let commandesVerrouillees = false;

function terminerChargement() {
    if (chargementTermine) return;

    chargementTermine = true;
    elements.chargement.classList.add("termine");
    document.body.classList.remove("chargement-actif");

    setTimeout(function() {
        elements.chargement.remove();
    },350);
}

setTimeout(terminerChargement,12000);

function lireJSON(cle,valeurParDefaut) {
    try {
        const valeur = localStorage.getItem(cle);
        return valeur ? JSON.parse(valeur) : valeurParDefaut;
    } catch(erreur) {
        return valeurParDefaut;
    }
}

function obtenirIdentifiant(film) {
    return String(
        film.id ?? film.identifiant ?? film.filmId ?? ""
    );
}

function obtenirTitre(film) {
    return film.titre || film.title || film.nom ||
        film.name || "Film sans titre";
}

function obtenirDescription(film) {
    return film.description || film.synopsis ||
        film.resume || "Aucune description disponible.";
}

function obtenirVideo(film) {
    return film.video_url || film.video || film.videoUrl ||
        film.videoURL || film.urlVideo || film.lienVideo ||
        film.url || film.source || "";
}

/* NORMALISATION DES DONNÉES */

function normaliserContenu(contenu) {
    return {
        ...contenu,

        id:contenu.id ?? contenu.identifiant,

        titre:contenu.titre || contenu.title ||
            contenu.nom || contenu.name || "",

        title:contenu.title || contenu.titre ||
            contenu.nom || contenu.name || "",

        annee:contenu.annee ?? contenu.year ?? "",

        year:contenu.year ?? contenu.annee ?? "",

        categorie:contenu.categorie || contenu.category || "",

        category:contenu.category || contenu.categorie || "",

        type:contenu.type || "film",

        image:contenu.image || contenu.image_url || "",

        image_url:contenu.image_url || contenu.image || "",

        video_url:contenu.video_url || contenu.videoUrl ||
            contenu.video || "",

        description:contenu.description || contenu.synopsis ||
            contenu.resume || "",

        duree:contenu.duree || contenu.duration || "",

        niveau_acces:contenu.niveau_acces || "gratuit"
    };
}

function afficherMessageVideo(message,chargement) {
    elements.texteMessage.textContent = message;
    elements.message.classList.remove("cache");

    elements.indicateur.classList.toggle("cache",!chargement);
}

function masquerMessageVideo() {
    elements.message.classList.add("cache");
}

function afficherErreur(message) {
    elements.titre.textContent = "Contenu indisponible";
    elements.description.textContent = message;

    afficherMessageVideo(message,false);

    elements.regarder.disabled = true;
    elements.favori.disabled = true;
}

/* FILMS SIMILAIRES */

function viderFilmsSimilaires() {
    elements.grilleSimilaires.innerHTML = "";
    elements.sectionSimilaires.hidden = true;
}

function creerCarteSimilaire(film) {
    const carte = document.createElement("a");
    carte.className = "carte-similaire";

    carte.href = "film.html?id=" +
        encodeURIComponent(obtenirIdentifiant(film));

    const imageURL = film.image_url || film.image || "";

    if (imageURL) {
        const image = document.createElement("img");

        image.className = "image-similaire";
        image.src = imageURL;
        image.alt = obtenirTitre(film);
        image.loading = "lazy";

        image.addEventListener("error",function() {
            const remplacement = document.createElement("div");

            remplacement.className = "image-similaire-manquante";
            remplacement.textContent = "Image indisponible";

            image.replaceWith(remplacement);
        },{once:true});

        carte.appendChild(image);

    } else {
        const remplacement = document.createElement("div");

        remplacement.className = "image-similaire-manquante";
        remplacement.textContent = "Image indisponible";

        carte.appendChild(remplacement);
    }

    const informations = document.createElement("div");
    informations.className = "infos-similaire";

    const titre = document.createElement("h3");
    titre.className = "titre-carte-similaire";
    titre.textContent = obtenirTitre(film);

    informations.appendChild(titre);

    const details = document.createElement("p");
    details.className = "details-carte-similaire";

    const annee = film.year || film.annee || "";
    const categorie = film.category || film.categorie || "";

    details.textContent = [annee,categorie]
        .filter(Boolean)
        .join(" • ");

    if (details.textContent) {
        informations.appendChild(details);
    }

    carte.appendChild(informations);

    return carte;
}

async function chargerFilmsSimilaires() {
    viderFilmsSimilaires();

    if (!filmActuel) return;

    const db = window.mobilusDB;

    if (!db) return;

    try {
        const resultat = await db
            .from("contenus")
            .select("*")
            .eq("publie",true)
            .neq("id",filmActuel.id)
            .limit(100);

        if (resultat.error) throw resultat.error;

        if (!Array.isArray(resultat.data)) return;

        const categorieActuelle = String(
            filmActuel.categorie || filmActuel.category || ""
        ).trim().toLowerCase();

        const typeActuel = String(
            filmActuel.type || ""
        ).trim().toLowerCase();

        const contenus = resultat.data.map(normaliserContenu);

        let similaires = [];

        if (categorieActuelle) {
            similaires = contenus.filter(function(contenu) {
                const categorie = String(
                    contenu.categorie || contenu.category || ""
                ).trim().toLowerCase();

                return categorie === categorieActuelle;
            });
        }

        if (!similaires.length && typeActuel) {
            similaires = contenus.filter(function(contenu) {
                const type = String(
                    contenu.type || ""
                ).trim().toLowerCase();

                return type === typeActuel;
            });
        }

        similaires = similaires
            .filter(function(contenu) {
                return obtenirIdentifiant(contenu) !==
                    obtenirIdentifiant(filmActuel);
            })
            .slice(0,8);

        if (!similaires.length) {
            viderFilmsSimilaires();
            return;
        }

        const fragment = document.createDocumentFragment();

        similaires.forEach(function(contenu) {
            fragment.appendChild(creerCarteSimilaire(contenu));
        });

        elements.grilleSimilaires.appendChild(fragment);
        elements.sectionSimilaires.hidden = false;

    } catch(erreur) {
        console.error(
            "Erreur chargement des films similaires :",
            erreur
        );

        viderFilmsSimilaires();
    }
}

function estURLWeb(url) {
    return typeof url === "string" &&
        /^https?:\/\//i.test(url.trim());
}

/* VÉRIFICATION PREMIUM */

async function verifierStatutPremium() {
    utilisateurPremium = false;
    elements.compteurVues.hidden = true;

    const db = window.mobilusDB;

    if (!db || !utilisateurActuel) return;

    try {
        const resultat = await db
            .from("profils")
            .select("type_acces,statut_abonnement,date_fin_abonnement")
            .eq("id",utilisateurActuel)
            .maybeSingle();

        if (resultat.error) throw resultat.error;

        const profil = resultat.data;

        if (!profil) return;

        const dateFin = profil.date_fin_abonnement
            ? new Date(profil.date_fin_abonnement).getTime()
            : 0;

        utilisateurPremium =
            String(profil.type_acces || "").toLowerCase() === "premium" &&
            String(profil.statut_abonnement || "").toLowerCase() === "actif" &&
            Number.isFinite(dateFin) &&
            dateFin > Date.now();

        if (utilisateurPremium && filmActuel) {
            elements.nombreVues.textContent =
                formaterNombreVues(filmActuel.nombre_vues);

            elements.compteurVues.hidden = false;
        }

    } catch(erreur) {
        console.error("Vérification Premium impossible :",erreur);
        utilisateurPremium = false;
        elements.compteurVues.hidden = true;
    }
}

function formaterNombreVues(nombre) {
    const valeur = Number(nombre);

    if (!Number.isFinite(valeur) || valeur < 0) return "0";

    return new Intl.NumberFormat("fr-FR").format(valeur);
}

/* CHARGEMENT DU FILM */

async function chargerContenu() {
    const parametres = new URLSearchParams(location.search);
    const identifiantURL = parametres.get("id");

    if (!identifiantURL) {
        afficherErreur(
            "Identifiant du contenu absent. Retournez à l'accueil et sélectionnez un film."
        );
        terminerChargement();
        return;
    }

    const db = window.mobilusDB;

    if (!db) {
        afficherErreur(
            "Connexion à Supabase impossible. Vérifiez votre configuration."
        );
        terminerChargement();
        return;
    }

    try {
        const sessionResultat = await db.auth.getSession();

        if (sessionResultat.error) throw sessionResultat.error;

        if (!sessionResultat.data.session) {
            location.replace("connexion.html");
            return;
        }

        utilisateurActuel = sessionResultat.data.session.user.id;

        const resultat = await db
            .from("contenus")
            .select("*")
            .eq("id",identifiantURL)
            .eq("publie",true)
            .maybeSingle();

        if (resultat.error) throw resultat.error;

        if (!resultat.data) {
            afficherErreur(
                "Ce contenu est introuvable ou n'est pas encore publié."
            );
            terminerChargement();
            return;
        }

        filmActuel = normaliserContenu(resultat.data);

        afficherInformations();
        enregistrerRecent();
        actualiserBoutonFavori();

        chargerFilmsSimilaires();

        await verifierStatutPremium();

        afficherMessageVideo(
            "Appuyez sur « Regarder le film » pour lancer la vidéo.",
            false
        );

        terminerChargement();

    } catch(erreur) {
        console.error("Erreur chargement MOBILUS :",erreur);

        afficherErreur(
            "Impossible de charger ce contenu. Vérifiez votre connexion ou reconnectez-vous."
        );

        terminerChargement();
    }
}

function afficherInformations() {
    const titre = obtenirTitre(filmActuel);

    elements.titre.textContent = titre;
    elements.annee.textContent = filmActuel.year || "Année inconnue";
    elements.categorie.textContent =
        filmActuel.category || filmActuel.type || "Film";
    elements.duree.textContent =
        filmActuel.duree || "Durée inconnue";
    elements.description.textContent =
        obtenirDescription(filmActuel);

    document.title = titre + " | MOBILUS";
}

/* HISTORIQUE RÉCENT */

function enregistrerRecent() {
    const idFilm = obtenirIdentifiant(filmActuel);

    let recents = lireJSON(CLE_RECENTS,[]);

    if (!Array.isArray(recents)) recents = [];

    recents = recents.filter(function(element) {
        return String(element.id) !== idFilm;
    });

    recents.unshift({
        id:filmActuel.id,
        title:obtenirTitre(filmActuel),
        year:filmActuel.year || "",
        category:filmActuel.category || "",
        type:filmActuel.type || "film",
        image:filmActuel.image || "",
        date:new Date().toISOString()
    });

    try {
        localStorage.setItem(
            CLE_RECENTS,
            JSON.stringify(recents.slice(0,50))
        );
    } catch(erreur) {
        console.error("Erreur historique MOBILUS :",erreur);
    }
}

/* FAVORIS */

function obtenirFavoris() {
    const favoris = lireJSON(CLE_FAVORIS,[]);
    return Array.isArray(favoris) ? favoris : [];
}

function estFavori() {
    const idFilm = obtenirIdentifiant(filmActuel);

    return obtenirFavoris().some(function(favori) {
        const id = typeof favori === "object" && favori !== null
            ? obtenirIdentifiant(favori)
            : String(favori);

        return id === idFilm;
    });
}

function actualiserBoutonFavori() {
    if (estFavori()) {
        elements.favori.textContent = "♥ Retirer des favoris";
        elements.favori.classList.add("actif");
    } else {
        elements.favori.textContent = "♡ Ajouter aux favoris";
        elements.favori.classList.remove("actif");
    }
}

elements.favori.addEventListener("click",function() {
    if (!filmActuel) return;

    let favoris = obtenirFavoris();
    const idFilm = obtenirIdentifiant(filmActuel);

    if (estFavori()) {
        favoris = favoris.filter(function(favori) {
            const id = typeof favori === "object" && favori !== null
                ? obtenirIdentifiant(favori)
                : String(favori);

            return id !== idFilm;
        });
    } else {
        favoris.push(filmActuel.id);
    }

    try {
        localStorage.setItem(
            CLE_FAVORIS,
            JSON.stringify(favoris)
        );

        actualiserBoutonFavori();

    } catch(erreur) {
        alert("Impossible de sauvegarder les favoris.");
    }
});

/* YOUTUBE ET VIMEO */

function convertirYouTube(url) {
    try {
        const adresse = new URL(url);
        let id = "";

        if (adresse.hostname.includes("youtu.be")) {
            id = adresse.pathname.split("/").filter(Boolean)[0] || "";
        } else if (adresse.pathname.startsWith("/embed/")) {
            id = adresse.pathname.split("/")[2] || "";
        } else if (adresse.pathname.startsWith("/shorts/")) {
            id = adresse.pathname.split("/")[2] || "";
        } else {
            id = adresse.searchParams.get("v") || "";
        }

        if (!/^[a-zA-Z0-9_-]{6,20}$/.test(id)) return "";

        return "https://www.youtube.com/embed/" + id +
            "?autoplay=1&rel=0&enablejsapi=1";

    } catch(erreur) {
        return "";
    }
}

function convertirVimeo(url) {
    const resultat = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);

    if (!resultat) return "";

    return "https://player.vimeo.com/video/" +
        resultat[1] + "?autoplay=1";
}

/* PROGRESSION AUTOMATIQUE */

function obtenirCleProgression() {
    return "mobilusProgression_" +
        (utilisateurActuel || "invité") + "_" +
        obtenirIdentifiant(filmActuel);
}

function lireProgression() {
    try {
        const valeur = localStorage.getItem(obtenirCleProgression());

        if (!valeur) return 0;

        const anciennePosition = Number(valeur);

        if (Number.isFinite(anciennePosition) && anciennePosition > 0) {
            return anciennePosition;
        }

        const donnees = JSON.parse(valeur);
        const position = Number(donnees.position);

        return Number.isFinite(position) && position > 0
            ? position : 0;

    } catch(erreur) {
        return 0;
    }
}

function sauvegarderProgression(video) {
    if (
        !filmActuel ||
        !video ||
        !Number.isFinite(video.currentTime)
    ) return;

    try {
        if (video.ended) {
            localStorage.removeItem(obtenirCleProgression());
            return;
        }

        if (video.currentTime <= 0) return;

        const donnees = {
            position:video.currentTime,
            duree:Number.isFinite(video.duration)
                ? video.duration : 0,
            date:new Date().toISOString()
        };

        localStorage.setItem(
            obtenirCleProgression(),
            JSON.stringify(donnees)
        );

    } catch(erreur) {
        console.warn("Progression non sauvegardée :",erreur);
    }
}

function restaurerProgression(video) {
    if (!video || video !== videoActuelle) return;

    const position = lireProgression();

    if (position <= 0) return;

    if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        position >= video.duration - 5
    ) {
        localStorage.removeItem(obtenirCleProgression());
        return;
    }

    try {
        video.currentTime = position;

        afficherMessageVideo(
            "Reprise de votre film à " +
            formaterTemps(position) + "...",
            false
        );

        setTimeout(function() {
            if (video === videoActuelle) {
                masquerMessageVideo();
            }
        },1200);

    } catch(erreur) {
        console.warn(
            "Impossible de restaurer la position :",
            erreur
        );
    }
}

function formaterTemps(secondes) {
    secondes = Math.floor(secondes);

    const heures = Math.floor(secondes / 3600);
    const minutes = Math.floor((secondes % 3600) / 60);
    const reste = secondes % 60;

    if (heures > 0) {
        return heures + "h " + minutes + "min";
    }

    return minutes + "min " + reste + "s";
}

/* COMPTEUR DE VUES */

function genererIdentifiantSession() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    if (
        window.crypto &&
        typeof window.crypto.getRandomValues === "function"
    ) {
        const octets = new Uint8Array(16);
        window.crypto.getRandomValues(octets);

        octets[6] = (octets[6] & 0x0f) | 0x40;
        octets[8] = (octets[8] & 0x3f) | 0x80;

        const hex = Array.from(octets,function(octet) {
            return octet.toString(16).padStart(2,"0");
        }).join("");

        return (
            hex.slice(0,8) + "-" +
            hex.slice(8,12) + "-" +
            hex.slice(12,16) + "-" +
            hex.slice(16,20) + "-" +
            hex.slice(20)
        );
    }

    throw new Error(
        "Impossible de créer une session de lecture sécurisée."
    );
}

function preparerNouvelleSessionLecture() {
    sessionLectureId = genererIdentifiantSession();
    vueComptageEffectue = false;
    comptageEnCours = false;
}

async function compterVuePremium() {
    if (
        !utilisateurPremium ||
        !filmActuel ||
        !sessionLectureId ||
        vueComptageEffectue ||
        comptageEnCours
    ) return;

    const db = window.mobilusDB;

    if (!db) return;

    comptageEnCours = true;

    try {
        const resultat = await db.rpc(
            "demarrer_session_lecture",
            {
                p_session_id:sessionLectureId,
                p_contenu_id:filmActuel.id
            }
        );

        if (resultat.error) throw resultat.error;

        vueComptageEffectue = true;

        if (
            resultat.data !== null &&
            resultat.data !== undefined
        ) {
            const total = Number(resultat.data);

            if (Number.isFinite(total)) {
                elements.nombreVues.textContent =
                    formaterNombreVues(total);
            }
        }

        console.log("Vue MOBILUS comptabilisée.");

    } catch(erreur) {
        console.error("Erreur de comptage des vues :",erreur);

    } finally {
        comptageEnCours = false;
    }
}

/* LIENS VIDÉO SÉCURISÉS */

async function obtenirLiensSecurises() {
    const db = window.mobilusDB;

    if (!db) {
        throw new Error("Connexion Supabase indisponible.");
    }

    const sessionResultat = await db.auth.getSession();

    if (
        sessionResultat.error ||
        !sessionResultat.data.session
    ) {
        location.replace("connexion.html");

        throw new Error(
            "Votre session a expiré. Reconnectez-vous."
        );
    }

    const resultat = await db.functions.invoke(
        "obtenir-video",
        {
            body:{
                contenu_id:filmActuel.id
            }
        }
    );

    if (resultat.error) {
        throw new Error(
            resultat.error.message ||
            "Impossible de contacter le serveur vidéo."
        );
    }

    const data = resultat.data;

    if (
        !data ||
        data.success !== true ||
        !data.video_url
    ) {
        throw new Error(
            data && data.error
                ? data.error
                : "Le serveur n'a pas fourni de lien vidéo."
        );
    }

    if (!estURLWeb(data.video_url)) {
        throw new Error(
            "Le lien vidéo sécurisé reçu est invalide."
        );
    }

    return data;
}

function nettoyerOptions(liste) {
    if (!Array.isArray(liste)) return [];

    return liste.map(function(option) {
        if (!option || typeof option !== "object") return null;

        return {
            label:String(
                option.label ||
                option.nom ||
                option.name ||
                "Option"
            ),
            url:String(option.url || option.src || ""),
            language:option.language ||
                option.langue ||
                option.srclang ||
                "fr",
            default:option.default === true
        };

    }).filter(function(option) {
        return option && estURLWeb(option.url);
    });
}

/* COMMANDES DU LECTEUR */

function reinitialiserCommandes() {
    elements.commandes.classList.remove("visible");
    elements.commandesAvancees.classList.remove("visible");

    elements.groupeQualite.hidden = true;
    elements.groupeSousTitres.hidden = true;
    elements.groupeAudio.hidden = true;

    elements.qualite.innerHTML = "";

    elements.sousTitres.innerHTML =
        '<option value="-1">Désactivés</option>';

    elements.audio.innerHTML = "";

    elements.qualite.onchange = null;
    elements.sousTitres.onchange = null;
    elements.audio.onchange = null;

    verrouillerCommandes(false);
}

function ajouterOption(selecteur,label,valeur) {
    const option = document.createElement("option");

    option.textContent = label;
    option.value = valeur;

    selecteur.appendChild(option);
}

function sauvegarderEtatVideo(video) {
    return {
        position:video.currentTime || 0,
        lecture:!video.paused,
        volume:video.volume,
        muet:video.muted,
        vitesse:video.playbackRate
    };
}

function appliquerNouvelleSource(video,url,etat) {
    if (!video || !estURLWeb(url)) {
        throw new Error("Source vidéo invalide.");
    }

    const position = etat.position || 0;

    video.src = url;
    video.load();

    video.addEventListener(
        "loadedmetadata",
        function reprendre() {
            video.removeEventListener(
                "loadedmetadata",
                reprendre
            );

            if (
                Number.isFinite(video.duration) &&
                position < video.duration - 1
            ) {
                video.currentTime = position;
            }

            video.volume = etat.volume;
            video.muted = etat.muet;
            video.playbackRate = etat.vitesse;

            if (etat.lecture) {
                video.play().catch(function() {});
            }
        }
    );

    afficherMessageVideo(
        "Changement de source vidéo...",
        true
    );
}

async function changerSourceOption(video,type,index) {
    if (!video || video !== videoActuelle) return;

    const numeroOperation = ++operationSource;
    const etat = sauvegarderEtatVideo(video);

    try {
        sauvegarderProgression(video);

        afficherMessageVideo(
            "Préparation de cette version...",
            true
        );

        const data = await obtenirLiensSecurises();

        if (
            numeroOperation !== operationSource ||
            video !== videoActuelle
        ) return;

        let liste = [];

        if (type === "qualite") {
            liste = nettoyerOptions(data.video_qualities);
        } else if (type === "audio") {
            liste = nettoyerOptions(data.audio_tracks);
        }

        const option = liste[index];

        if (!option) {
            throw new Error(
                "Cette option vidéo n'est plus disponible."
            );
        }

        appliquerNouvelleSource(
            video,
            option.url,
            etat
        );

    } catch(erreur) {
        console.error("Erreur changement de source :",erreur);

        afficherMessageVideo(
            erreur.message ||
            "Impossible de changer cette source.",
            false
        );
    }
}

async function changerSousTitres(video,index) {
    if (!video || video !== videoActuelle) return;

    const numeroOperation = ++operationSousTitres;

    try {
        if (index === -1) {
            Array.from(video.textTracks).forEach(
                function(track) {
                    track.mode = "disabled";
                }
            );

            masquerMessageVideo();
            return;
        }

        afficherMessageVideo(
            "Chargement des sous-titres...",
            true
        );

        const data = await obtenirLiensSecurises();

        if (
            numeroOperation !== operationSousTitres ||
            video !== videoActuelle
        ) return;

        const liste = nettoyerOptions(data.subtitles);
        const option = liste[index];

        if (!option) {
            throw new Error("Sous-titres indisponibles.");
        }

        let track = video.querySelector(
            'track[data-mobilus-index="' + index + '"]'
        );

        if (!track) {
            track = document.createElement("track");

            track.kind = "subtitles";
            track.dataset.mobilusIndex = String(index);

            video.appendChild(track);
        }

        track.label = option.label;
        track.srclang = option.language || "fr";
        track.src = option.url;

        track.addEventListener(
            "load",
            function activer() {
                if (
                    numeroOperation !== operationSousTitres ||
                    video !== videoActuelle
                ) return;

                Array.from(video.textTracks).forEach(
                    function(piste) {
                        piste.mode = "disabled";
                    }
                );

                if (track.track) {
                    track.track.mode = "showing";
                }

                masquerMessageVideo();
            },
            {once:true}
        );

        track.addEventListener(
            "error",
            function() {
                afficherMessageVideo(
                    "Impossible de charger ce fichier de sous-titres.",
                    false
                );
            },
            {once:true}
        );

    } catch(erreur) {
        console.error("Erreur sous-titres :",erreur);

        afficherMessageVideo(
            erreur.message ||
            "Impossible de charger les sous-titres.",
            false
        );
    }
}

function configurerCommandes(video,data) {
    reinitialiserCommandes();

    const qualites = nettoyerOptions(data.video_qualities);
    const sousTitres = nettoyerOptions(data.subtitles);
    const languesAudio = nettoyerOptions(data.audio_tracks);

    if (qualites.length) {
        qualites.forEach(function(option,index) {
            ajouterOption(
                elements.qualite,
                option.label,
                String(index)
            );
        });

        elements.groupeQualite.hidden = false;

        elements.qualite.onchange = function() {
            changerSourceOption(
                video,
                "qualite",
                Number(this.value)
            );
        };
    }

    if (sousTitres.length) {
        sousTitres.forEach(function(option,index) {
            ajouterOption(
                elements.sousTitres,
                option.label,
                String(index)
            );
        });

        elements.groupeSousTitres.hidden = false;

        elements.sousTitres.onchange = function() {
            changerSousTitres(
                video,
                Number(this.value)
            );
        };
    }

    if (languesAudio.length) {
        languesAudio.forEach(function(option,index) {
            ajouterOption(
                elements.audio,
                option.label,
                String(index)
            );
        });

        elements.groupeAudio.hidden = false;

        elements.audio.onchange = function() {
            changerSourceOption(
                video,
                "audio",
                Number(this.value)
            );
        };
    }

    if (
        qualites.length ||
        sousTitres.length ||
        languesAudio.length
    ) {
        elements.commandes.classList.add("visible");
    }
}

/* NOUVELLES FONCTIONS MULTI-APPAREILS */

function avancerReculer(secondes) {
    const video = videoActuelle;

    if (
        !video ||
        video.tagName !== "VIDEO" ||
        commandesVerrouillees
    ) return;

    try {
        const duree = Number.isFinite(video.duration)
            ? video.duration
            : Infinity;

        const nouvellePosition = Math.max(
            0,
            Math.min(duree,video.currentTime + secondes)
        );

        video.currentTime = nouvellePosition;

    } catch(erreur) {
        console.warn("Déplacement vidéo impossible :",erreur);
    }
}

elements.reculer.addEventListener("click",function() {
    avancerReculer(-10);
});

elements.avancer.addEventListener("click",function() {
    avancerReculer(10);
});

elements.vitesse.addEventListener("change",function() {
    if (!videoActuelle || videoActuelle.tagName !== "VIDEO") {
        return;
    }

    const vitesse = Number(this.value);

    if (
        Number.isFinite(vitesse) &&
        vitesse >= 0.5 &&
        vitesse <= 2
    ) {
        videoActuelle.playbackRate = vitesse;
    }
});

function estPleinEcran() {
    return Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement
    );
}

async function activerPleinEcran() {
    const lecteur = elements.lecteur;
    const video = videoActuelle;

    try {
        if (estPleinEcran()) {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            return;
        }

        if (lecteur.requestFullscreen) {
            await lecteur.requestFullscreen();
            return;
        }

        if (lecteur.webkitRequestFullscreen) {
            lecteur.webkitRequestFullscreen();
            return;
        }

        /* Solution de remplacement pour Safari iPhone */
        if (
            video &&
            typeof video.webkitEnterFullscreen === "function"
        ) {
            video.webkitEnterFullscreen();
            return;
        }

        afficherMessageVideo(
            "Le plein écran n'est pas pris en charge par ce navigateur.",
            false
        );

    } catch(erreur) {
        console.warn("Plein écran indisponible :",erreur);

        afficherMessageVideo(
            "Impossible d'activer le plein écran sur cet appareil.",
            false
        );
    }
}

elements.pleinEcran.addEventListener("click",function() {
    activerPleinEcran();
});

function actualiserEtatVerrouillage() {
    elements.lecteur.classList.toggle(
        "commandes-verrouillees",
        commandesVerrouillees
    );

    elements.commandesAvancees.classList.toggle(
        "visible",
        Boolean(videoActuelle) && !commandesVerrouillees
    );

    elements.deverrouiller.classList.toggle(
        "visible",
        Boolean(videoActuelle) && commandesVerrouillees
    );

    if (videoActuelle && videoActuelle.tagName === "VIDEO") {
        videoActuelle.controls = !commandesVerrouillees;
    }

    elements.verrouiller.textContent =
        commandesVerrouillees
            ? "🔒 Verrouillé"
            : "🔒 Verrouiller";

    elements.deverrouiller.setAttribute(
        "aria-label",
        "Déverrouiller les commandes"
    );
}

function verrouillerCommandes(verrouiller) {
    commandesVerrouillees = Boolean(verrouiller);
    actualiserEtatVerrouillage();
}

elements.verrouiller.addEventListener("click",function() {
    verrouillerCommandes(true);
});

elements.deverrouiller.addEventListener("click",function() {
    verrouillerCommandes(false);
});

/* SYNCHRONISATION DU PLEIN ÉCRAN */

function actualiserBoutonPleinEcran() {
    elements.pleinEcran.textContent = estPleinEcran()
        ? "⛶ Quitter plein écran"
        : "⛶ Plein écran";
}

document.addEventListener(
    "fullscreenchange",
    actualiserBoutonPleinEcran
);

document.addEventListener(
    "webkitfullscreenchange",
    actualiserBoutonPleinEcran
);

/* LECTEUR VIDÉO */

function supprimerAncienneVideo() {
    operationSource++;
    operationSousTitres++;

    const ancienneVideo =
        elements.lecteur.querySelector("video,iframe");

    if (ancienneVideo) {
        if (ancienneVideo.tagName === "VIDEO") {
            sauvegarderProgression(ancienneVideo);

            ancienneVideo.pause();
            ancienneVideo.removeAttribute("src");
            ancienneVideo.load();
        }

        ancienneVideo.remove();
    }

    videoActuelle = null;
    verrouillerCommandes(false);

    reinitialiserCommandes();
}

function afficherErreurLecture(message) {
    afficherMessageVideo(message,false);
    elements.reessayer.classList.add("visible");
}

function afficherLecteur(url,titre,data) {
    supprimerAncienneVideo();

    elements.reessayer.classList.remove("visible");

    if (/youtube\.com|youtu\.be/i.test(url)) {
        const lien = convertirYouTube(url);

        if (!lien) {
            afficherErreurLecture(
                "Le lien YouTube est invalide."
            );
            return;
        }

        const iframe = document.createElement("iframe");

        iframe.src = lien;
        iframe.title = titre;

        iframe.allow =
            "autoplay; encrypted-media; picture-in-picture; fullscreen";

        iframe.allowFullscreen = true;

        iframe.referrerPolicy =
            "strict-origin-when-cross-origin";

        elements.lecteur.appendChild(iframe);

        masquerMessageVideo();
        return;
    }

    if (/vimeo\.com/i.test(url)) {
        const lien = convertirVimeo(url);

        if (!lien) {
            afficherErreurLecture(
                "Le lien Vimeo est invalide."
            );
            return;
        }

        const iframe = document.createElement("iframe");

        iframe.src = lien;
        iframe.title = titre;

        iframe.allow =
            "autoplay; fullscreen; picture-in-picture";

        iframe.allowFullscreen = true;

        elements.lecteur.appendChild(iframe);

        masquerMessageVideo();
        return;
    }

    const video = document.createElement("video");

    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.setAttribute("playsinline","");
    video.setAttribute("webkit-playsinline","");

    videoActuelle = video;

    let progressionRestauree = false;

    video.addEventListener("loadstart",function() {
        afficherMessageVideo(
            "Chargement de la vidéo...",
            true
        );
    });

    video.addEventListener("waiting",function() {
        afficherMessageVideo(
            "Mise en mémoire tampon...",
            true
        );
    });

    video.addEventListener("loadedmetadata",function() {
        if (progressionRestauree) return;

        progressionRestauree = true;

        restaurerProgression(video);
    });

    video.addEventListener("canplay",function() {
        masquerMessageVideo();
    });

    video.addEventListener("playing",function() {
        masquerMessageVideo();

        elements.reessayer.classList.remove("visible");

        compterVuePremium();
    });

    video.addEventListener("timeupdate",function() {
        sauvegarderProgression(video);
    });

    video.addEventListener("pause",function() {
        sauvegarderProgression(video);
    });

    video.addEventListener("ended",function() {
        try {
            localStorage.removeItem(
                obtenirCleProgression()
            );
        } catch(erreur) {}
    });

    video.addEventListener("error",function() {
        afficherErreurLecture(
            "Impossible de lire cette vidéo. Vérifiez que le fichier est accessible et réessayez."
        );
    });

    elements.lecteur.appendChild(video);

    configurerCommandes(video,data);

    /* Afficher les commandes avancées */
    elements.commandesAvancees.classList.add("visible");

    elements.vitesse.value = "1";
    video.playbackRate = 1;

    afficherMessageVideo(
        "Chargement de la vidéo...",
        true
    );

    video.src = url;
    video.load();

    video.play().catch(function() {
        masquerMessageVideo();
    });
}

/* PROTECTION DES VIDÉOS PRIVÉES */

function estCheminPrive(url) {
    if (typeof url !== "string") return false;

    const chemin = url.trim();

    return (
        chemin.startsWith("mobilus-videos/") ||
        chemin.startsWith("videos/")
    );
}

/* LANCEMENT DU FILM */

async function regarderFilm(nouvelleSession) {
    if (!filmActuel) return;

    if (!navigator.onLine) {
        afficherMessageVideo(
            "Vérifiez votre connexion Internet avant de lancer le film.",
            false
        );
        return;
    }

    if (
        nouvelleSession === true ||
        !sessionLectureId
    ) {
        try {
            preparerNouvelleSessionLecture();
        } catch(erreur) {
            afficherErreurLecture(erreur.message);
            return;
        }
    }

    elements.regarder.disabled = true;
    elements.regarder.textContent = "Chargement...";

    elements.reessayer.classList.remove("visible");

    try {
        const url = obtenirVideo(filmActuel);

        if (!url) {
            afficherErreurLecture(
                "Aucune vidéo n'est configurée pour ce contenu."
            );
            return;
        }

        let urlFinale = url;

        let donneesSecurisees = {
            video_qualities:[],
            subtitles:[],
            audio_tracks:[]
        };

        const contenuPrive = estCheminPrive(url);

        const premium =
            String(filmActuel.niveau_acces)
            .toLowerCase() === "premium";

        if (premium && !contenuPrive) {
            throw new Error(
                "Cette vidéo Premium doit être stockée dans le bucket privé MOBILUS."
            );
        }

        if (contenuPrive) {
            const resultat = await obtenirLiensSecurises();

            urlFinale = resultat.video_url;

            donneesSecurisees = {
                video_qualities:
                    resultat.video_qualities || [],

                subtitles:
                    resultat.subtitles || [],

                audio_tracks:
                    resultat.audio_tracks || []
            };

        } else if (!estURLWeb(url)) {
            throw new Error(
                "Le lien vidéo n'est pas reconnu. Vérifiez son adresse."
            );
        }

        afficherLecteur(
            urlFinale,
            obtenirTitre(filmActuel),
            donneesSecurisees
        );

    } catch(erreur) {
        console.error("Erreur lecture vidéo :",erreur);

        afficherErreurLecture(
            erreur.message ||
            "Impossible de lancer cette vidéo. Vérifiez votre abonnement ou réessayez."
        );

    } finally {
        elements.regarder.disabled = false;

        elements.regarder.textContent =
            "▶ Regarder le film";
    }
}

elements.regarder.addEventListener("click",function() {
    regarderFilm(true);
});

elements.reessayer.addEventListener("click",function() {
    if (!filmActuel) return;

    elements.reessayer.classList.remove("visible");

    supprimerAncienneVideo();

    regarderFilm(false);
});

/* CONNEXION INTERNET */

window.addEventListener("offline",function() {
    elements.connexion.classList.add("visible");

    if (videoActuelle) {
        sauvegarderProgression(videoActuelle);
    }
});

window.addEventListener("online",function() {
    elements.connexion.classList.remove("visible");
});

if (!navigator.onLine) {
    elements.connexion.classList.add("visible");
}

/* SAUVEGARDE AVANT DE QUITTER */

window.addEventListener("pagehide",function() {
    if (videoActuelle) {
        sauvegarderProgression(videoActuelle);
    }
});

document.addEventListener("visibilitychange",function() {
    if (
        document.visibilityState === "hidden" &&
        videoActuelle
    ) {
        sauvegarderProgression(videoActuelle);
    }
});

/* RETOUR À L'ACCUEIL */

elements.retour.addEventListener("click",function() {
    if (videoActuelle) {
        sauvegarderProgression(videoActuelle);
        videoActuelle.pause();
    }

    location.replace("index.html");
});

/* DÉMARRAGE */

chargerContenu();

})();
</script>

</body>
</html>
