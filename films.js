/* ========================================
   MOBILUS — CATALOGUE DES FILMS
======================================== */

const films = [
    {
        id: 1,
        title: "The Dark Knight",
        year: 2008,
        category: "Action",
        type: "film",
        emoji: "🦇",
        image: "",
        video: "",
        description: "Batman affronte le Joker, un criminel imprévisible qui plonge Gotham City dans le chaos."
    },
    {
        id: 2,
        title: "Interstellar",
        year: 2014,
        category: "Science-fiction",
        type: "film",
        emoji: "🚀",
        image: "",
        video: "",
        description: "Un groupe d'explorateurs part à la recherche d'une nouvelle planète capable d'accueillir l'humanité."
    },
    {
        id: 3,
        title: "Avengers: Endgame",
        year: 2019,
        category: "Action",
        type: "film",
        emoji: "🦸",
        image: "",
        video: "",
        description: "Les Avengers survivants tentent de réparer les conséquences du combat contre Thanos."
    },
    {
        id: 4,
        title: "Spider-Man",
        year: 2002,
        category: "Aventure",
        type: "film",
        emoji: "🕷️",
        image: "",
        video: "",
        description: "Peter Parker découvre ses pouvoirs et apprend ce que signifie être un véritable héros."
    },
    {
        id: 5,
        title: "The Lion King",
        year: 2019,
        category: "Animation",
        type: "film",
        emoji: "🦁",
        image: "",
        video: "",
        description: "Simba doit retrouver sa place dans le royaume après avoir perdu son père."
    },
    {
        id: 6,
        title: "Jumanji",
        year: 2017,
        category: "Aventure",
        type: "film",
        emoji: "🎮",
        image: "",
        video: "",
        description: "Des adolescents sont transportés dans un jeu vidéo où ils doivent survivre à des épreuves dangereuses."
    },
    {
        id: 7,
        title: "The Conjuring",
        year: 2013,
        category: "Horreur",
        type: "film",
        emoji: "👻",
        image: "",
        video: "",
        description: "Des enquêteurs spécialisés dans le paranormal tentent d'aider une famille confrontée à des phénomènes inquiétants."
    },
    {
        id: 8,
        title: "Fast & Furious",
        year: 2001,
        category: "Action",
        type: "film",
        emoji: "🏎️",
        image: "",
        video: "",
        description: "Un policier infiltré dans le milieu des courses automobiles se rapproche d'un groupe de pilotes."
    },
    {
        id: 9,
        title: "Friends",
        year: 1994,
        category: "Comédie",
        type: "série",
        emoji: "😂",
        image: "",
        video: "",
        description: "Six amis partagent leurs aventures, leurs histoires d'amour et leur quotidien à New York."
    },
    {
        id: 10,
        title: "Stranger Things",
        year: 2016,
        category: "Science-fiction",
        type: "série",
        emoji: "👾",
        image: "",
        video: "",
        description: "Dans une petite ville, des enfants découvrent des événements mystérieux liés à une autre dimension."
    },
    {
        id: 11,
        title: "The Pursuit of Happyness",
        year: 2006,
        category: "Drame",
        type: "film",
        emoji: "🌟",
        image: "",
        video: "",
        description: "Un père traverse de grandes difficultés tout en essayant de construire un avenir meilleur pour son fils."
    },
    {
        id: 12,
        title: "Kung Fu Panda",
        year: 2008,
        category: "Animation",
        type: "film",
        emoji: "🐼",
        image: "",
        video: "",
        description: "Un panda maladroit découvre qu'il est destiné à devenir un grand maître du kung-fu."
    }
];

/*
 * Permet à app.js de retrouver le catalogue.
 * Le catalogue MOBILUS est également enregistré
 * dans localStorage pour les autres pages.
 */

window.films = films;