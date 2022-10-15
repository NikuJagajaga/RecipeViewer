class BrewingRecipe extends RecipeType {

    private static recipeList: RecipePattern[] = [];
/*
    static registerRecipe(input: string, reagent: string, output: string): void {
        const inputItem = BehaviorTools.convertToItem(input);
        const reagentItem = BehaviorTools.convertToItem(reagent);
        const outputItem = BehaviorTools.convertToItem(output);
        inputItem && reagentItem && outputItem && this.recipeList.push({
            input: [
                {id: VanillaItemID.blaze_powder, count: 1, data: 0},
                {id: reagentItem.id, count: 1, data: reagentItem.data},
                {id: inputItem.id, count: 1, data: inputItem.data},
            ],
            output: [
                {id: outputItem.id, count: 1, data: outputItem.data}
            ]
        });
    }
*/
    private static recipeListOld: RecipePattern[] = (() => {

        const recipes: RecipePattern[] = [];

        const id = {
            normal: VanillaItemID.potion,
            splash: VanillaItemID.splash_potion,
            lingering: VanillaItemID.lingering_potion
        } as const;

        const corrupt = {
            night_vision: "invisibility",
            swiftness: "slowness",
            leaping: "slowness",
            healing: "harming",
            poison: "harming",
            regeneration: "weakness",
            strength: "weakness"
        } as const;

        const meta = {
            water: {basic: 0},
            mundane: {basic: 1, long: 2},
            thick: {basic: 3},
            awkward: {basic: 4},
            night_vision: {basic: 5, long: 6},
            invisibility: {basic: 7, long: 8},
            leaping: {basic: 9, long: 10, strong: 11},
            fire_resistance: {basic: 12, long: 13},
            swiftness: {basic: 14, long: 15, strong: 16},
            slowness: {basic: 17, long: 18},
            water_breathing: {basic: 19, long: 20},
            healing: {basic: 21, strong: 22},
            harming: {basic: 23, strong: 24},
            poison: {basic: 25, long: 26, strong: 27},
            regeneration: {basic: 28, long: 29, strong: 30},
            strength: {basic: 31, long: 32, strong: 33},
            weakness: {basic: 34, long: 35},
            decay: {basic: 36},
            turtle_master: {basic: 37, long: 38, strong: 39},
            slow_falling: {basic: 40, long: 41}
        } as const;

        const add = (sourceID: number, potionType1: keyof typeof id, potionMeta1: number, potionType2: keyof typeof id, potionMeta2: number): void => {
            recipes.push({
                input: [
                    {id: VanillaItemID.blaze_powder, count: 1, data: 0},
                    {id: sourceID, count: 1, data: 0},
                    {id: id[potionType1], count: 1, data: potionMeta1}
                ],
                output: [
                    {id: id[potionType2], count: 1, data: potionMeta2}
                ]
            });
        };

        const addEachBottle = (sourceID: number, potionMeta1: number, potionMeta2: number): void => {
            add(sourceID, "normal", potionMeta1, "normal", potionMeta2);
            add(sourceID, "splash", potionMeta1, "splash", potionMeta2);
            add(sourceID, "lingering", potionMeta1, "lingering", potionMeta2);
        };

        const addEffect = (sourceID: number, baseType: keyof typeof meta, resultType: keyof typeof meta): void => {
            addEachBottle(sourceID, meta[baseType].basic, meta[resultType].basic);
        };

        addEffect(VanillaItemID.spider_eye, "water", "mundane");
        addEffect(VanillaItemID.ghast_tear, "water", "mundane");
        addEffect(VanillaItemID.rabbit_foot, "water", "mundane");
        addEffect(VanillaItemID.blaze_powder, "water", "mundane");
        addEffect(VanillaItemID.speckled_melon, "water", "mundane");
        addEffect(VanillaItemID.sugar, "water", "mundane");
        addEffect(VanillaItemID.magma_cream, "water", "mundane");
        addEffect(VanillaItemID.redstone, "water", "mundane");
        addEffect(VanillaItemID.glowstone_dust, "water", "thick");
        addEffect(VanillaBlockID.nether_wart, "water", "awkward");
        addEffect(VanillaItemID.golden_carrot, "awkward", "night_vision");
        addEffect(VanillaItemID.rabbit_foot, "awkward", "leaping");
        addEffect(VanillaItemID.magma_cream, "awkward", "fire_resistance");
        addEffect(VanillaItemID.sugar, "awkward", "swiftness");
        addEffect(VanillaItemID.pufferfish, "awkward", "water_breathing");
        addEffect(VanillaItemID.speckled_melon, "awkward", "healing");
        addEffect(VanillaItemID.spider_eye, "awkward", "poison");
        addEffect(VanillaItemID.ghast_tear, "awkward", "regeneration");
        addEffect(VanillaItemID.blaze_powder, "awkward", "strength");
        addEffect(VanillaItemID.fermented_spider_eye, "water", "weakness");
        addEffect(VanillaItemID.turtle_helmet, "awkward", "turtle_master");
        addEffect(VanillaItemID.phantom_membrane, "awkward", "slow_falling");

        let type: string;
        for(let effect in meta){
            meta[effect].long && addEachBottle(VanillaItemID.redstone, meta[effect].basic, meta[effect].long);
            meta[effect].strong && addEachBottle(VanillaItemID.glowstone_dust, meta[effect].basic, meta[effect].strong);
            for(type in meta[effect]){
                add(VanillaItemID.gunpowder, "normal", meta[effect][type], "splash", meta[effect][type]);
                add(VanillaItemID.dragon_breath, "splash", meta[effect][type], "lingering", meta[effect][type]);
            }
        }
        for(let effect in corrupt){
            for(type in meta[effect]){
                meta[corrupt[effect]][type] && addEachBottle(VanillaItemID.fermented_spider_eye, meta[effect][type], meta[corrupt[effect]][type]);
            }
        }

        return recipes;

    })();

    constructor(){
        const font = {size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER};
        super("Potion Brewing", VanillaBlockID.brewing_stand, {
            params: {slot: "classic_slot"},
            drawing: [
                {type: "bitmap", x: 68, y: 60, scale: 4, bitmap: "rv.brewing_stand_back"},
                {type: "text", x: 244 + 64, y: 440, text: "Source", font: font},
                {type: "text", x: 628 + 64, y: 440, text: "Result", font: font}
            ],
            elements: {
                input0: {x: 68, y: 60, size: 128},
                input1: {x: 436, y: 68, size: 128},
                input2: {x: 244, y: 276, size: 128},
                output0: {x: 628, y: 276, size: 128}
            }
        });
    }

    getAllList(): RecipePattern[] {
        return BrewingRecipe.recipeListOld;
        //return isLegacy ? BrewingRecipe.recipeListOld : BrewingRecipe.recipeList;
    }

}