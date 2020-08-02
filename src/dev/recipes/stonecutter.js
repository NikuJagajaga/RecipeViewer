const StonecutterRecipe = {

    recipes: [],

    slabs: {
        44: true,
        182: true,
        417: true,
        421: true
    },

    isSlab: function(id){
        return this.slabs[id] || false;
    },

    add: function(id, data, result){
        this.recipes.push({
            input: [{id: Block.convertBlockToItemId(id), count: 1, data: data}],
            output: result.map(function(item){
                return {id: Block.convertBlockToItemId(item.id), count: StonecutterRecipe.isSlab(item.id) ? 2 : 1, data: item.data || 0};
            })
        });
    }

};



StonecutterRecipe.add(1, 0, [
    {id: 98, data: 3},
    {id: 44, data: 5},
    {id: 109},
    {id: 139, data: 7},
    {id: 98, data: 0},
    {id: 421, data: 2},
    {id: 435, data: 0}
]);

StonecutterRecipe.add(438, 0, [
    {id: 44, count: 2}
]);

StonecutterRecipe.add(98, 0, [
    {id: 44, data: 5},
    {id: 109},
    {id: 139, data: 7}
]);

StonecutterRecipe.add(98, 1, [
    {id: 421},
    {id: 430},
    {id: 139, data: 8}
]);

StonecutterRecipe.add(1, 1, [
    {id: 417, data: 6},
    {id: 424},
    {id: 139, data: 2},
    {id: 1, data: 2},
    {id: 417, data: 7},
    {id: 427}
]);

StonecutterRecipe.add(1, 2, [
    {id: 417, data: 7},
    {id: 427}
]);

StonecutterRecipe.add(1, 3, [
    {id: 417, data: 4},
    {id: 425},
    {id: 139, data: 3},
    {id: 1, data: 4},
    {id: 417, data: 5},
    {id: 428}
]);

StonecutterRecipe.add(1, 4, [
    {id: 417, data: 5},
    {id: 428}
]);

StonecutterRecipe.add(1, 5, [
    {id: 417, data: 3},
    {id: 426},
    {id: 139, data: 4},
    {id: 1, data: 6},
    {id: 417, data: 2},
    {id: 429}
]);

StonecutterRecipe.add(1, 6, [
    {id: 417, data: 2},
    {id: 429}
]);

StonecutterRecipe.add(4, 0, [
    {id: 44, data: 3},
    {id: 67},
    {id: 139}
]);

StonecutterRecipe.add(48, 0, [
    {id: 182, data: 5},
    {id: 434},
    {id: 139, data: 1}
]);

StonecutterRecipe.add(24, 0, [
    {id: 24, data: 1},
    {id: 24, data: 2},
    {id: 44, data: 1},
    {id: 128},
    {id: 139, data: 5}
]);

StonecutterRecipe.add(24, 3, [
    {id: 182, data: 6},
    {id: 432}
]);

StonecutterRecipe.add(179, 0, [
    {id: 179, data: 1},
    {id: 179, data: 2},
    {id: 182},
    {id: 180},
    {id: 139, data: 12}
]);

StonecutterRecipe.add(179, 3, [
    {id: 417, data: 1},
    {id: 431}
]);

StonecutterRecipe.add(168, 0, [
    {id: 182, data: 2},
    {id: 257},
    {id: 139, data: 11}
]);

StonecutterRecipe.add(168, 2, [
    {id: 182, data: 4},
    {id: 259}
]);

StonecutterRecipe.add(168, 1, [
    {id: 182, data: 3},
    {id: 258}
]);

StonecutterRecipe.add(155, 0, [
    {id: 155, data: 1},
    {id: 155, data: 2},
    {id: 421, data: 1},
    {id: 156}
]);

StonecutterRecipe.add(155, 3, [
    {id: 421, data: 1},
    {id: 440}
]);

StonecutterRecipe.add(201, 0, [
    {id: 201, data: 2},
    {id: 182, data: 1},
    {id: 203}
]);

StonecutterRecipe.add(45, 0, [
    {id: 44, data: 4},
    {id: 108},
    {id: 139, data: 6}
]);

StonecutterRecipe.add(112, 0, [
    {id: 44, data: 7},
    {id: 114},
    {id: 139, data: 9}
]);

StonecutterRecipe.add(215, 0, [
    {id: 182, data: 7},
    {id: 439},
    {id: 139, data: 13}
]);

StonecutterRecipe.add(121, 0, [
    {id: 417},
    {id: 433},
    {id: 139, data: 10},
    {id: 206}
]);

StonecutterRecipe.add(206, 0, [
    {id: 417},
    {id: 433},
    {id: 139, data: 10}
]);


RecipeViewer.registerRecipeType("stonecutter", {
    title: "Stonecutter",
    contents: {
        icon: VanillaBlockID.stonecutter_block,
        drawing: [
            {type: "bitmap", x: 455, y: 130, scale: 6, bitmap: "bar_stonecutter"}
        ],
        elements: {
            input0: {x: 440, y: 0, size: 120},
            output0: {x: 260, y: 270, size: 120},
            output1: {x: 380, y: 270, size: 120},
            output2: {x: 500, y: 270, size: 120},
            output3: {x: 620, y: 270, size: 120},
            output4: {x: 260, y: 390, size: 120},
            output5: {x: 380, y: 390, size: 120},
            output6: {x: 500, y: 390, size: 120},
            output7: {x: 620, y: 390, size: 120}
        }
    },
    recipeList: StonecutterRecipe.recipes
});

RecipeViewer.putButtonOnNativeGui("stonecutter_screen", "stonecutter");