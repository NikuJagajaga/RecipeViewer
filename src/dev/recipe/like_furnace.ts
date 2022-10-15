class LikeFurnaceRecipe extends RecipeType {

    private recipeList: RecipePattern[];

    constructor(name: string, icon: Tile | number){
        const top = 40;
        super(name, icon, {
            drawing: [
                {type: "bitmap", x: 500 - 66, y: 15 + top, scale: 6, bitmap: "rv.arrow_right"}
            ],
            elements: {
                input0: {x: 500 - 66 - 180, y: top, size: 120},
                output0: {x: 500 + 66 + 60, y: top, size: 120}
            }
        });
        this.setGridView(3, 1, true);
        this.recipeList = [];
    }

    registerRecipe(input: Tile, output: Tile): void {
        this.recipeList.push({
            input: [{id: input.id, count: 1, data: input.data}],
            output: [{id: output.id, count: 1, data: output.data}]
        });
    }

    getAllList(): RecipePattern[] {
        return this.recipeList;
    }

}


const BlastFurnaceRecipe = new LikeFurnaceRecipe("Blast Furnece", VanillaBlockID.blast_furnace);
const SmokerRecipe = new LikeFurnaceRecipe("Smoker", VanillaBlockID.smoker);
const CampfireRecipe = new LikeFurnaceRecipe("Campfire", VanillaBlockID.campfire);