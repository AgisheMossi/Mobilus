/* =========================================
   MOBILUS — GESTION DES UTILISATEURS
========================================= */

const ADMIN_AUTORISES = [
    "mobiluscinema@gmail.com",
    "agishemossi@gmail.com"
];

/* =========================================
   CRÉATION DU PANNEAU
========================================= */

const root = document.createElement("section");
root.id = "gestionUtilisateurs";
root.className = "panel";

root.innerHTML = `
    <div class="panel-heading">
        <div>
            <h2>Gestion des utilisateurs</h2>
            <p>Comptes inscrits et accès Premium</p>
        </div>

        <button type="button"
                id="actualiserUtilisateurs"
                class="secondary-button">
            Actualiser
        </button>
    </div>

    <div class="search-row">
        <input type="search"
               id="rechercheUtilisateur"
               placeholder="Rechercher par nom ou e-mail..."
               aria-label="Rechercher un utilisateur">
    </div>

    <p id="messageUtilisateurs" role="status">
        Chargement des utilisateurs...
    </p>

    <div id="listeUtilisateurs" class="films-list"></div>
`;

const paiementSection = document.getElementById("paiementSection");

if (paiementSection) {
    paiementSection.insertAdjacentElement("afterend", root);
}

/* =========================================
   FENÊTRE DES DÉTAILS
========================================= */

const details = document.createElement("div");

details.id = "fenetreDetailsUtilisateur";
details.hidden = true;

details.innerHTML = `
    <div class="modal-utilisateur">

        <div class="panel-heading">
            <h2>Détails de l'utilisateur</h2>

            <button type="button"
                    id="fermerDetails"
                    class="secondary-button">
                Fermer
            </button>
        </div>

        <div id="contenuDetailsUtilisateur"></div>

        <div class="field">
            <label for="dureeCadeau">
                Durée de l'accès Premium gratuit
            </label>

            <select id="dureeCadeau">
                <option value="7">7 jours</option>
                <option value="15">15 jours</option>
                <option value="30" selected>30 jours</option>
                <option value="60">60 jours</option>
                <option value="90">90 jours</option>
                <option value="180">180 jours</option>
                <option value="365">365 jours</option>
            </select>
        </div>

        <label class="field">
            <input type="checkbox" id="premiumPermanent">
            Accorder un accès Premium permanent
        </label>

        <div class="field">
            <label for="motifCadeau">Motif (facultatif)</label>

            <input type="text"
                   id="motifCadeau"
                   placeholder="Ex. : Offre spéciale MOBILUS">
        </div>

        <div class="form-actions">
            <button type="button"
                    id="offrirPremium"
                    class="primary-button">
                Offrir Premium
            </button>
        </div>

        <p id="messageActionPremium" role="status"></p>

    </div>
`;

document.body.appendChild(details);


/* =========================================
   VARIABLES
========================================= */

const liste = document.getElementById("listeUtilisateurs");
const message = document.getElementById("messageUtilisateurs");

let utilisateurs = [];
let utilisateurSelectionne = null;


/* =========================================
   OUTILS
========================================= */

function afficherMessage(texte, erreur = false) {
    message.textContent = texte;
    message.style.color = erreur ? "#ff3347" : "#ffffff";
}

