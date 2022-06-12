Callback.addCallback("PostLoaded", () => {

    const x = __config__.getNumber("ButtonPosition.x").intValue();
    const y = __config__.getNumber("ButtonPosition.y").intValue();
    StartButton.getLocation().set(x < 0 ? 1000 - (-x): x, y < 0 ? ScreenHeight - (-y): y, 64, 64);

    Threading.initThread("rv_readJson", () => {

        //const time = Debug.sysTime();

        //alert("[RV]: Start loading vanilla recipe Json");

        ItemList.addVanillaItems();
        TradingRecipe.setup();

        if(isLegacy){
            BehaviorJsonReader.readListOfJson(__packdir__ + "assets/definitions/recipe/").forEach((json: RecipeJsonOld) => {
                if(json.type === "furnace_recipe"){
                    let furnaceIn = BehaviorJsonReader.convertToItem(json.input);
                    let furnaceOut = BehaviorJsonReader.convertToItem(json.output);
                    if(furnaceIn && furnaceOut){
                        for(let i = 0; i < json.tags.length; i++){
                            switch(json.tags[i]){
                                case "blast_furnace": BlastFurnaceRecipe.registerRecipe(furnaceIn, furnaceOut); break;
                                case "smoker": SmokerRecipe.registerRecipe(furnaceIn, furnaceOut); break;
                                case "campfire": CampfireRecipe.registerRecipe(furnaceIn, furnaceOut); break;
                            }
                        }
                    }
                }
                else if(json.type === "crafting_shapeless"){
                    if(json.tags.some(tag => tag === "stonecutter")){
                        let stonecutterIn: ItemInstance = {id: BehaviorJsonReader.getNumericID(json.ingredients[0].item), count: json.ingredients[0].count || 1, data: json.ingredients[0].data || 0};
                        let stonecutterOut: ItemInstance = {id: BehaviorJsonReader.getNumericID(json.result.item), count: json.result.count || 1, data: json.result.data || 0};
                        StonecutterRecipe.registerRecipe(stonecutterIn, stonecutterOut);
                    }
                }
            });
        }
        else{
            BehaviorJsonReader.readListOfJson(__packdir__ + "assets/behavior_packs/vanilla/recipes/").forEach((json: RecipeJson) => {
                if(json["minecraft:recipe_furnace"]){
                    const recipe = json["minecraft:recipe_furnace"];
                    let furnaceIn = BehaviorJsonReader.convertToItem(recipe.input);
                    let furnaceOut = BehaviorJsonReader.convertToItem(recipe.output);
                    if(furnaceIn && furnaceOut){
                        for(let i = 0; i < recipe.tags.length; i++){
                            switch(recipe.tags[i]){
                                case "blast_furnace": BlastFurnaceRecipe.registerRecipe(furnaceIn, furnaceOut); break;
                                case "smoker": SmokerRecipe.registerRecipe(furnaceIn, furnaceOut); break;
                                case "campfire": CampfireRecipe.registerRecipe(furnaceIn, furnaceOut); break;
                            }
                        }
                    }
                }
                /*
                else if(json["minecraft:recipe_brewing_mix"]){
                    const recipe = json["minecraft:recipe_brewing_mix"];
                    recipe.tags.some(tag => tag === "brewing_stand") && BrewingRecipe.registerRecipe(recipe.input, recipe.reagent, recipe.output);
                }
                */
                else if(json["minecraft:recipe_shapeless"]){
                    const recipe = json["minecraft:recipe_shapeless"];
                    let stonecutterIn: ItemInstance = {id: BehaviorJsonReader.getNumericID(recipe.ingredients[0].item), count: recipe.ingredients[0].count || 1, data: recipe.ingredients[0].data || 0};
                    let stonecutterOut: ItemInstance = {id: BehaviorJsonReader.getNumericID(recipe.result.item), count: recipe.result.count || 1, data: recipe.result.data || 0};
                    recipe.tags.some(tag => tag === "stonecutter") && StonecutterRecipe.registerRecipe(stonecutterIn, stonecutterOut);
                }
            });
        }

        //alert(`[RV]: Finish! (${Debug.sysTime() - time} ms)`);

    });

});


Callback.addCallback("LevelLoaded", () => {
    Threading.initThread("rv_setup", () => {
        const time = Debug.sysTime();
        ItemList.addModItems();
        ItemList.setup();
        __config__.getBool("loadIcon") && ItemList.cacheIcons();
        SubUI.setupWindow();
        Game.message(`Recipe Viewer is ready (${Debug.sysTime() - time} ms)`);
    });
});


ModAPI.registerAPI("RecipeViewer", {
	Core: OldVersion,
    ItemList: ItemList,
    RecipeType: RecipeType,
    RecipeTypeRegistry: RecipeTypeRegistry
});