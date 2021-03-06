class LikeFurnaceRecipe extends RecipeType {

    private recipeList: RecipePattern[];

    constructor(name: string, icon: Tile | number){
        super(name, icon, {
            drawing: [
                {type: "bitmap", x: 440, y: 185, scale: 2, bitmap: "_workbench_bar"}
            ],
            elements: {
                input0: {x: 280, y: 190, size: 120},
                output0: {x: 600, y: 190, size: 120}
            }
        });
        this.recipeList = [];
    }

    registerRecipe(input: string, output: string): void {
        const inputItem = BehaviorTools.convertToItem(input);
        const outputItem = BehaviorTools.convertToItem(output);
        inputItem && outputItem && this.recipeList.push({
            input: [{id: inputItem.id, count: 1, data: inputItem.data}],
            output: [{id: outputItem.id, count: 1, data: outputItem.data}]
        });
    }

    getAllList(): RecipePattern[] {
        return this.recipeList;
    }

}


const BlastFurnaceRecipe = new LikeFurnaceRecipe("Blast Furnece", VanillaBlockID.blast_furnace);
const SmokerRecipe = new LikeFurnaceRecipe("Smoker", VanillaBlockID.smoker);
const CampfireRecipe = new LikeFurnaceRecipe("Campfire", VanillaBlockID.campfire);

RecipeTypeRegistry.register("blast_furnace", BlastFurnaceRecipe);
RecipeTypeRegistry.register("smoker", SmokerRecipe);
RecipeTypeRegistry.register("campfire", CampfireRecipe);

RButton.putOnNativeGui("blast_furnace_screen", "blast_furnace");
RButton.putOnNativeGui("smoker_screen", "smoker");