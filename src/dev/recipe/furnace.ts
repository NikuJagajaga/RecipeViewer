class FurnaceRecipe extends RecipeType {

    constructor(){
        super("Smelting", VanillaBlockID.furnace, {
            drawing: [
                {type: "bitmap", x: 440, y: 185, scale: 2, bitmap: "_workbench_bar"}
            ],
            elements: {
                input0: {x: 280, y: 190, size: 120},
                output0: {x: 600, y: 190, size: 120}
            }
        });
    }

    getAllList(): RecipePattern[] {
        const list: RecipePattern[] = [];
            const recipe = Recipes.getFurnaceRecipesByResult();
            const iterator = recipe.iterator();
            let entry: Recipes.FurnaceRecipe;
            while(iterator.hasNext()){
                entry = iterator.next();
                list.push({
                    input: [{id: entry.inId, count: 1, data: entry.inData}],
                    output: [entry.getResult()]
                });
            }
            return list;
    }

}


class FurnaceFuelRecipe extends RecipeType {

    constructor(){
        super("Furnace Fuel", VanillaBlockID.furnace, {
            drawing: [
                {type: "bitmap", x: 290, y: 140, scale: 8, bitmap: "rv.furnace_burn"}
            ],
            elements: {
                input0: {x: 280, y: 260, size: 120},
                text: {type: "text", x: 450, y: 220, multiline: true, font: {size: 40, color: Color.WHITE, shadow: 0.5}}
            }
        });
        this.setDescription("Fuel");
    }

    getAllList(): RecipePattern[] {
        return ItemList.get().filter(item => Recipes.getFuelBurnDuration(item.id, item.data) > 0).map(item => ({input: [{id: item.id, count: 1, data: item.data}]}));
    }

    getList(id: number, data: number, isUsage: boolean): RecipePattern[] {
        return isUsage && Recipes.getFuelBurnDuration(id, data) > 0 ? [{input: [{id: id, count: 1, data: data}]}] : [];
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
        const item = recipe.input[0];
        const time = Recipes.getFuelBurnDuration(item.id, item.data);
        elements.get("text").setBinding("text", time + " tick\n(Smelts  " + ((time / 20 | 0) / 10) + "  items)");
    }

}

RecipeTypeRegistry.register("furnace", new FurnaceRecipe());
RecipeTypeRegistry.register("fuel", new FurnaceFuelRecipe());
RButton.putOnNativeGui("furnace_screen", ["furnace", "fuel"]);