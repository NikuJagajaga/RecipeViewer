class StonecutterRecipe extends RecipeType {

    private static recipeList: RecipePattern[] = [];

    static registerRecipe(input: ItemInstance, output: ItemInstance): void {
        const find = this.recipeList.find(function(recipe){
            const item = recipe.input[0];
            return item.id === input.id && item.count === input.count && item.data === input.data;
        });
        find ? find.output.push(output) : this.recipeList.push({input: [input], output: [output]});
    }

    constructor(){
        super("Stonecutter", VanillaBlockID.stonecutter_block, {
            drawing: [
                {type: "bitmap", x: 455, y: 130, scale: 6, bitmap: "rv.bar_stonecutter"}
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
        });
    }

    getAllList(): RecipePattern[] {
        return StonecutterRecipe.recipeList;
    }

}


RecipeTypeRegistry.register("stonecutter", new StonecutterRecipe());
RButton.putOnNativeGui("stonecutter_screen", "stonecutter");