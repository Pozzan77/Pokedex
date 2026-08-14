const generationVersionGroups = {
    "generation-i": [
        "red-blue",
        "yellow"
    ],

    "generation-ii": [
        "gold-silver",
        "crystal"
    ],

    "generation-iii": [
        "ruby-sapphire",
        "emerald",
        "firered-leafgreen"
    ],

    "generation-iv": [
        "diamond-pearl",
        "platinum",
        "heartgold-soulsilver"
    ],

    "generation-v": [
        "black-white",
        "black-2-white-2"
    ],

    "generation-vi": [
        "x-y",
        "omega-ruby-alpha-sapphire"
    ],

    "generation-vii": [
        "sun-moon",
        "ultra-sun-ultra-moon",
        "lets-go-pikachu-lets-go-eevee"
    ],

    "generation-viii": [
        "sword-shield",
        "brilliant-diamond-and-shining-pearl",
        "legends-arceus"
    ],

    "generation-ix": [
        "scarlet-violet"
    ]
};

export function getVersionGroupsFromGeneration(generation) {
    const generationName = `generation-${["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"][generation - 1]}`;

    return generationVersionGroups[generationName] || [];
}