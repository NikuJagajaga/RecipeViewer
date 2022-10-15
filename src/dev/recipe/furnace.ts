class FurnaceRecipe extends RecipeType {

    constructor(){
        const top = 40;
        super("Smelting", VanillaBlockID.furnace, {
            drawing: [
                {type: "bitmap", x: 500 - 66, y: 15 + top, scale: 6, bitmap: "rv.arrow_right"}
            ],
            elements: {
                input0: {x: 500 - 66 - 180, y: top, size: 120},
                output0: {x: 500 + 66 + 60, y: top, size: 120}
            }
        });
        this.setGridView(3, 1, true);
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
                {type: "bitmap", x: 500 - 104, y: 300 - 240, scale: 16, bitmap: "rv.furnace_burn"}
            ],
            elements: {
                input0: {x: 500 - 120, y: 300, size: 240},
                text: {type: "text", x: 500, y: 600, multiline: true, font: {size: 80, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}}
            }
        });
        this.setGridView(2, 3, true);
        this.setDescription("Fuel");
    }

    getAllList(): RecipePattern[] {
        return ItemList.get()
            .filter(item => Recipes.getFuelBurnDuration(item.id, item.data) > 0)
            .sort((a, b) => Recipes.getFuelBurnDuration(b.id, b.data) - Recipes.getFuelBurnDuration(a.id, a.data))
            .map(item => ({input: [{id: item.id, count: 1, data: item.data}]}));
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