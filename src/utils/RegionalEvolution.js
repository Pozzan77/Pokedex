const regionalEvolutionMethods = {

    // =========================
    // ALOLA
    // =========================

    "raticate-alola": {
        min_level: 20,
        time_of_day: "night"
    },

    "sandslash-alola": {
        item: {
            name: "ice-stone"
        }
    },

    "ninetales-alola": {
        item: {
            name: "ice-stone"
        }
    },

    "persian-alola": {
        min_happiness: 160
    },

    "marowak-alola": {
        min_level: 28,
        time_of_day: "night"
    },


    // =========================
    // GALAR
    // =========================

    "slowbro-galar": {
        item: {
            name: "galarica-cuff"
        }
    },

    "slowking-galar": {
        item: {
            name: "galarica-wreath"
        }
    },

    "sirfetchd": {
        min_critical_hits: 3
    },


    "darmanitan-galar": {
        item: {
            name: "ice-stone"
        }
    },



    // =========================
    // HISUI
    // =========================

    "electrode-hisui": {
        item: {
            name: "leaf-stone"
        }
    },


};


export function getRegionalEvolutionMethod(pokemonName) {
    return regionalEvolutionMethods[pokemonName] || null;
}