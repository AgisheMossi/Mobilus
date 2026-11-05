"use strict";

/* =========================================
   MOBILUS — GESTION DES PAIEMENTS
   Connexion : Supabase Edge Function
========================================= */

const ADMINS_MOBILUS = [
    "mobiluscinema@gmail.com",
    "agishemossi@gmail.com"
];

const fonctionPaiement = "admin-paiements";

function elementPaiement(id) {
    return document.getElementById(id);
}

function afficherMessagePaiement(message, erreur = false) {
    const zone = elementPaiement("paiementMessage");

    if (!zone) return;

    zone.textContent = message;
    zone.classList.remove("hidden");
    zone.style.color = erreur ? "#ff3347" : "#ffffff";
}

function creerElementPaiement(tag, classe, texte) {
    const element = document.createElement(tag);

    if (classe) element.className = classe;
    if (texte !== undefined) element.textContent = texte;

    return element;
}

/* =========================================
   VÉRIFICATION DE LA SESSION
========================================= */

async function obtenirSessionAdmin() {
    if (!window.mobilusDB) {
        throw new Error(
            "La connexion Supabase n'est pas initialisée."
        );
    }

    const { data, error } =
        await window.mobilusDB.auth.getSession();

    if (error) throw error;

    const session = data.session;

    if (!session) {
        throw new Error(
            "Connecte-toi pour accéder à cette fonction."
        );
    }

    const email = (session.user.email || "").toLowerCase();

    if (!ADMINS_MOBILUS.includes(email)) {
        throw new Error(
            "Accès réservé aux administrateurs MOBILUS."
        );
    }

    return session;
}

/* =========================================
   APPEL DE LA FONCTION SÉCURISÉE
========================================= */

async function appelAdminPaiement(donnees) {
    await obtenirSessionAdmin();

    const { data, error } =
        await window.mobilusDB.functions.invoke(
            fonctionPaiement,
            {
                body: donnees
            }
        );

    if (error) {
        throw new Error(
            data?.erreur ||
            data?.error ||
            error.message ||
            "Erreur de communication avec le serveur."
        );
    }

    if (data?.erreur || data?.error) {
        throw new Error(data.erreur || data.error);
    }

    if (!data) {
        throw new Error(
            "Le serveur n'a retourné aucune réponse."
        );
    }

    return data;
}

/* =========================================
   FORMATAGE DES INFORMATIONS
========================================= */

function formaterDatePaiement(date) {
    if (!date) return "Non renseignée";

    const valeur = new Date(date);

    if (Number.isNaN(valeur.getTime())) {
        return "Date inconnue";
    }

    return valeur.toLocaleString("fr-FR");
}

function valeurPaiement(valeur) {
    return valeur === null ||
        valeur === undefined ||
        valeur === ""
        ? "Non renseigné"
        : String(valeur);
}

/* =========================================
   AFFICHER LES DEMANDES
========================================= */

