(() => {

    if(Cfg.$workbench){
        RecipeTypeRegistry.register("workbench", new WorkbenchRecipe());
    }

    if(Cfg.$furnace){
        RecipeTypeRegistry.register("furnace", new FurnaceRecipe());
    }

    if(Cfg.$fuel){
        RecipeTypeRegistry.register("fuel", new FurnaceFuelRecipe());
    }

    if(Cfg.$blast_furnace){
        RecipeTypeRegistry.register("blast_furnace", BlastFurnaceRecipe);
    }

    if(Cfg.$smoker){
        RecipeTypeRegistry.register("smoker", SmokerRecipe);
    }

    if(Cfg.$campfire){
        RecipeTypeRegistry.register("campfire", CampfireRecipe);
    }

    if(Cfg.$brewing){
        RecipeTypeRegistry.register("brewing", new BrewingRecipe());
    }

    if(Cfg.$stonecutter){
        RecipeTypeRegistry.register("stonecutter", new StonecutterRecipe());
    }

    if(Cfg.$smithing && !isLegacy){
        RecipeTypeRegistry.register("smithing", new SmithingRecipe());
    }

    if(Cfg.$trading){
        RecipeTypeRegistry.register("trading", new TradingRecipe());
    }

    if(Cfg.$liquid_filling){
        RecipeTypeRegistry.register("liquid_filling", new LiquidFillingRecipe());
    }

    RButton.putOnNativeGui("innercore_generic_crafting_screen", "workbench");
    RButton.putOnNativeGui("furnace_screen", ["furnace", "fuel"]);
    RButton.putOnNativeGui("blast_furnace_screen", ["blast_furnace", "fuel"]);
    RButton.putOnNativeGui("smoker_screen", ["smoker", "fuel"]);
    RButton.putOnNativeGui("brewing_stand_screen", "brewing");
    RButton.putOnNativeGui("stonecutter_screen", "stonecutter");
    RButton.putOnNativeGui("smithing_table_screen", "smithing");
    RButton.putOnNativeGui("trade_screen", "trading");

})();