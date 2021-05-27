interface OldRecipeContents {
    icon: Tile | number;
    description?: string;
    params?: UI.BindingsSet;
    drawing?: UI.DrawingElement[];
    elements: {[key: string]: Partial<UI.UIElement>};
}

interface OldRecipeTypeProperty {
    title?: string;
    contents: OldRecipeContents;
    recipeList?: RecipePattern[];
    getList?: (id: number, data: number, isUsage: boolean) => RecipePattern[];
    getAllList?: () => RecipePattern[];
    onOpen?: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern) => void;
}


class OldRecipeType extends RecipeType {

    private readonly recipeList: RecipePattern[];
    private readonly funcs: {
        getList: (id: number, data: number, isUsage: boolean) => RecipePattern[],
        getAllList: () => RecipePattern[],
        onOpen: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern) => void
    };

    constructor(obj: OldRecipeTypeProperty){

        super(obj.title || "", obj.contents.icon, {
            params: obj.contents.params,
            drawing: obj.contents.drawing,
            elements: obj.contents.elements,
        });

        this.recipeList = obj.recipeList || undefined;

        this.funcs = {
            getList: obj.getList,
            getAllList: obj.getAllList,
            onOpen: obj.onOpen
        };

    }

    getAllList(): RecipePattern[] {
        if(this.recipeList){
            return this.recipeList;
        }
        if(this.funcs.getAllList){
            return this.funcs.getAllList();
        }
        return [];
    }

    getList(id: number, data: number, isUsage: boolean): RecipePattern[] {
        if(this.funcs.getList){
            return this.funcs.getList(id, data, isUsage);
        }
        return super.getList(id, data, isUsage);
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
        this.funcs.onOpen && this.funcs.onOpen(elements, recipe);
    }

}


interface RecipeTE {
    type: "grid" | "line" | "not_shape";
    recipe: any;/*string[] | string[][];*/
    ingridients: {[char: string]: ItemInstance};
    result: ItemInstance;
}


class OldVersion {

    static registerRecipeType(key: string, obj: OldRecipeTypeProperty): void {
        RecipeTypeRegistry.register(key, new OldRecipeType(obj));
    }

    static getIOFromTEWorkbench(recipe: RecipeTE, cols: number): RecipePattern {
        const array: ItemInstance[] = [];
        let item: ItemInstance;
        switch(recipe.type){
            case "grid":
                for(let i = 0; i < recipe.recipe.length; i++){
                    for(let j = 0; j < recipe.recipe[i].length; j++){
                        item = recipe.ingridients[recipe.recipe[i][j]];
                        if(item){
                            array[i * cols + j] = {id: item.id, count: 1, data: item.data || 0};
                        }
                    }
                }
            break;
            case "line":
                for(let i = 0; i < recipe.recipe.length; i++){
                    item = recipe.ingridients[recipe.recipe[i]];
                    if(item){
                        array[i] = {id: item.id, count: 1, data: item.data || 0};
                    }
                }
            break;
            case "not_shape":
                for(let key in recipe.ingridients){
                    item = recipe.ingridients[key];
                    for(let i = 0; i < item.count; i++){
                        array.push({id: item.id, count: 1, data: item.data || 0});
                    }
                }
            break;
        }
        return {input: array, output: [recipe.result]};
    }

    static registerTEWorkbenchRecipeType(sid: string, contents: OldRecipeContents, recipes: RecipeTE[]): void {
        const tile = TileEntity.getPrototype(BlockID[sid]);
        const cols: number = tile.Columns || tile.columns || tile.Cols || tile.cols || tile.Slots || tile.slots;
        const rows: number = tile.Rows || tile.rows;
        contents.icon = BlockID[sid];
        this.registerRecipeType("TE_" + sid, {
            title: "",
            contents: contents,
            getList: (id, data, isUsage) => {
                const list = [];
                if(isUsage){
                    let key = "";
                    for(let i = 0; i < recipes.length; i++){
                        for(key in recipes[i].ingridients){
                            if(recipes[i].ingridients[key].id === id && (data === -1 || !recipes[i].ingridients[key].data || (recipes[i].ingridients[key].data || 0) === data)){
                                list.push(this.getIOFromTEWorkbench(recipes[i], cols));
                                break;
                            }
                        }
                    }
                }
                else{
                    for(let i = 0; i < recipes.length; i++){
                        recipes[i].result.id === id && (data === -1 || recipes[i].result.data === data) && list.push(this.getIOFromTEWorkbench(recipes[i], cols));
                    }
                }
                return list;
            }
        });
    }

    static removeDuplicate = removeDuplicateFilterFunc;

    static getName(id: number, data?: number): string {
        return ItemList.getName(id, data);
    }

    static addList(id: number, data: number, type?: "block" | "item"): void {
        ItemList.addToList(id, data, type);
    };

    static addListByData(id: number, data: number, type?: "block" | "item"): void {
        ItemList.addToListByData(id, data, type);
    }

    static openRecipePage(key: string, container: UI.Container): void {
        RecipeTypeRegistry.openRecipePage(key);
    }

    static putButtonOnNativeGui(screen: string, key: string): void {
        RButton.putOnNativeGui(screen, key);
    }


}