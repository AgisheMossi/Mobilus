document.addEventListener("DOMContentLoaded", () => {
    const boutonActualiser = document.getElementById(
        "actualiserDemandesContenu"
    );

    const totalDemandes = document.getElementById(
        "totalDemandesContenu"
    );

    const message = document.getElementById(
        "demandesContenuMessage"
    );

    const liste = document.getElementById(
        "listeDemandesContenu"
    );

    const ADMINS_MOBILUS = [
        "mobiluscinema@gmail.com",
        "agishemossi@gmail.com"
    ];

    const STATUTS = {
        en_attente: "En attente",
        en_preparation: "En préparation",
        disponible: "Disponible",
        indisponible: "Indisponible"
    };

    let demandes = [];
    let contenus = [];

    function echapperHTML(texte) {
        return String(texte ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caractere]);
    }

    function normaliserType(type) {
        const valeur = String(type ?? "").toLowerCase().trim();

        if (valeur === "serie" || valeur === "série") {
            return "serie";
        }

        return "film";
    }

    function afficherMessage(texte, erreur = false) {
        if (!message) return;

        message.textContent = texte;
        message.style.color = erreur ? "#ff5555" : "#cccccc";
    }

    async function verifierAdmin() {
        if (!window.mobilusDB) {
            throw new Error("Supabase n'est pas initialisé.");
        }

        const { data, error } =
            await window.mobilusDB.auth.getSession();

        if (error) throw error;

        const session = data.session;

        if (!session) {
            throw new Error("Connecte-toi pour accéder aux demandes.");
        }

        const email = session.user.email?.toLowerCase();

        if (!ADMINS_MOBILUS.includes(email)) {
            throw new Error("Accès réservé aux administrateurs MOBILUS.");
        }

        return session;
    }

    async function appelerFonction(body) {
        const { data, error } =
            await window.mobilusDB.functions.invoke(
                "admin-demandes",
                { body }
            );

        if (error) {
            throw new Error(
                data?.message || error.message ||
                "Erreur de communication avec le serveur."
            );
        }

        if (!data || !data.success) {
            throw new Error(
                data?.message || "Une erreur est survenue."
            );
        }

        return data;
    }

    async function chargerContenus() {
        const resultat = await appelerFonction({
            action: "liste_contenus"
        });

        contenus = resultat.contenus || [];
    }

    async function chargerDemandes() {
        afficherMessage("Chargement des demandes...");

        try {
            await verifierAdmin();

            await Promise.all([
                chargerContenus(),
                chargerListeDemandes()
            ]);

            afficherMessage("Demandes actualisées.");

        } catch (erreur) {
            afficherMessage(erreur.message, true);

            if (liste) {
                liste.innerHTML = "";
            }
        }
    }

    async function chargerListeDemandes() {
        const resultat = await appelerFonction({
            action: "liste"
        });

        demandes = resultat.demandes || [];

        if (totalDemandes) {
            totalDemandes.textContent = demandes.length;
        }

        afficherDemandes();
    }

    function obtenirContenusPourDemande(demande) {
        const typeDemande = normaliserType(
            demande.type_contenu
        );

        return contenus.filter(contenu => {
            return normaliserType(contenu.type) === typeDemande;
        });
    }

    function afficherDemandes() {
        if (!liste) return;

        if (demandes.length === 0) {
            liste.innerHTML = `
                <p style="color:#aaa;">
                    Aucune demande pour le moment.
                </p>
            `;
            return;
        }

        liste.innerHTML = demandes.map(demande => {
            const options = obtenirContenusPourDemande(demande);

            const listeOptions = options.map(contenu => {
                const selectionne =
                    demande.contenu_id === contenu.id
                        ? "selected"
                        : "";

                return `
                    <option value="${echapperHTML(contenu.id)}"
                        ${selectionne}>
                        ${echapperHTML(contenu.titre)}
                    </option>
                `;
            }).join("");

            const statutOptions = Object.entries(STATUTS)
                .map(([valeur, libelle]) => `
                    <option value="${valeur}"
                        ${demande.statut === valeur ? "selected" : ""}>
                        ${libelle}
                    </option>
                `).join("");

            const date = demande.created_at
                ? new Date(demande.created_at).toLocaleDateString("fr-FR")
                : "Date inconnue";

            return `
                <article class="demande-contenu-card"
                    data-id="${echapperHTML(demande.id)}"
                    style="
                        background:#181818;
                        border:1px solid #333;
                        border-radius:12px;
                        padding:16px;
                        margin-bottom:15px;
                    ">

                    <h3 style="color:white;margin-top:0;">
                        ${echapperHTML(demande.titre)}
                    </h3>

                    <p style="color:#bbb;">
                        Type :
                        ${normaliserType(demande.type_contenu) === "serie"
                            ? "Série"
                            : "Film"}
                    </p>

                    <p style="color:#999;font-size:12px;">
                        Date : ${echapperHTML(date)}
                    </p>

                    <p style="color:#999;font-size:12px;word-break:break-all;">
                        Utilisateur : ${echapperHTML(demande.user_id)}
                    </p>

                    <label style="display:block;color:white;margin-top:15px;">
                        Associer un contenu publié
                    </label>

                    <select class="select-contenu"
                        style="
                            width:100%;
                            padding:12px;
                            margin-top:7px;
                            background:#252525;
                            color:white;
                            border:1px solid #555;
                            border-radius:7px;
                        ">

                        <option value="">
                            Choisir un contenu
                        </option>

                        ${listeOptions}
                    </select>

                    ${options.length === 0 ? `
                        <p style="color:#ff7777;font-size:13px;">
                            Aucun contenu publié de ce type.
                        </p>
                    ` : ""}

                    <label style="display:block;color:white;margin-top:15px;">
                        Statut de la demande
                    </label>

                    <select class="select-statut"
                        style="
                            width:100%;
                            padding:12px;
                            margin-top:7px;
                            background:#252525;
                            color:white;
                            border:1px solid #555;
                            border-radius:7px;
                        ">
                        ${statutOptions}
                    </select>

                    <button type="button"
                        class="bouton-enregistrer-demande"
                        style="
                            width:100%;
                            padding:13px;
                            margin-top:15px;
                            background:#e50914;
                            color:white;
                            border:none;
                            border-radius:7px;
                            font-weight:bold;
                            cursor:pointer;
                        ">
                        Enregistrer les modifications
                    </button>

                    <p class="message-demande"
                        style="color:#aaa;font-size:13px;margin-bottom:0;">
                    </p>

                </article>
            `;
        }).join("");

        liste.querySelectorAll(
            ".bouton-enregistrer-demande"
        ).forEach(bouton => {
            bouton.addEventListener("click", enregistrerDemande);
        });
    }

    async function enregistrerDemande(e) {
        const carte = e.currentTarget.closest(
            ".demande-contenu-card"
        );

        if (!carte) return;

        const demandeId = carte.dataset.id;

        const selectContenu = carte.querySelector(
            ".select-contenu"
        );

        const selectStatut = carte.querySelector(
            ".select-statut"
        );

        const messageCarte = carte.querySelector(
            ".message-demande"
        );

        const bouton = e.currentTarget;

        const statut = selectStatut.value;
        const contenuId = selectContenu.value;

        if (statut === "disponible" && !contenuId) {
            messageCarte.textContent =
                "Choisis d'abord un film ou une série.";

            messageCarte.style.color = "#ff5555";
            return;
        }

        bouton.disabled = true;
        bouton.textContent = "Enregistrement...";

        try {
            await verifierAdmin();

            const resultat = await appelerFonction({
                action: "decision",
                demande_id: demandeId,
                statut: statut,
                contenu_id: contenuId || null
            });

            messageCarte.textContent =
                resultat.message || "Modifications enregistrées.";

            messageCarte.style.color = "#4caf50";

            await chargerListeDemandes();

        } catch (erreur) {
            messageCarte.textContent = erreur.message;
            messageCarte.style.color = "#ff5555";

        } finally {
            bouton.disabled = false;
            bouton.textContent = "Enregistrer les modifications";
        }
    }

    if (boutonActualiser) {
        boutonActualiser.addEventListener(
            "click",
            chargerDemandes
        );
    }

    chargerDemandes();
});