function afficherDemandes(demandes) {
    const conteneur = elementPaiement("demandesPaiement");

    if (!conteneur) return;

    conteneur.replaceChildren();

    const total = elementPaiement("totalDemandes");
    const attente = elementPaiement("demandesAttente");

    if (total) {
        total.textContent = demandes.length;
    }

    if (attente) {
        attente.textContent = demandes.filter(
            demande => demande.statut === "en_attente"
        ).length;
    }

    if (demandes.length === 0) {
        conteneur.appendChild(
            creerElementPaiement(
                "p",
                "empty-message",
                "Aucune demande de paiement pour le moment."
            )
        );

        return;
    }

    demandes.forEach(demande => {
        const carte = creerElementPaiement(
            "article",
            "demande-card"
        );

        const titre = creerElementPaiement(
            "h3",
            "",
            valeurPaiement(demande.email)
        );

        carte.appendChild(titre);

        const informations = [
            "Opérateur : " +
                valeurPaiement(demande.operateur),

            "Montant : " +
                valeurPaiement(demande.montant_cdf) + " FC",

            "Numéro de destination : " +
                valeurPaiement(demande.numero_destination),

            "Bénéficiaire : " +
                valeurPaiement(demande.beneficiaire),

            "Référence de transaction : " +
                valeurPaiement(demande.reference_transaction),

            "Date de demande : " +
                formaterDatePaiement(demande.created_at),

            "Statut : " +
                valeurPaiement(demande.statut)
        ];

        informations.forEach(information => {
            carte.appendChild(
                creerElementPaiement(
                    "p",
                    "",
                    information
                )
            );
        });

        if (demande.commentaire_admin) {
            carte.appendChild(
                creerElementPaiement(
                    "p",
                    "",
                    "Commentaire : " +
                    demande.commentaire_admin
                )
            );
        }

        if (demande.code_mobilus) {
            carte.appendChild(
                creerElementPaiement(
                    "p",
                    "",
                    "Code MOBILUS : " +
                    demande.code_mobilus
                )
            );
        }

        /* ACTIONS POUR LES DEMANDES EN ATTENTE */

        if (demande.statut === "en_attente") {
            const jours = document.createElement("input");

            jours.type = "number";
            jours.min = "1";
            jours.max = "3650";
            jours.value = "30";
            jours.className = "jours-premium";

            jours.setAttribute(
                "aria-label",
                "Nombre de jours Premium"
            );

            const actions = creerElementPaiement(
                "div",
                "paiement-actions"
            );

            /* BOUTON ACCEPTER */

            const accepter = creerElementPaiement(
                "button",
                "accepter-paiement",
                "Accepter"
            );

            accepter.type = "button";

            accepter.addEventListener(
                "click",
                async function () {
                    const nombreJours = Number(jours.value);

                    if (
                        !Number.isInteger(nombreJours) ||
                        nombreJours < 1 ||
                        nombreJours > 3650
                    ) {
                        afficherMessagePaiement(
                            "Saisis une durée comprise entre 1 et 3650 jours.",
                            true
                        );

                        return;
                    }

                    const confirmation = confirm(
                        "As-tu vérifié le paiement reçu ?\n\n" +
                        "L'utilisateur recevra " +
                        nombreJours +
                        " jours de Premium."
                    );

                    if (!confirmation) return;

                    accepter.disabled = true;
                    accepter.textContent = "Traitement...";

                    try {
                        await appelAdminPaiement({
                            action: "decision",
                            paiement_id: demande.id,
                            decision: "accepte",
                            jours: nombreJours
                        });

                        afficherMessagePaiement(
                            "Paiement accepté et accès Premium accordé."
                        );

                        await chargerDemandesPaiement();

                    } catch (erreur) {
                        accepter.disabled = false;
                        accepter.textContent = "Accepter";

                        afficherMessagePaiement(
                            erreur.message,
                            true
                        );
                    }
                }
            );

            /* BOUTON REFUSER */

            const refuser = creerElementPaiement(
                "button",
                "refuser-paiement",
                "Refuser"
            );

            refuser.type = "button";

            refuser.addEventListener(
                "click",
                async function () {
                    const confirmation = confirm(
                        "Veux-tu vraiment refuser cette demande ?"
                    );

                    if (!confirmation) return;

                    refuser.disabled = true;
                    refuser.textContent = "Traitement...";

                    try {
                        await appelAdminPaiement({
                            action: "decision",
                            paiement_id: demande.id,
                            decision: "refuse"
                        });

                        afficherMessagePaiement(
                            "La demande a été refusée."
                        );

                        await chargerDemandesPaiement();

                    } catch (erreur) {
                        refuser.disabled = false;
                        refuser.textContent = "Refuser";

                        afficherMessagePaiement(
                            erreur.message,
                            true
                        );
                    }
                }
            );

            actions.appendChild(accepter);
            actions.appendChild(refuser);

            carte.appendChild(
                creerElementPaiement(
                    "p",
                    "",
                    "Durée Premium en jours :"
                )
            );

            carte.appendChild(jours);
            carte.appendChild(actions);
        }

        conteneur.appendChild(carte);
    });
}

/* =========================================
   CHARGER LES DEMANDES DEPUIS SUPABASE
========================================= */

async function chargerDemandesPaiement() {
    const conteneur = elementPaiement("demandesPaiement");

    if (!conteneur) return;

    afficherMessagePaiement(
        "Chargement des demandes..."
    );

    try {
        const resultat = await appelAdminPaiement({
            action: "liste"
        });

        const demandes = Array.isArray(resultat.paiements)
            ? resultat.paiements
            : [];

        afficherDemandes(demandes);

        afficherMessagePaiement(
            "Les demandes de paiement sont à jour."
        );

    } catch (erreur) {
        afficherMessagePaiement(
            "Impossible de charger les demandes : " +
            erreur.message,
            true
        );
    }
}

/* =========================================
   BOUTON ACTUALISER
========================================= */

const boutonActualiserPaiements =
    elementPaiement("actualiserPaiements");

if (boutonActualiserPaiements) {
    boutonActualiserPaiements.addEventListener(
        "click",
        chargerDemandesPaiement
    );
}

/* =========================================
   INITIALISATION
========================================= */

if (window.mobilusDB) {
    chargerDemandesPaiement();
} else {
    window.addEventListener(
        "mobilusSupabasePret",
        chargerDemandesPaiement,
        { once: true }
    );

    afficherMessagePaiement(
        "En attente du chargement de Supabase..."
    );
}