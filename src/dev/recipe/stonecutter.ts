class StonecutterRecipe extends RecipeType {

    private static recipeList: RecipePattern[] = [];

    static registerRecipe(input: ItemInstance, output: ItemInstance): void {
        /*
        const find = this.recipeList.find(function(recipe){
            const item = recipe.input[0];
            return item.id === input.id && item.count === input.count && item.data === input.data;
        });
        find ? find.output.push(output) : this.recipeList.push({input: [input], output: [output]});
        */
       this.recipeList.push({input: [input], output: [output]});
    }

    constructor(){
        super("Stonecutter", VanillaBlockID.stonecutter_block, {
            drawing: [
                {type: "bitmap", x: 320, y: 520 + 400, scale: 24, bitmap: "rv.arrow_down"}
            ],
            elements: {
                input0: {x: 260, y: 400, size: 480},
                output0: {x: 260, y: 1088 + 400, size: 480}
            }
        });
        this.setGridView(1, 4, true);
    }

    getAllList(): RecipePattern[] {
        return StonecutterRecipe.recipeList;
    }

}