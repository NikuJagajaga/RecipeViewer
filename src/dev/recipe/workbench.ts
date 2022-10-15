class WorkbenchRecipe extends RecipeType {

    constructor(){
        super("Crafting", VanillaBlockID.crafting_table, {
            drawing: [
                {type: "bitmap", x: 530, y: 185, scale: 2, bitmap: "_workbench_bar"}
            ],
            elements: {
                input0: {x: 200, y: 100, size: 100},
                input1: {x: 300, y: 100, size: 100},
                input2: {x: 400, y: 100, size: 100},
                input3: {x: 200, y: 200, size: 100},
                input4: {x: 300, y: 200, size: 100},
                input5: {x: 400, y: 200, size: 100},
                input6: {x: 200, y: 300, size: 100},
                input7: {x: 300, y: 300, size: 100},
                input8: {x: 400, y: 300, size: 100},
                output0: {x: 680, y: 190, size: 120},
                shapelessIcon: {type: "image", x: 740, y: 130, scale: 1.5, bitmap: "rv.shapeless_icon"}
            }
        });
    }

    convertToJSArray(set: java.util.Collection<Recipes.WorkbenchRecipe>): RecipePattern[] {
        const list: RecipePattern[] = [];
        const masks: {[mask: string]: true} = {};
        const iterator = set.iterator();
        let entry: Recipes.WorkbenchRecipe;
        let mask: string;
        let field: native.Array<Recipes.RecipeEntry>;
        let input: ItemInstance[];
        let i = 0;
        while(iterator.hasNext()){
            entry = iterator.next();
            mask = entry.getRecipeMask();
            if(mask in masks){
                continue;
            }
            masks[mask] = true;
            field = entry.getSortedEntries();
            input = [];
            for(i = 0; i < 9; i++){
                if(!field[i]){
                    break;
                }
                input[i] = {id: field[i].id, count: 1, data: field[i].data};
            }
            list.push({input: input, output: [entry.getResult()], isShapeless: mask.startsWith("$$")});
        }
        return list;
    }

    getAllList(): RecipePattern[] {
        const recipes: java.util.Collection<Recipes.WorkbenchRecipe> = new java.util.HashSet();
        ItemList.get().forEach(item => {
            recipes.addAll(Recipes.getWorkbenchRecipesByResult(item.id, -1, -1));
        });
        return this.convertToJSArray(recipes);
    }

    getList(id: number, data: number, isUsage: boolean): RecipePattern[] {
        const data2 = Item.getMaxDamage(id) ? -1 : data;
        return this.convertToJSArray(isUsage ? Recipes.getWorkbenchRecipesByIngredient(id, data2) : Recipes.getWorkbenchRecipesByResult(id, -1, data2));
    }

    hasAnyRecipe(id: number, data: number, isUsage: boolean): boolean {
        return this.getList(id, Item.getMaxDamage(id) ? -1 : data, isUsage).length > 0;
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
        elements.get("shapelessIcon").setPosition(740, recipe.isShapeless ? 130 : 1000);
    }

}