/* =====================================
   MOBILUS — CONFIGURATION SUPABASE
===================================== */

const SUPABASE_URL = "https://uoxccezhznxmgggjupqd.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_-3OGf57zowok1GS8s0e9gQ_Qg2pVRmO";


/* =====================================
   INITIALISATION DU CLIENT SUPABASE
===================================== */

(function initialiserMobilusSupabase() {

    if (!window.supabase) {
        console.error("MOBILUS : la bibliothèque Supabase n'est pas chargée.");
        return;
    }

    try {

        window.mobilusDB = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        console.log("MOBILUS : connexion Supabase initialisée.");

        window.dispatchEvent(
            new Event("mobilusSupabasePret")
        );

    } catch (erreur) {

        console.error(
            "MOBILUS : erreur d'initialisation Supabase :",
            erreur
        );

    }

})();