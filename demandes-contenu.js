"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const recherche = document.getElementById("searchInput");
    const grille = document.getElementById("movieGrid");
    if (!recherche || !grille) {
        console.error("MOBILUS : recherche ou catalogue introuvable.");
        return;
    }
    let panneau = null;
    let minuterie = null;
    function supprimerPanneau() {
        if (panneau) {
            panneau.remove();
            panneau = null;
        }
    }
    function afficherPanneau() {
        const titre = recherche.value.trim();
        if (titre.length < 2) {
            supprimerPanneau();
            return;
        }
        const cartes = grille.querySelectorAll(
            ".movie-card, .film-card"
        );
        const messageVide = grille.textContent
            .toLowerCase()
            .includes("aucun film ou série ne correspond");
        if (cartes.length > 0 || !messageVide) {
            supprimerPanneau();
            return;
        }
        if (panneau && panneau.isConnected) return;
        supprimerPanneau();
        panneau = document.createElement("section");
        panneau.className = "commande-contenu-panel";
        panneau.style.cssText =
            "margin:20px 0;padding:22px;background:#151515;" +
            "border:1px solid #b80016;border-radius:14px;color:white;";
        const titrePanel = document.createElement("h3");
        titrePanel.textContent = "Tu ne trouves pas ton contenu ?";
        const description = document.createElement("p");
        description.textContent =
            "Demande à MOBILUS d'ajouter ce film ou cette série.";
        const choix = document.createElement("select");
        choix.style.cssText =
            "width:100%;padding:13px;margin:15px 0;" +
            "background:#090909;color:white;border:1px solid #444;" +
            "border-radius:8px;font-size:15px;";
        [
            ["film", "Film"],
            ["serie", "Série"]
        ].forEach(function (element) {
            const option = document.createElement("option");
            option.value = element[0];
            option.textContent = element[1];
            choix.appendChild(option);
        });
        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.textContent = "Commander ce contenu";
        bouton.style.cssText =
            "width:100%;padding:14px;background:#e50920;color:white;" +
            "border:0;border-radius:8px;font-weight:bold;font-size:15px;";
        bouton.addEventListener("click", async function () {
            const titreDemande = recherche.value.trim();
            if (titreDemande.length < 2) {
                alert("Saisis le titre du contenu.");
                return;
            }
            if (!window.mobilusDB) {
                alert("La connexion à MOBILUS est indisponible.");
                return;
            }
            bouton.disabled = true;
            bouton.textContent = "Enregistrement...";
            try {
                const { data: sessionData, error: sessionError } =
                    await window.mobilusDB.auth.getSession();
                if (sessionError) throw sessionError;
                if (!sessionData.session) {
                    alert("Connecte-toi pour commander un contenu.");
                    window.location.href = "connexion.html";
                    return;
                }
                const { data, error } =
                    await window.mobilusDB.rpc(
                        "creer_demande_contenu",
                        {
                            p_titre: titreDemande,
                            p_type: choix.value
                        }
                    );
                if (error) throw error;
                if (!data || data.success !== true) {
                    alert(
                        data?.message ||
                        "Ta demande n'a pas pu être enregistrée."
                    );
                    bouton.disabled = false;
                    bouton.textContent = "Commander ce contenu";
                    return;
                }
                alert(
                    "Ta demande a bien été enregistrée !\n\n" +
                    "Demandes utilisées ce mois : " +
                    data.demandes_utilisees +
                    "/2\nDemandes restantes : " +
                    data.demandes_restantes
                );
                supprimerPanneau();
            } catch (erreur) {
                console.error("MOBILUS — Demande :", erreur);
                alert(
                    erreur.message ||
                    "Une erreur est survenue pendant la commande."
                );
                bouton.disabled = false;
                bouton.textContent = "Commander ce contenu";
            }
        });
        panneau.appendChild(titrePanel);
        panneau.appendChild(description);
        panneau.appendChild(choix);
        panneau.appendChild(bouton);
        // Le panneau est placé en dehors de la grille surveillée.
        grille.insertAdjacentElement("afterend", panneau);
    }
    function actualiser() {
        clearTimeout(minuterie);
        minuterie = setTimeout(afficherPanneau, 150);
    }
    recherche.addEventListener("input", actualiser);
    const observateur = new MutationObserver(actualiser);
    observateur.observe(grille, {
        childList: true,
        subtree: true
    });
});
