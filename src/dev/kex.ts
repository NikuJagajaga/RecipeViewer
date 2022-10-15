ModAPI.addAPICallback("KernelExtension", function(api: typeof KEX) {

    if(typeof api.getKEXVersionCode !== "function" || api.getKEXVersionCode() < 300){
        return;
    }

    getNumericID = (key: any_string) => api.AddonUtils.getNumericIdFromIdentifier(String(key).slice(("minecraft:").length));

    SmithingRecipe.overrideList(Recipes.getAllSmithingTableRecipes().map(recipe => ({
        input: [
            {id: recipe.baseID, count: 1, data: -1},
            {id: recipe.additionID, count: 1, data: -1}
        ],
        output: [{id: recipe.resultID, count: 1, data: -1}]
    })));

/*

    const addMobDropRecipe = (name: string, tableName: string): void => {
        api.LootModule.createLootTableModifier(tableName).addJSPostModifyCallback(json => {
            MobDropRecipe.registerRecipe(name, json)
        });
        api.LootModule.forceLoad(tableName);
    }

    addMobDropRecipe("Zombie", "entities/zombie");
    addMobDropRecipe("Skeleton", "entities/skeleton");
    addMobDropRecipe("Spider", "entities/spider");
    addMobDropRecipe("Creeper", "entities/creeper");

*/

});