function echapper(valeur) {
    return String(valeur ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

function dateLisible(date) {
    if (!date) return "Non renseignée";

    const valeur = new Date(date);

    if (Number.isNaN(valeur.getTime())) {
        return "Non renseignée";
    }

    return valeur.toLocaleString("fr-FR");
}

function nomComplet(utilisateur) {
    const profil = utilisateur.profil || utilisateur;

    return [
        profil.nom,
        profil.postnom,
        profil.prenom
    ].filter(Boolean).join(" ") || "Nom non renseigné";
}

function bloc(label, valeur) {
    return `
        <div class="detail-utilisateur">
            <span>${echapper(label)}</span>
            <strong>${echapper(valeur || "Non renseigné")}</strong>
        </div>
    `;
}


/* =========================================
   VÉRIFICATION DE LA SESSION ADMIN
========================================= */

async function sessionAdmin() {

    if (!window.mobilusDB) {
        throw new Error(
            "La connexion Supabase n'est pas initialisée."
        );
    }

    const { data, error } =
        await window.mobilusDB.auth.getSession();

    if (error || !data.session) {
        throw new Error(
            "Connecte-toi avec un compte administrateur."
        );
    }

    const email = data.session.user.email?.toLowerCase();

    if (!ADMIN_AUTORISES.includes(email)) {
        throw new Error(
            "Accès réservé aux administrateurs MOBILUS."
        );
    }

    return data.session;
}


/* =========================================
   APPEL DE L'EDGE FUNCTION
========================================= */

async function appelerFonction(action, donnees = {}) {

    const session = await sessionAdmin();

    const { data, error } =
        await window.mobilusDB.functions.invoke(
            "admin-paiements",
            {
                body: {
                    action,
                    ...donnees
                },
                headers: {
                    Authorization:
                        `Bearer ${session.access_token}`
                }
            }
        );

    if (error) {
        throw new Error(
            error.message ||
            "Erreur de communication avec Supabase."
        );
    }

    if (data?.erreur || data?.error) {
        throw new Error(data.erreur || data.error);
    }

    if (data?.succes === false) {
        throw new Error(
            data.erreur || "Une opération a échoué."
        );
    }

    return data;
}


/* =========================================
   AFFICHAGE DES UTILISATEURS
========================================= */

function afficherUtilisateurs() {

    const recherche = document.getElementById(
        "rechercheUtilisateur"
    ).value.toLowerCase().trim();

    const resultat = utilisateurs.filter(utilisateur => {

        const texte = (
            nomComplet(utilisateur) + " " +
            (utilisateur.email || "")
        ).toLowerCase();

        return texte.includes(recherche);
    });

    if (!resultat.length) {
        liste.innerHTML = `
            <p class="empty-message">
                Aucun utilisateur trouvé.
            </p>
        `;
        return;
    }

    liste.innerHTML = resultat.map(utilisateur => {

        const id = echapper(utilisateur.id);

        return `
            <div class="film-row utilisateur-row">

                <div class="film-details">
                    <strong>
                        ${echapper(nomComplet(utilisateur))}
                    </strong>

                    <span>
                        ${echapper(
                            utilisateur.email || "E-mail inconnu"
                        )}
                    </span>
                </div>

                <button type="button"
                        class="secondary-button bouton-details"
                        data-user-id="${id}">
                    Détails
                </button>

            </div>
        `;

    }).join("");
}


/* =========================================
   CHARGEMENT DES UTILISATEURS
========================================= */

async function chargerUtilisateurs() {

    try {

        afficherMessage("Chargement des utilisateurs...");

        const resultat =
            await appelerFonction("utilisateurs");

        utilisateurs = resultat.utilisateurs || [];

        afficherUtilisateurs();

        afficherMessage(
            utilisateurs.length +
            " utilisateur(s) chargé(s)."
        );

    } catch (erreur) {

        afficherMessage(erreur.message, true);

        liste.innerHTML = "";

    }
}


/* =========================================
   AFFICHAGE DES DÉTAILS
========================================= */

async function ouvrirDetails(id) {

    const contenu = document.getElementById(
        "contenuDetailsUtilisateur"
    );

    try {

        contenu.innerHTML =
            "<p>Chargement des détails...</p>";

        details.hidden = false;

        document.getElementById(
            "messageActionPremium"
        ).textContent = "";

        const resultat = await appelerFonction(
            "details",
            { user_id: id }
        );

        const utilisateur = resultat.utilisateur || {};

        const profil = utilisateur.profil || {};

        /* CORRECTION : les données sont dans utilisateur */

        const acces = utilisateur.acces_premium || [];

        const paiements = utilisateur.paiements || [];

        utilisateurSelectionne = {
            ...utilisateur,
            id: utilisateur.id || id
        };

        contenu.innerHTML = `

            <h3>Informations personnelles</h3>

            ${bloc(
                "Nom complet",
                nomComplet({ profil })
            )}

            ${bloc("E-mail", utilisateur.email)}

            ${bloc("Téléphone", profil.telephone)}

            ${bloc(
                "Date d'inscription",
                dateLisible(
                    utilisateur.date_inscription ||
                    utilisateur.created_at
                )
            )}

            ${bloc("Ville", profil.ville)}

            ${bloc("Pays", profil.pays)}


            <h3>Accès Premium</h3>

            ${
                acces.length

                ? acces.map(a => `

                    <div class="detail-access">

                        ${bloc("Source", a.source)}

                        ${bloc("Statut", a.statut)}

                        ${bloc(
                            "Début",
                            dateLisible(a.date_debut)
                        )}

                        ${bloc(
                            "Expiration",
                            a.date_fin
                                ? dateLisible(a.date_fin)
                                : "Permanent"
                        )}

                        ${bloc("Motif", a.motif)}

                        ${
                            a.source === "cadeau" &&
                            a.statut === "actif"

                            ? `
                                <button type="button"
                                        class="secondary-button bouton-retirer-cadeau"
                                        data-access-id="${echapper(a.id)}">
                                    Retirer ce cadeau
                                </button>
                            `

                            : ""
                        }

                    </div>

                `).join("")

                : "<p>Aucun accès Premium enregistré.</p>"
            }


            <h3>Historique des paiements</h3>

            ${
                paiements.length

                ? paiements.map(p => `

                    <div class="detail-access">

                        ${bloc("Statut", p.statut)}

                        ${bloc(
                            "Code MOBILUS",
                            p.code_mobilus
                        )}

                        ${bloc(
                            "Référence de transaction",
                            p.reference_transaction
                        )}

                        ${bloc("Opérateur", p.operateur)}

                        ${bloc(
                            "Montant",
                            p.montant_cdf
                                ? p.montant_cdf + " FC"
                                : "Non renseigné"
                        )}

                        ${bloc(
                            "Date",
                            dateLisible(
                                p.date_paiement || p.created_at
                            )
                        )}

                    </div>

                `).join("")

                : "<p>Aucun paiement enregistré.</p>"
            }

        `;

    } catch (erreur) {

        contenu.innerHTML = `
            <p class="empty-message">
                ${echapper(erreur.message)}
            </p>
        `;

    }
}


/* =========================================
   OFFRIR UN ACCÈS PREMIUM
========================================= */

async function offrirPremium() {

    if (!utilisateurSelectionne) return;

    const permanent = document.getElementById(
        "premiumPermanent"
    ).checked;

    const jours = Number(
        document.getElementById("dureeCadeau").value
    );

    const motif = document.getElementById(
        "motifCadeau"
    ).value.trim();

    const sortie = document.getElementById(
        "messageActionPremium"
    );

    try {

        sortie.textContent =
            "Attribution de l'accès Premium...";

        await appelerFonction("cadeau", {

            user_id: utilisateurSelectionne.id,

            jours: permanent ? null : jours,

            permanent,

            motif

        });

        sortie.textContent = permanent

            ? "Accès Premium permanent accordé."

            : `Accès Premium accordé pour ${jours} jours.`;

        await ouvrirDetails(utilisateurSelectionne.id);

    } catch (erreur) {

        sortie.textContent =
            "Erreur : " + erreur.message;

    }
}


/* =========================================
   RETIRER UN CADEAU PREMIUM
========================================= */

async function retirerPremium(accesId) {

    if (!utilisateurSelectionne || !accesId) return;

    const confirmer = window.confirm(
        "Veux-tu vraiment retirer cet accès Premium gratuit ?"
    );

    if (!confirmer) return;

    const sortie = document.getElementById(
        "messageActionPremium"
    );

    try {

        sortie.textContent =
            "Retrait de l'accès Premium...";

        /* CORRECTION : envoi de acces_id */

        await appelerFonction("retirer_cadeau", {
            acces_id: accesId
        });

        sortie.textContent =
            "Accès Premium gratuit retiré.";

        await ouvrirDetails(utilisateurSelectionne.id);

    } catch (erreur) {

        sortie.textContent =
            "Erreur : " + erreur.message;

    }
}


/* =========================================
   ÉVÉNEMENTS
========================================= */

document.getElementById("actualiserUtilisateurs")
    .addEventListener("click", chargerUtilisateurs);

document.getElementById("rechercheUtilisateur")
    .addEventListener("input", afficherUtilisateurs);

liste.addEventListener("click", evenement => {

    const bouton = evenement.target.closest(
        ".bouton-details"
    );

    if (bouton) {
        ouvrirDetails(bouton.dataset.userId);
    }

});

document.getElementById("contenuDetailsUtilisateur")
    .addEventListener("click", evenement => {

        const bouton = evenement.target.closest(
            ".bouton-retirer-cadeau"
        );

        if (bouton) {
            retirerPremium(bouton.dataset.accessId);
        }

    });

document.getElementById("fermerDetails")
    .addEventListener("click", () => {

        details.hidden = true;

        utilisateurSelectionne = null;

    });

document.getElementById("offrirPremium")
    .addEventListener("click", offrirPremium);

document.getElementById("premiumPermanent")
    .addEventListener("change", evenement => {

        document.getElementById("dureeCadeau").disabled =
            evenement.target.checked;

    });


/* =========================================
   DÉMARRAGE
========================================= */

chargerUtilisateurs();