import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL = "https://uoxccezhznxmgggjupqd.supabase.co";
const SUPABASE_KEY = "sb_publishable_-3OGf57zowok1GS8s0e9gQ_Qg2pVRmO";
const db = createClient(SUPABASE_URL, SUPABASE_KEY);
const zone = document.getElementById("mesDemandesContenu");
const message = document.getElementById("messageDemandesContenu");
const compteur = document.getElementById("compteurDemandesContenu");
function afficherMessage(texte, erreur = false) {
    if (!message) return;
    message.textContent = texte;
    message.style.color = erreur ? "#ff3347" : "#ffffff";
}
function libelleStatut(statut) {
    const statuts = {
        en_attente: "En attente",
        en_preparation: "En préparation",
        disponible: "Disponible",
        indisponible: "Indisponible"
    };
    return statuts[statut] || "Statut inconnu";
}
function creerElement(tag, classe, texte) {
    const element = document.createElement(tag);
    if (classe) element.className = classe;
    if (texte !== undefined) element.textContent = texte;
    return element;
}
function formaterDate(date) {
    if (!date) return "Date inconnue";
    const valeur = new Date(date);
    if (Number.isNaN(valeur.getTime())) {
        return "Date inconnue";
    }
    return valeur.toLocaleDateString("fr-FR");
}
function afficherDemandes(demandes) {
    if (!zone) return;
    zone.replaceChildren();
    const debutMois = new Date();
    debutMois.setDate(1);
    debutMois.setHours(0, 0, 0, 0);
    const demandesMois = demandes.filter(demande =>
        new Date(demande.created_at) >= debutMois
    ).length;
    if (compteur) {
        compteur.textContent =
            Math.min(demandesMois, 2) + " / 2 demandes utilisées ce mois";
    }
    if (demandes.length === 0) {
        zone.appendChild(
            creerElement(
                "p",
                "",
                "Tu n'as encore demandé aucun film ou série."
            )
        );
        return;
    }
    demandes.forEach(demande => {
        const carte = creerElement("article", "demande-contenu-card");
        carte.style.cssText =
            "background:#151515;border:1px solid #333;" +
            "border-radius:12px;padding:16px;margin-bottom:14px;";
        carte.appendChild(
            creerElement("h3", "", demande.titre)
        );
        carte.appendChild(
            creerElement(
                "p",
                "",
                demande.type_contenu === "serie" ? "Série" : "Film"
            )
        );
        carte.appendChild(
            creerElement(
                "p",
                "",
                "Demandé le : " + formaterDate(demande.created_at)
            )
        );
        const statut = creerElement(
            "strong",
            "statut-demande",
            libelleStatut(demande.statut)
        );
        statut.style.color =
            demande.statut === "disponible"
                ? "#35d07f"
                : demande.statut === "indisponible"
                    ? "#ff3347"
                    : "#f5c542";
        carte.appendChild(statut);
        if (demande.statut === "disponible") {
            carte.appendChild(
                creerElement(
                    "p",
                    "",
                    "Ce contenu est annoncé comme disponible."
                )
            );
            if (demande.contenu_id) {
                const bouton = creerElement(
                    "a",
                    "primary-button",
                    "▶ Regarder maintenant"
                );
                bouton.href =
                    "film.html?id=" +
                    encodeURIComponent(demande.contenu_id);
                bouton.style.cssText =
                    "display:inline-block;margin-top:12px;" +
                    "padding:12px 18px;background:#e50920;" +
                    "color:white;text-decoration:none;border-radius:8px;";
                carte.appendChild(bouton);
            } else {
                carte.appendChild(
                    creerElement(
                        "p",
                        "",
                        "Le lien de visionnage n'a pas encore été associé."
                    )
                );
            }
        }
        if (demande.statut === "indisponible") {
            carte.appendChild(
                creerElement(
                    "p",
                    "",
                    "Ce contenu ne peut pas être proposé actuellement."
                )
            );
        }
        zone.appendChild(carte);
    });
}
async function chargerMesDemandes() {
    if (!zone) return;
    afficherMessage("Chargement de tes demandes...");
    try {
        const { data: sessionData, error: sessionError } =
            await db.auth.getSession();
        if (sessionError) throw sessionError;
        const session = sessionData.session;
        if (!session) {
            window.location.href = "connexion.html";
            return;
        }
        const { data, error } = await db
            .from("demandes_contenu")
            .select(
                "id,titre,type_contenu,statut,contenu_id,created_at"
            )
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });
        if (error) throw error;
        afficherDemandes(data || []);
        afficherMessage("Tes demandes sont à jour.");
    } catch (erreur) {
        console.error("MOBILUS — Profil demandes :", erreur);
        afficherMessage(
            "Impossible de charger tes demandes : " + erreur.message,
            true
        );
    }
}
document.addEventListener("DOMContentLoaded", chargerMesDemandes);
