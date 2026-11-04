/* =====================================
   MOBILUS — CONFIGURATION SUPABASE
   ===================================== */

/*
   Remplace les deux valeurs ci-dessous
   par celles de TON projet Supabase.

   Ne mets jamais une clé secrète
   ou une clé service_role dans ce fichier.
*/

const SUPABASE_URL = "TON_URL_SUPABASE";

const SUPABASE_ANON_KEY = "TA_CLE_PUBLIQUE_SUPABASE";

/* Initialisation du client */

if (
    SUPABASE_URL !== "TON_URL_SUPABASE" &&
    SUPABASE_ANON_KEY !== "TA_CLE_PUBLIQUE_SUPABASE" &&
    window.supabase
) {
    window.mobilusDB = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    console.log("MOBILUS : connexion Supabase initialisée.");
} else {
    console.warn(
        "MOBILUS : configure l'URL et la clé publique Supabase."
    );
}