const BlastFurnaceRecipe = {

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


RecipeViewer.registerRecipeType("blast_furnace", {
    title: "Blast Furnece",
    contents: {
        icon: VanillaBlockID.blast_furnace,
        drawing: [
            {type: "bitmap", x: 440, y: 185, scale: 2, bitmap: "_workbench_bar"}
        ],
        elements: {
            input0: {x: 280, y: 190, size: 120},
            output0: {x: 600, y: 190, size: 120}
        }
    },
    recipeList: BlastFurnaceRecipe.recipes
});


RecipeViewer.putButtonOnNativeGui("blast_furnace_screen", "blast_furnace");