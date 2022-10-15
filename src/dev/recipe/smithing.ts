class SmithingRecipe extends RecipeType {

    private static recipeList: RecipePattern[] = [
        {input: [{id: VanillaItemID.diamond_sword, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 727, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_shovel, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 726, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_pickaxe, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 804, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_axe, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 835, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_hoe, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 880, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_helmet, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 764, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_chestplate, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 834, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_leggings, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 725, count: 1, data: -1}]},
        {input: [{id: VanillaItemID.diamond_boots, count: 1, data: -1}, {id: 728, count: 1, data: -1}], output: [{id: 813, count: 1, data: -1}]}
    ];

    static overrideList(recipeList: RecipePattern[]): void {
        this.recipeList = recipeList;
    }

    constructor(){
        const top = 100;
        super("Smithing", VanillaBlockID.smithing_table, {
            drawing: [
                {type: "bitmap", x: 281, y: 21 + top, scale: 6, bitmap: "rv.plus"},
                {type: "bitmap", x: 614, y: 15 + top, scale: 6, bitmap: "rv.arrow_right"}
            ],
            elements: {
                input0: {x: 80, y: top, size: 120},
                input1: {x: 440, y: top, size: 120},
                output0: {x: 800, y: top, size: 120}
            }
        });
        this.setGridView(2, 1, true);
    }

    getAllList(): RecipePattern[] {
        return SmithingRecipe.recipeList;
    }

}