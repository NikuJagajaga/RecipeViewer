const StonecutterRecipe = {

    recipes: [],

    addFromJSON: function(obj){
        if(!obj.ingredients || obj.ingredients.length !== 1 || !obj.result){
            return;
        }
        const input = {
            id: getNumericID(obj.ingredients[0].item),
            count: obj.ingredients[0].count || 1,
            data: obj.ingredients[0].data || 0
        };
        const output = {
            id: getNumericID(obj.result.item),
            count: obj.result.count || 1,
            data: obj.result.data || 0
        };
        const find = this.recipes.find(function(recipe){
            const item = recipe.input[0];
            return item.id === input.id && item.count === input.count && item.data === input.data;
        });
        find ? find.output.push(output) : this.recipes.push({input: [input], output: [output]});
    }

};


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