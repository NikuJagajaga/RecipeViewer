const Cfg = {

    set: (name: string, value: any) => {
        __config__.getValue(name).set(value);
    },

    loadIcon: __config__.getBool("loadIcon"),

    buttonX: __config__.getNumber("ButtonPosition.x").intValue(),
    buttonY: __config__.getNumber("ButtonPosition.y").intValue(),

    slotCountX: __config__.getNumber("slotCountX").intValue(),

    showId: __config__.getBool("showId"),
    preventMistap: __config__.getBool("preventMistap"),

    $workbench: __config__.getBool("availableRecipes.workbench"),
    $furnace: __config__.getBool("availableRecipes.furnace"),
    $fuel: __config__.getBool("availableRecipes.fuel"),
    $blast_furnace: __config__.getBool("availableRecipes.blast_furnace"),
    $smoker: __config__.getBool("availableRecipes.smoker"),
    $campfire: __config__.getBool("availableRecipes.campfire"),
    $brewing: __config__.getBool("availableRecipes.brewing"),
    $stonecutter: __config__.getBool("availableRecipes.stonecutter"),
    $smithing: __config__.getBool("availableRecipes.smithing"),
    $trading: __config__.getBool("availableRecipes.trading"),
    $liquid_filling: __config__.getBool("availableRecipes.liquid_filling")

} as const;