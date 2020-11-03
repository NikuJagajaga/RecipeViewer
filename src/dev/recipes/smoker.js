const SmokerRecipe = {

    recipes: [],

    addFromJSON: function(obj){
        const input = getNumericID(obj.input);
        const output = getNumericID(obj.output);
        input && output && this.recipes.push({
            input: [{id: input, count: 1, data: 0}],
            output: [{id: output, count: 1, data: 0}]
        });
    }

};


RecipeViewer.registerRecipeType("smoker", {
    title: "Smoker",
    contents: {
        icon: VanillaBlockID.smoker,
        drawing: [
            {type: "bitmap", x: 440, y: 185, scale: 2, bitmap: "_workbench_bar"}
        ],
        elements: {
            input0: {x: 280, y: 190, size: 120},
            output0: {x: 600, y: 190, size: 120}
        }
    },
    recipeList: SmokerRecipe.recipes
});


RecipeViewer.putButtonOnNativeGui("smoker_screen", "smoker");