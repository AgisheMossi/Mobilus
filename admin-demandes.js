"use strict";
/* =========================================
   MOBILUS — GESTION DES DEMANDES DE CONTENUS
========================================= */
const fonctionDemandes = "admin-demandes";
function elementDemande(id) {
    return document.getElementById(id);
}
function messageDemande(message, erreur = false) {
    const zone = elementDemande("demandesContenuMessage");
    if (!zone) return;
    zone.textContent = message;
    zone.style.color = erreur ? "#ff3347" : "#ffffff";
}
async function verifierAdminDemandes() {
    if (!window.mobilusDB) {
        throw new Error("Supabase n'est pas initialisé.");
    }
    const { data, error } =
        await window.mobilusDB.auth.getSession();
    if (error) throw error;
    if (!data.session) {
        throw new Error("Connecte-toi pour continuer.");
    }
    const email = (data.session.user.email || "").toLowerCase();
    const admins = [
        "mobiluscinema@gmail.com",
        "agishemossi@gmail.com"
    ];
    if (!admins.includes(email)) {
        throw new Error("Accès réservé aux administrateurs.");
    }
}
async function appelAdminDemandes(donnees) {
    await verifierAdminDemandes();
    const { data, error } =
        await window.mobilusDB.functions.invoke(
            fonctionDemandes,
            { body: donnees }
        );
    if (error) {
        throw new Error(
            data?.erreur ||
            error.message ||
            "Erreur de communication avec le serveur."
        );
    }
    if (data?.erreur) {
        throw new Error(data.erreur);
    }
    return data;
}
function dateDemande(date) {
    if (!date) return "Date inconnue";
    const valeur = new Date(date);
    if (Number.isNaN(valeur.getTime())) {
        return "Date inconnue";
    }
    return valeur.toLocaleString("fr-FR");
}
function creerElementDemande(tag, classe, texte) {
    const element = document.createElement(tag);
    if (classe) element.className = classe;
    if (texte !== undefined) {
        element.textContent = texte;
    }
    return element;
}
function afficherListeDemandes(demandes) {
    const conteneur = elementDemande("listeDemandesContenu");
    if (!conteneur) return;
    conteneur.replaceChildren();
    const total = elementDemande("totalDemandesContenu");
    if (total) {
        total.textContent = demandes.length;
    }
    if (demandes.length === 0) {
        conteneur.appendChild(
            creerElementDemande(
                "p",
                "empty-message",
                "Aucune demande de contenu pour le moment."
            )
        );
        return;
    }
    demandes.forEach(demande => {
        const carte = creerElementDemande(
            "article",
            "demande-card"
        );
        carte.appendChild(
            creerElementDemande(
                "h3",
                "",
                demande.titre
            )
        );
        carte.appendChild(
            creerElementDemande(
                "p",
                "",
                "Type : " +
                (demande.type_contenu === "serie" ? "Série" : "Film")
            )
        );
        carte.appendChild(
            creerElementDemande(
                "p",
                "",
                "Date : " + dateDemande(demande.created_at)
            )
        );
        carte.appendChild(
            creerElementDemande(
                "p",
                "",
                "Utilisateur : " + demande.user_id
            )
        );
        const label = creerElementDemande(
            "label",
            "",
            "Statut de la demande"
        );
        const select = document.createElement("select");
        select.className = "statut-demande";
        select.setAttribute(
            "aria-label",
            "Modifier le statut de " + demande.titre
        );
        const statuts = [
            ["en_attente", "En attente"],
            ["en_preparation", "En préparation"],
            ["disponible", "Disponible"],
            ["indisponible", "Indisponible"]
        ];
        statuts.forEach(([valeur, texte]) => {
            const option = document.createElement("option");
            option.value = valeur;
            option.textContent = texte;
            option.selected = demande.statut === valeur;
            select.appendChild(option);
        });
        label.appendChild(select);
        carte.appendChild(label);
        const bouton = creerElementDemande(
            "button",
            "primary-button",
            "Enregistrer le statut"
        );
        bouton.type = "button";
        bouton.addEventListener("click", async function () {
            const nouveauStatut = select.value;
            if (nouveauStatut === demande.statut) {
                messageDemande("Aucun changement à enregistrer.");
                return;
            }
            if (!confirm(
                "Confirmer le changement de statut de cette demande ?"
            )) {
                return;
            }
            bouton.disabled = true;
            bouton.textContent = "Enregistrement...";
            try {
                await appelAdminDemandes({
                    action: "decision",
                    demande_id: demande.id,
                    statut: nouveauStatut
                });
                messageDemande("Statut mis à jour.");
                await chargerDemandesContenu();
            } catch (erreur) {
                bouton.disabled = false;
                bouton.textContent = "Enregistrer le statut";
                messageDemande(erreur.message, true);
            }
        });
        carte.appendChild(bouton);
        conteneur.appendChild(carte);
    });
}
async function chargerDemandesContenu() {
    const conteneur = elementDemande("listeDemandesContenu");
    if (!conteneur) return;
    messageDemande("Chargement des demandes...");
    try {
        const resultat = await appelAdminDemandes({
            action: "liste"
        });
        afficherListeDemandes(
            Array.isArray(resultat.demandes)
                ? resultat.demandes
                : []
        );
        messageDemande("Demandes actualisées.");
    } catch (erreur) {
        messageDemande(erreur.message, true);
    }
}
/* =========================================
   INITIALISATION
========================================= */
document.addEventListener("DOMContentLoaded", function () {
    const bouton = elementDemande("actualiserDemandesContenu");
    if (bouton) {
        bouton.addEventListener(
            "click",
            chargerDemandesContenu
        );
    }
    if (window.mobilusDB) {
        chargerDemandesContenu();
    } else {
        window.addEventListener(
            "mobilusSupabasePret",
            chargerDemandesContenu,
            { once: true }
        );
    }
});
