const BrewingRecipe = {

    recipes: [],

    id: {
        normal: VanillaItemID.potion,
        splash: VanillaItemID.splash_potion,
        lingering: VanillaItemID.lingering_potion
    },

    meta: {
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
    },

    corrupt: {
        night_vision: "invisibility",
        swiftness: "slowness",
        leaping: "slowness",
        healing: "harming",
        poison: "harming",
        regeneration: "weakness",
        strength: "weakness"
    },

    add: function(sourceID, potionType1, potionMeta1, potionType2, potionMeta2){
        this.recipes.push({
            input: [
                {id: VanillaItemID.blaze_powder, count: 1, data: 0},
                {id: sourceID, count: 1, data: 0},
                {id: this.id[potionType1], count: 1, data: potionMeta1}
            ],
            output: [
                {id: this.id[potionType2], count: 1, data: potionMeta2}
            ]
        });
    },

    addEachBottle: function(sourceID, potionMeta1, potionMeta2){
        for(let key in this.id){
            this.add(sourceID, key, potionMeta1, key, potionMeta2);
        }
    },

    addEffect: function(sourceID, baseType, resultType){
        this.addEachBottle(sourceID, this.meta[baseType].basic, this.meta[resultType].basic);
    },

    setup: function(){
        let type = "";
        for(let effect in this.meta){
            this.meta[effect].long && this.addEachBottle(VanillaItemID.redstone, this.meta[effect].basic, this.meta[effect].long);
            this.meta[effect].strong && this.addEachBottle(VanillaItemID.glowstone_dust, this.meta[effect].basic, this.meta[effect].strong);
            for(type in this.meta[effect]){
                this.add(VanillaItemID.gunpowder, "normal", this.meta[effect][type], "splash", this.meta[effect][type]);
                this.add(VanillaItemID.dragon_breath, "splash", this.meta[effect][type], "lingering", this.meta[effect][type]);
            }
        }
        for(let effect in this.corrupt){
            for(type in this.meta[effect]){
                this.meta[this.corrupt[effect]][type] && this.addEachBottle(VanillaItemID.fermented_spider_eye, this.meta[effect][type], this.meta[this.corrupt[effect]][type]);
            }
        }
    },

    getName: function(meta){
        return Item.getName(VanillaItemID.potion, meta).replace(" Potion", "").replace("Potion of ", "");
    }

};


BrewingRecipe.addEffect(VanillaItemID.spider_eye, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.ghast_tear, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.rabbit_foot, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.blaze_powder, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.speckled_melon, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.sugar, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.magma_cream, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.redstone, "water", "mundane");
BrewingRecipe.addEffect(VanillaItemID.glowstone_dust, "water", "thick");
BrewingRecipe.addEffect(VanillaBlockID.nether_wart, "water", "awkward");
BrewingRecipe.addEffect(VanillaItemID.golden_carrot, "awkward", "night_vision");
BrewingRecipe.addEffect(VanillaItemID.rabbit_foot, "awkward", "leaping");
BrewingRecipe.addEffect(VanillaItemID.magma_cream, "awkward", "fire_resistance");
BrewingRecipe.addEffect(VanillaItemID.sugar, "awkward", "swiftness");
BrewingRecipe.addEffect(VanillaItemID.pufferfish, "awkward", "water_breathing");
BrewingRecipe.addEffect(VanillaItemID.speckled_melon, "awkward", "healing");
BrewingRecipe.addEffect(VanillaItemID.spider_eye, "awkward", "poison");
BrewingRecipe.addEffect(VanillaItemID.ghast_tear, "awkward", "regeneration");
BrewingRecipe.addEffect(VanillaItemID.blaze_powder, "awkward", "strength");
BrewingRecipe.addEffect(VanillaItemID.fermented_spider_eye, "water", "weakness");
BrewingRecipe.addEffect(VanillaItemID.turtle_helmet, "awkward", "turtle_master");
BrewingRecipe.addEffect(VanillaItemID.phantom_membrane, "awkward", "slow_falling");
BrewingRecipe.setup();


RecipeViewer.registerRecipeType("brewing", {
    title: "Potion Brewing",
    contents: {
        icon: VanillaBlockID.brewing_stand,
        drawing: [
            {type: "bitmap", x: 68, y: 60, scale: 4, bitmap: "brewing_stand_back"}
        ],
        elements: {
            input0: {x: 68, y: 60, size: 128, bitmap: "classic_slot"},
            input1: {x: 436, y: 68, size: 128, bitmap: "classic_slot"},
            input2: {x: 244, y: 276, size: 128, bitmap: "classic_slot"},
            output0: {x: 628, y: 276, size: 128, bitmap: "classic_slot"},
            text1: {type: "text", x: 372, y: 420, font: {size: 30, color: Color.WHITE, shadow: 0.5, alignment: 2}},
            text2: {type: "text", x: 628, y: 420, font: {size: 30, color: Color.WHITE, shadow: 0.5}}
        }
    },
    recipeList: BrewingRecipe.recipes,
    onOpen: function(elements, recipe){
        elements.get("text1").onBindingUpdated("text", BrewingRecipe.getName(recipe.input[2].data));
        elements.get("text2").onBindingUpdated("text", BrewingRecipe.getName(recipe.output[0].data));
    }
});


RecipeViewer.putButtonOnNativeGui("brewing_stand_screen", "brewing");