class StonecutterRecipe extends RecipeType {

    private static recipeList: RecipePattern[] = [];

    static registerRecipe(input: {item: string, count?: number, data?: number}, output: {item: string, count?: number, data?: number}): void {
        const inputItem = {
            id: BehaviorTools.getNumericID(input.item),
            count: input.count || 1,
            data: input.data || 0
        };
        const outputItem = {
            id: BehaviorTools.getNumericID(output.item),
            count: output.count || 1,
            data: output.data || 0
        };
        const find = this.recipeList.find(function(recipe){
            const item = recipe.input[0];
            return item.id === inputItem.id && item.count === inputItem.count && item.data === inputItem.data;
        });
        find ? find.output.push(outputItem) : this.recipeList.push({input: [inputItem], output: [outputItem]});
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