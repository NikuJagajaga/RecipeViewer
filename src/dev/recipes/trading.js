const TradingRecipe = {

    recipes: [],

    add: function(job, level, given, wanted, wanted2){
        const input = [];
        input.push({id: wanted.id || wanted, count: wanted.count || 1, data: wanted.data || 0});
        wanted2 && input.push({id: wanted2.id || wanted2, count: wanted2.count || 1, data: wanted2.data || 0});
        this.recipes.push({
            input: input,
            output: [{id: given.id || given, count: given.count || 1, data: given.data || 0}],
            job: job,
            level: level,
            isEnchanted: given.enc || false
        });
    },

    addWandering: function(price, offer){
        this.add("Wandering Trader", 0, offer, {id: VanillaItemID.emerald, count: price});
    }

};


(function(){

    TradingRecipe.add("Armorer", 1, VanillaItemID.emerald, {id: VanillaItemID.coal, count: 15});
    TradingRecipe.add("Armorer", 1, VanillaItemID.iron_helmet, {id: VanillaItemID.emerald, count: 5});
    TradingRecipe.add("Armorer", 1, VanillaItemID.iron_chestplate, {id: VanillaItemID.emerald, count: 9});
    TradingRecipe.add("Armorer", 1, VanillaItemID.iron_leggings, {id: VanillaItemID.emerald, count: 7});
    TradingRecipe.add("Armorer", 1, VanillaItemID.iron_boots, {id: VanillaItemID.emerald, count: 4});
    TradingRecipe.add("Armorer", 2, VanillaItemID.emerald, {id: VanillaItemID.iron_ingot, count: 4});
    TradingRecipe.add("Armorer", 2, VanillaBlockID.bell, {id: VanillaItemID.emerald, count: 36});
    TradingRecipe.add("Armorer", 2, VanillaItemID.chainmail_leggings, {id: VanillaItemID.emerald, count: 3});
    TradingRecipe.add("Armorer", 2, VanillaItemID.chainmail_boots, VanillaItemID.emerald);
    TradingRecipe.add("Armorer", 3, VanillaItemID.emerald, {id: VanillaItemID.bucket, data: 10});
    TradingRecipe.add("Armorer", 3, VanillaItemID.chainmail_helmet, VanillaItemID.emerald);
    TradingRecipe.add("Armorer", 3, VanillaItemID.chainmail_chestplate, {id: VanillaItemID.emerald, count: 4});
    TradingRecipe.add("Armorer", 3, VanillaItemID.shield, {id: VanillaItemID.emerald, count: 5});
    TradingRecipe.add("Armorer", 4, VanillaItemID.emerald, VanillaItemID.diamond);
    TradingRecipe.add("Armorer", 4, {id: VanillaItemID.diamond_leggings, enc: true}, {id: VanillaItemID.emerald, count: 33});
    TradingRecipe.add("Armorer", 4, {id: VanillaItemID.diamond_boots, enc: true}, {id: VanillaItemID.emerald, count: 27});
    TradingRecipe.add("Armorer", 5, {id: VanillaItemID.diamond_helmet, enc: true}, {id: VanillaItemID.emerald, count: 27});
    TradingRecipe.add("Armorer", 5, {id: VanillaItemID.diamond_chestplate, enc: true}, {id: VanillaItemID.emerald, count: 35});

    TradingRecipe.add("Butcher", 1, VanillaItemID.emerald, {id: VanillaItemID.chicken, count: 14});
    TradingRecipe.add("Butcher", 1, VanillaItemID.emerald, {id: VanillaItemID.rabbit, count: 4});
    TradingRecipe.add("Butcher", 1, VanillaItemID.emerald, {id: VanillaItemID.porkchop, count: 7});
    TradingRecipe.add("Butcher", 1, VanillaItemID.rabbit_stew, VanillaItemID.emerald);
    TradingRecipe.add("Butcher", 2, VanillaItemID.emerald, {id: VanillaItemID.coal, count: 15});
    TradingRecipe.add("Butcher", 2, {id: VanillaItemID.cooked_rabbit, count: 5}, VanillaItemID.emerald);
    TradingRecipe.add("Butcher", 2, {id: VanillaItemID.cooked_chicken, count: 8}, VanillaItemID.emerald);
    TradingRecipe.add("Butcher", 2, {id: VanillaItemID.cooked_porkchop, count: 5}, VanillaItemID.emerald);
    TradingRecipe.add("Butcher", 2, {id: VanillaItemID.muttoncooked, count: 4}, VanillaItemID.emerald);
    TradingRecipe.add("Butcher", 3, VanillaItemID.emerald, {id: VanillaItemID.beef, count: 10});
    TradingRecipe.add("Butcher", 3, VanillaItemID.emerald, {id: VanillaItemID.muttonraw, count: 7});
    TradingRecipe.add("Butcher", 3, {id: VanillaItemID.cooked_beef, count: 3}, VanillaItemID.emerald);
    TradingRecipe.add("Butcher", 4, VanillaItemID.emerald, {id: VanillaBlockID.dried_kelp_block, count: 10});
    TradingRecipe.add("Butcher", 5, VanillaItemID.emerald, {id: VanillaItemID.sweet_berries, count: 10});

    TradingRecipe.add("Cartographer", 1, VanillaItemID.emerald, {id: VanillaItemID.paper, count: 24});
    TradingRecipe.add("Cartographer", 1, VanillaItemID.emptymap, {id: VanillaItemID.emerald, count: 7});
    TradingRecipe.add("Cartographer", 2, VanillaItemID.emerald, {id: VanillaBlockID.glass_pane, count: 11});
    TradingRecipe.add("Cartographer", 2, {id: VanillaItemID.map, data: 3}, {id: VanillaItemID.emerald, count: 13}, VanillaItemID.compass);
    TradingRecipe.add("Cartographer", 3, VanillaItemID.emerald, VanillaItemID.compass);
    TradingRecipe.add("Cartographer", 3, {id: VanillaItemID.map, data: 4}, {id: VanillaItemID.emerald, count: 14}, VanillaItemID.compass);
    TradingRecipe.add("Cartographer", 4, VanillaBlockID.frame, {id: VanillaItemID.emerald, count: 7});
    for(let i = 0; i < 16; i++){
        TradingRecipe.add("Cartographer", 4, {id: VanillaItemID.banner, data: i}, {id: VanillaItemID.emerald, count: 3});
    }
    TradingRecipe.add("Cartographer", 5, {id: VanillaItemID.banner_pattern, data: 2}, VanillaItemID.emerald);
    TradingRecipe.add("Cartographer", 5, {id: VanillaItemID.banner_pattern, data: 4}, {id: VanillaItemID.emerald, count: 2});
    TradingRecipe.add("Cartographer", 5, {id: VanillaItemID.banner_pattern, data: 5}, {id: VanillaItemID.emerald, count: 2});

    TradingRecipe.add("Cleric", 1, VanillaItemID.emerald, {id: VanillaItemID.rotten_flesh, count: 32});
    TradingRecipe.add("Cleric", 1, {id: VanillaItemID.redstone, count: 2}, VanillaItemID.emerald);
    TradingRecipe.add("Cleric", 2, VanillaItemID.emerald, {id: VanillaItemID.gold_ingot, count: 3});
    TradingRecipe.add("Cleric", 2, {id: VanillaItemID.dye, data: 4}, VanillaItemID.emerald);
    TradingRecipe.add("Cleric", 3, VanillaItemID.emerald, {id: VanillaItemID.rabbit_foot, count: 2});
    TradingRecipe.add("Cleric", 3, VanillaItemID.glowstone_dust, {id: VanillaItemID.emerald, count: 4});
    TradingRecipe.add("Cleric", 4, VanillaItemID.emerald, {id: VanillaItemID.turtle_shell_piece, count: 4});
    TradingRecipe.add("Cleric", 4, VanillaItemID.emerald, {id: VanillaItemID.glass_bottle, count: 9});
    TradingRecipe.add("Cleric", 4, VanillaItemID.ender_pearl, {id: VanillaItemID.emerald, count: 5});
    TradingRecipe.add("Cleric", 5, VanillaItemID.emerald, {id: VanillaBlockID.nether_wart, count: 22});
    TradingRecipe.add("Cleric", 5, VanillaItemID.experience_bottle, {id: VanillaItemID.emerald, count: 3});

    TradingRecipe.add("Farmer", 1, VanillaItemID.emerald, {id: VanillaBlockID.wheat, count: 20});
    TradingRecipe.add("Farmer", 1, VanillaItemID.emerald, {id: VanillaItemID.potato, count: 26});
    TradingRecipe.add("Farmer", 1, VanillaItemID.emerald, {id: VanillaItemID.carrot, count: 22});
    TradingRecipe.add("Farmer", 1, VanillaItemID.emerald, {id: VanillaBlockID.beetroot, count: 15});
    TradingRecipe.add("Farmer", 1, {id: VanillaItemID.bread, count: 6}, VanillaItemID.emerald);
    TradingRecipe.add("Farmer", 2, VanillaItemID.emerald, {id: VanillaBlockID.pumpkin, count: 6});
    TradingRecipe.add("Farmer", 2, {id: VanillaItemID.pumpkin_pie, count: 4}, VanillaItemID.emerald);
    TradingRecipe.add("Farmer", 2, {id: VanillaItemID.apple, count: 4}, VanillaItemID.emerald);
    TradingRecipe.add("Farmer", 3, VanillaItemID.emerald, {id: VanillaBlockID.melon_block, count: 4});
    TradingRecipe.add("Farmer", 3, {id: VanillaItemID.cookie, count: 18}, {id: VanillaItemID.emerald, count: 3});
    //TradingRecipe.add("Farmer", 4, VanillaItemID.suspicious_stew || 734, VanillaItemID.emerald);
    TradingRecipe.add("Farmer", 4, VanillaBlockID.cake, VanillaItemID.emerald);
    TradingRecipe.add("Farmer", 5, {id: VanillaItemID.golden_carrot, count: 3}, {id: VanillaItemID.emerald, count: 3});
    TradingRecipe.add("Farmer", 5, {id: VanillaItemID.speckled_melon, count: 3}, {id: VanillaItemID.emerald, count: 4});

    TradingRecipe.add("Fisherman", 1, VanillaItemID.emerald, {id: VanillaItemID.string, count: 20});
    TradingRecipe.add("Fisherman", 1, VanillaItemID.emerald, {id: VanillaItemID.coal, count: 10});
    TradingRecipe.add("Fisherman", 1, {id: VanillaItemID.bucket, data: 2}, {id: VanillaItemID.emerald, count: 3});
    TradingRecipe.add("Fisherman", 1, {id: VanillaItemID.cooked_fish, count: 6}, VanillaItemID.emerald, {id: VanillaItemID.fish, count: 6});
    TradingRecipe.add("Fisherman", 2, VanillaItemID.emerald, {id: VanillaItemID.fish, count: 15});
    TradingRecipe.add("Fisherman", 2, VanillaBlockID.campfire, {id: VanillaItemID.emerald, count: 2});
    TradingRecipe.add("Fisherman", 2, {id: VanillaItemID.cooked_salmon, count: 6}, VanillaItemID.emerald, {id: VanillaItemID.salmon, count: 6});
    TradingRecipe.add("Fisherman", 3, VanillaItemID.emerald, {id: VanillaItemID.salmon, count: 13});
    TradingRecipe.add("Fisherman", 3, {id: VanillaItemID.fishing_rod, enc: true}, {id: VanillaItemID.emerald, count: 22});
    TradingRecipe.add("Fisherman", 4, VanillaItemID.emerald, {id: VanillaItemID.clownfish, count: 6});
    TradingRecipe.add("Fisherman", 5, VanillaItemID.emerald, {id: VanillaItemID.pufferfish, count: 4});
    for(let i = 0; i < 6; i++){
        if(i !== 2){
            TradingRecipe.add("Fisherman", 5, VanillaItemID.emerald, {id: VanillaItemID.boat, data: i});
        }
    }

    TradingRecipe.add("Fletcher", 1, VanillaItemID.emerald, {id: VanillaItemID.stick, count: 32});
    TradingRecipe.add("Fletcher", 1, {id: VanillaItemID.arrow, count: 16}, VanillaItemID.emerald);
    TradingRecipe.add("Fletcher", 1, {id: VanillaItemID.flint, count: 10}, VanillaItemID.emerald, {id: VanillaBlockID.gravel, count: 10});
    TradingRecipe.add("Fletcher", 2, VanillaItemID.emerald, {id: VanillaItemID.flint, count: 26});
    TradingRecipe.add("Fletcher", 2, VanillaItemID.bow, {id: VanillaItemID.emerald, count: 2});
    TradingRecipe.add("Fletcher", 3, VanillaItemID.emerald, {id: VanillaItemID.string, count: 14});
    TradingRecipe.add("Fletcher", 3, VanillaItemID.crossbow, {id: VanillaItemID.emerald, count: 3});
    TradingRecipe.add("Fletcher", 4, VanillaItemID.emerald, {id: VanillaItemID.feather, count: 24});
    TradingRecipe.add("Fletcher", 4, {id: VanillaItemID.bow, enc: true}, {id: VanillaItemID.emerald, count: 21});
    TradingRecipe.add("Fletcher", 5, VanillaItemID.emerald, {id: VanillaBlockID.tripwire_hook, count: 8});
    TradingRecipe.add("Fletcher", 5, {id: VanillaItemID.crossbow, enc: true}, {id: VanillaItemID.emerald, count: 22});
    const effects = [
        "night_vision",
        "invisibility",
        "leaping",
        "fire_resistance",
        "swiftness",
        "slowness",
        "water_breathing",
        "healing",
        "harming",
        "poison",
        "regeneration",
        "strength",
        "weakness",
        "decay"
    ];
    for(let i = 0; i < effects.length; i++){
        TradingRecipe.add("Fletcher", 5, {id: VanillaItemID.arrow, count: 5, data: BrewingRecipe.meta[effects[i].basic]}, {id: VanillaItemID.emerald, count: 2}, {id: VanillaItemID.arrow, count: 5});
    }

    TradingRecipe.add("Leatherworker", 1, VanillaItemID.emerald, {id: VanillaItemID.leather, count: 6});
    TradingRecipe.add("Leatherworker", 1, VanillaItemID.leather_leggings, {id: VanillaItemID.emerald, count: 3});
    TradingRecipe.add("Leatherworker", 1, VanillaItemID.leather_chestplate, {id: VanillaItemID.emerald, count: 7});
    TradingRecipe.add("Leatherworker", 2, VanillaItemID.emerald, {id: VanillaItemID.flint, count: 26});
    TradingRecipe.add("Leatherworker", 2, VanillaItemID.leather_helmet, {id: VanillaItemID.emerald, count: 5});
    TradingRecipe.add("Leatherworker", 2, VanillaItemID.leather_boots, {id: VanillaItemID.emerald, count: 4});
    TradingRecipe.add("Leatherworker", 3, VanillaItemID.emerald, {id: VanillaItemID.rabbit_hide, count: 9});
    TradingRecipe.add("Leatherworker", 3, VanillaItemID.leather_chestplate, {id: VanillaItemID.emerald, count: 7});
    TradingRecipe.add("Leatherworker", 4, VanillaItemID.emerald, {id: VanillaItemID.turtle_shell_piece, count: 4});
    TradingRecipe.add("Leatherworker", 4, VanillaItemID.horsearmorleather, {id: VanillaItemID.emerald, count: 6});
    TradingRecipe.add("Leatherworker", 5, VanillaItemID.leather_helmet, {id: VanillaItemID.emerald, count: 5});
    TradingRecipe.add("Leatherworker", 5, VanillaItemID.saddle, {id: VanillaItemID.emerald, count: 6});

    TradingRecipe.add("Librarian", 1, VanillaItemID.emerald, {id: VanillaItemID.paper, count: 24});
    TradingRecipe.add("Librarian", 1, VanillaBlockID.bookshelf, {id: VanillaItemID.emerald, count: 9});
    TradingRecipe.add("Librarian", 1, {id: VanillaItemID.book, enc: true}, {id: VanillaItemID.emerald, count: 64}, VanillaItemID.book);
    TradingRecipe.add("Librarian", 2, VanillaItemID.emerald, {id: VanillaItemID.book, count: 4});
    TradingRecipe.add("Librarian", 2, VanillaBlockID.lantern, VanillaItemID.emerald);
    TradingRecipe.add("Librarian", 2, {id: VanillaItemID.book, enc: true}, {id: VanillaItemID.emerald, count: 64}, VanillaItemID.book);
    TradingRecipe.add("Librarian", 3, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 5});
    TradingRecipe.add("Librarian", 3, {id: VanillaBlockID.glass, count: 4}, VanillaItemID.emerald);
    TradingRecipe.add("Librarian", 3, {id: VanillaItemID.book, enc: true}, {id: VanillaItemID.emerald, count: 64}, VanillaItemID.book);
    TradingRecipe.add("Librarian", 4, VanillaItemID.emerald, VanillaItemID.writable_book);
    TradingRecipe.add("Librarian", 4, VanillaItemID.compass, {id: VanillaItemID.emerald, count: 4});
    TradingRecipe.add("Librarian", 4, VanillaItemID.clock, {id: VanillaItemID.emerald, count: 5});
    TradingRecipe.add("Librarian", 4, {id: VanillaItemID.book, enc: true}, {id: VanillaItemID.emerald, count: 64}, VanillaItemID.book);
    TradingRecipe.add("Librarian", 5, VanillaItemID.name_tag, {id: VanillaItemID.emerald, count: 20});

    TradingRecipe.add("Mason", 1, VanillaItemID.emerald, {id: VanillaItemID.clay_ball, count: 10});
    TradingRecipe.add("Mason", 1, {id: VanillaItemID.brick, count: 10}, VanillaItemID.emerald);
    TradingRecipe.add("Mason", 2, VanillaItemID.emerald, {id: VanillaBlockID.stone, count: 20});
    TradingRecipe.add("Mason", 2, {id: VanillaBlockID.stonebrick, count: 4, data: 3}, VanillaItemID.emerald);
    TradingRecipe.add("Mason", 4, VanillaItemID.emerald, {id: VanillaItemID.quartz, count: 12});
    TradingRecipe.add("Mason", 5, VanillaBlockID.quartz_block, VanillaItemID.emerald);
    TradingRecipe.add("Mason", 5, {id: VanillaBlockID.quartz_block, data: 2}, VanillaItemID.emerald);
    for(let i = 1; i <= 5; i += 2){
        TradingRecipe.add("Mason", 3, VanillaItemID.emerald, {id: VanillaItemID.stone, count: 16, data: i});
        TradingRecipe.add("Mason", 3, {id: VanillaBlockID.stone, count: 4, data: i}, VanillaItemID.emerald);
    }
    const colors = [
        "purple",
        "white",
        "orange",
        "magenta",
        "light_blue",
        "yellow",
        "lime",
        "pink",
        "gray",
        "silver",
        "cyan",
        "blue",
        "brown",
        "green",
        "red",
        "black"
    ];
    for(let i = 0; i < 16; i++){
        TradingRecipe.add("Mason", 4, {id: VanillaBlockID.stained_hardened_clay, data: i}, VanillaItemID.emerald);
        TradingRecipe.add("Mason", 4, VanillaBlockID[colors[i] + "_glazed_terracotta"], VanillaItemID.emerald);
    }

    TradingRecipe.add("Shepherd", 1, VanillaItemID.emerald, {id: VanillaBlockID.wool, count: 18});
    TradingRecipe.add("Shepherd", 1, VanillaItemID.emerald, {id: VanillaBlockID.wool, count: 18, data: 7});
    TradingRecipe.add("Shepherd", 1, VanillaItemID.emerald, {id: VanillaBlockID.wool, count: 18, data: 12});
    TradingRecipe.add("Shepherd", 1, VanillaItemID.emerald, {id: VanillaBlockID.wool, count: 18, data: 15});
    TradingRecipe.add("Shepherd", 1, VanillaItemID.shears, {id: VanillaItemID.emerald, count: 2});
    TradingRecipe.add("Shepherd", 2, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 8});
    TradingRecipe.add("Shepherd", 2, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 10});
    TradingRecipe.add("Shepherd", 2, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 12});
    TradingRecipe.add("Shepherd", 2, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 16});
    TradingRecipe.add("Shepherd", 2, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 19});
    TradingRecipe.add("Shepherd", 3, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 1});
    TradingRecipe.add("Shepherd", 3, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 7});
    TradingRecipe.add("Shepherd", 3, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 9});
    TradingRecipe.add("Shepherd", 3, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 11});
    TradingRecipe.add("Shepherd", 3, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 14});
    TradingRecipe.add("Shepherd", 4, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 2});
    TradingRecipe.add("Shepherd", 4, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 5});
    TradingRecipe.add("Shepherd", 4, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 6});
    TradingRecipe.add("Shepherd", 4, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 13});
    TradingRecipe.add("Shepherd", 4, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 17});
    TradingRecipe.add("Shepherd", 4, VanillaItemID.emerald, {id: VanillaItemID.dye, count: 12, data: 18});
    TradingRecipe.add("Shepherd", 5, {id: VanillaItemID.painting, count: 3}, {id: VanillaItemID.emerald, count: 2});
    for(let i = 0; i < 16; i++){
        TradingRecipe.add("Shepherd", 2, {id: VanillaBlockID.wool, data: i}, VanillaItemID.emerald);
        TradingRecipe.add("Shepherd", 2, {id: VanillaBlockID.carpet, count: 4, data: i}, VanillaItemID.emerald);
        TradingRecipe.add("Shepherd", 3, {id: VanillaBlockID.bed, data: i}, {id: VanillaItemID.emerald, count: 3});
        TradingRecipe.add("Shepherd", 4, {id: VanillaItemID.banner, data: i}, {id: VanillaItemID.emerald, count: 3});
    }

    TradingRecipe.add("Toolsmith", 1, VanillaItemID.emerald, {id: VanillaItemID.coal, count: 5});
    TradingRecipe.add("Toolsmith", 1, VanillaItemID.stone_axe, VanillaItemID.emerald);
    TradingRecipe.add("Toolsmith", 1, VanillaItemID.stone_pickaxe, VanillaItemID.emerald);
    TradingRecipe.add("Toolsmith", 1, VanillaItemID.stone_shovel, VanillaItemID.emerald);
    TradingRecipe.add("Toolsmith", 1, VanillaItemID.stone_hoe, VanillaItemID.emerald);
    TradingRecipe.add("Toolsmith", 2, VanillaItemID.emerald, {id: VanillaItemID.iron_ingot, count: 4});
    TradingRecipe.add("Toolsmith", 2, VanillaBlockID.bell, {id: VanillaItemID.emerald, count: 36});
    TradingRecipe.add("Toolsmith", 3, VanillaItemID.emerald, {id: VanillaItemID.flint, count: 30});
    TradingRecipe.add("Toolsmith", 3, {id: VanillaItemID.iron_axe, enc: true}, {id: VanillaItemID.emerald, count: 20});
    TradingRecipe.add("Toolsmith", 3, {id: VanillaItemID.iron_pickaxe, enc: true}, {id: VanillaItemID.emerald, count: 21});
    TradingRecipe.add("Toolsmith", 3, {id: VanillaItemID.iron_shovel, enc: true}, {id: VanillaItemID.emerald, count: 22});
    TradingRecipe.add("Toolsmith", 3, VanillaItemID.diamond_hoe, {id: VanillaItemID.emerald, count: 4});
    TradingRecipe.add("Toolsmith", 4, VanillaItemID.emerald, VanillaItemID.diamond);
    TradingRecipe.add("Toolsmith", 4, {id: VanillaItemID.diamond_axe, enc: true}, {id: VanillaItemID.emerald, count: 31});
    TradingRecipe.add("Toolsmith", 4, {id: VanillaItemID.diamond_shovel, enc: true}, {id: VanillaItemID.emerald, count: 24});
    TradingRecipe.add("Toolsmith", 5, {id: VanillaItemID.diamond_pickaxe, enc: true}, {id: VanillaItemID.emerald, count: 32});

    TradingRecipe.add("Weaponsmith", 1, VanillaItemID.emerald, {id: VanillaItemID.coal, count: 15});
    TradingRecipe.add("Weaponsmith", 1, VanillaItemID.iron_axe, {id: VanillaItemID.emerald, count: 3});
    TradingRecipe.add("Weaponsmith", 2, VanillaItemID.emerald, {id: VanillaItemID.iron_ingot, count: 4});
    TradingRecipe.add("Weaponsmith", 2, {id: VanillaItemID.iron_sword, enc: true}, {id: VanillaItemID.emerald, count: 21});
    TradingRecipe.add("Weaponsmith", 3, VanillaItemID.emerald, {id: VanillaItemID.flint, count: 24});
    TradingRecipe.add("Weaponsmith", 3, VanillaBlockID.bell, {id: VanillaItemID.emerald, count: 36});
    TradingRecipe.add("Weaponsmith", 4, VanillaItemID.emerald, VanillaItemID.diamond);
    TradingRecipe.add("Weaponsmith", 4, {id: VanillaItemID.diamond_axe, enc: true}, {id: VanillaItemID.emerald, count: 31});
    TradingRecipe.add("Weaponsmith", 5, {id: VanillaItemID.diamond_sword, enc: true}, {id: VanillaItemID.emerald, count: 27});

    TradingRecipe.addWandering(1, {id: VanillaBlockID.grass, data: 2});
    TradingRecipe.addWandering(1, VanillaBlockID.vine);
    TradingRecipe.addWandering(1, VanillaBlockID.yellow_flower);
    for(let i = 0; i < 11; i++){
        TradingRecipe.addWandering(1, {id: VanillaBlockID.red_flower, data: i});
    }
    TradingRecipe.addWandering(1, {id: VanillaBlockID.double_plant, data: 0});
    TradingRecipe.addWandering(1, {id: VanillaBlockID.double_plant, data: 1});
    TradingRecipe.addWandering(1, {id: VanillaBlockID.double_plant, data: 4});
    TradingRecipe.addWandering(1, {id: VanillaBlockID.double_plant, data: 5});
    TradingRecipe.addWandering(1, VanillaItemID.wheat_seeds);
    TradingRecipe.addWandering(1, VanillaItemID.beetroot_seeds);
    TradingRecipe.addWandering(1, VanillaItemID.pumpkin_seeds);
    TradingRecipe.addWandering(1, VanillaItemID.melon_seeds);
    for(let i = 0; i < 16; i++){
        TradingRecipe.addWandering(1, {id: VanillaItemID.dye, count: 3, data: i});
    }
    TradingRecipe.addWandering(1, VanillaBlockID.brown_mushroom);
    TradingRecipe.addWandering(1, VanillaBlockID.red_mushroom);
    TradingRecipe.addWandering(1, VanillaBlockID.reeds);
    TradingRecipe.addWandering(1, {id: VanillaBlockID.sand, count: 8});
    TradingRecipe.addWandering(1, {id: VanillaBlockID.sand, count: 4, data: 1});
    TradingRecipe.addWandering(1, {id: VanillaBlockID.waterlily, count: 2});
    TradingRecipe.addWandering(1, VanillaBlockID.pumpkin);
    TradingRecipe.addWandering(2, VanillaBlockID.sea_pickle);
    TradingRecipe.addWandering(2, VanillaItemID.glowstone_dust);
    TradingRecipe.addWandering(3, VanillaBlockID.kelp);
    TradingRecipe.addWandering(3, VanillaBlockID.cactus);
    for(let i = 0; i < 5; i++){
        TradingRecipe.addWandering(3, {id: VanillaBlockID.coral_block, data: i});
    }
    TradingRecipe.addWandering(4, VanillaItemID.slime_ball);
    for(let i = 0; i < 6; i++){
        TradingRecipe.addWandering(5, {id: VanillaBlockID.sapling, data: i});
    }
    TradingRecipe.addWandering(5, VanillaItemID.nautilus_shell);

    TradingRecipe.addWandering(1, VanillaItemID.gunpowder);
    TradingRecipe.addWandering(3, {id: VanillaBlockID.podzol, count: 3});
    TradingRecipe.addWandering(3, VanillaBlockID.packed_ice);
    TradingRecipe.addWandering(5, {id: VanillaItemID.bucket, data: 4});
    TradingRecipe.addWandering(5, {id: VanillaItemID.bucket, data: 5});
    TradingRecipe.addWandering(6, VanillaBlockID.blue_ice);

})();


RecipeViewer.registerRecipeType("trading", {
    title: "Villager Trading",
    contents: {
        icon: VanillaItemID.emerald,
        description: "trade",
        drawing: [
            {type: "bitmap", x: 506, y: 199, scale: 6, bitmap: "bar_trading"}
        ],
        elements: {
            input0: {x: 250, y: 190, size: 120},
            input1: {x: 370, y: 190, size: 120},
            output0: {x: 630, y: 190, size: 120},
            text1: {type: "text", x: 500, y: 330, font: {size: 40, color: Color.WHITE, shadow: 0.5, alignment: 1}},
            text2: {type: "text", x: 630, y: 140, font: {size: 30, color: Color.GREEN, shadow: 0.5}}
        }
    },
    recipeList: TradingRecipe.recipes,
    onOpen: function(elements, recipe){
        elements.get("text1").onBindingUpdated("text", recipe.level ? "Level " + recipe.level + "  -  " + recipe.job : recipe.job);
        elements.get("text2").onBindingUpdated("text", recipe.isEnchanted ? "Enchanted" : "");
    }
});

RecipeViewer.putButtonOnNativeGui("trade_screen", "trading");