function formatName(name) {
    return name
        .replaceAll("-", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

export function getEvolutionMethod(details) {
    if (!details) return "";

    const methods = [];

    if (details.min_level) {
        methods.push(`Level ${details.min_level}`);
    }


    if (details.min_happiness) {
        methods.push("Friendship");
    }

    if (details.min_beauty) {
        methods.push("Beauty");
    }

    if (details.item) {
        methods.push(formatName(details.item.name));
    }

    if (details.held_item) {
        methods.push(`Hold ${formatName(details.held_item.name)}`);
    }

    if (details.known_move) {
        methods.push(`Know ${formatName(details.known_move.name)}`);
    }

    if (details.known_move_type) {
        methods.push(
            `Know a ${formatName(details.known_move_type.name)}-type move`
        );
    }

    if (details.location) {
        methods.push(`At ${formatName(details.location.name)}`);
    }

    if (details.time_of_day) {
        methods.push(`During ${formatName(details.time_of_day)}`);
    }

    if (details.gender === 1) {
        methods.push("Female");
    }

    if (details.gender === 2) {
        methods.push("Male");
    }

    if (details.trigger?.name === "trade") {
        methods.push("Trade");
    }

    if (details.trade_species) {
        methods.push(
            `Trade for ${formatName(details.trade_species.name)}`
        );
    }

    if (details.party_species) {
        methods.push(
            `${formatName(details.party_species.name)} in party`
        );
    }

    if (details.party_type) {
        methods.push(
            `${formatName(details.party_type.name)}-type in party`
        );
    }

    if (details.needs_overworld_rain) {
        methods.push("During rain");
    }

    if (details.turn_upside_down) {
        methods.push("Turn console upside down");
    }

    if (details.relative_physical_stats === 1) {
        methods.push("Attack > Defense");
    }

    if (details.relative_physical_stats === -1) {
        methods.push("Attack < Defense");
    }

    if (details.relative_physical_stats === 0) {
        methods.push("Attack = Defense");
    }

    if (details.min_move_count) {
        methods.push(`Use ${formatName(details.used_move.name)} ${details.min_move_count} times`)    
    } 

    if (details.min_steps) {
        methods.push(`Take ${details.min_steps} steps`)
    }

    if (details.min_damage_taken) {
        methods.push(`Receive ${details.min_damage_taken} damage in battle`)
    }

    if (details.needs_multiplayer) {
        methods.push("Only in multiplayer")
    }

    if (details.min_affection) {
        methods.push("Affection");
    }
    
    if (details.near_special_rock) {
        methods.push("Near a special rock");
    }

    if (details.trigger?.name === "spin") {
        methods.push("Spin with a Sweet");
    }

    if (details.trigger?.name === "gimmighoul-coins") {
        methods.push("Collect 999 gimmighoul coins");
    }

    if (details.trigger?.name === "three-defeated-bisharp") {
        methods.push("Defeat 3 Bisharp that are holding Leader's Crest");
    }

    return methods.join(" + ");
}