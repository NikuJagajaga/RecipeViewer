class RecipeTypeRegistry {

    private static readonly types: {[key: string]: RecipeType} = {};

    static register(key: string, recipeType: RecipeType): void {
        this.types[key] = recipeType;
    }

    static get(key: string): RecipeType {
        return this.types[key];
    }

    static isExist(key: string): boolean {
        return key in this.types;
    }

    static delete(key: string): void {
        delete this.types[key];
    }

    static getAllKeys(): string[] {
        return Object.keys(this.types);
    }

    static getLength(): number {
        return this.getAllKeys().length;
    }

    static getActiveType(id: number, data: number, isUsage: boolean): string[] {
        const array: string[] = [];
        for(let key in this.types){
            try{
                this.types[key].hasAnyRecipe(id, data, isUsage) && array.push(key);
            }
            catch(e){
                alert('[RV] RecipeType "' + key + '" has been deleted.\n' + e);
                delete this.types[key];
            }
        }
        return array;
    }

    static getActiveTypeByLiquid(liquid: string, isUsage: boolean): string[] {
        const array: string[] = [];
        for(let key in this.types){
            try{
                this.types[key].hasAnyRecipeByLiquid(liquid, isUsage) && array.push(key);
            }
            catch(e){
                alert('[RV] RecipeType "' + key + '" has been deleted.\n' + e);
                delete this.types[key];
            }
        }
        return array;
    }

    static openRecipePage(recipeKey: string | string[]): void {
        SubUI.openListView(typeof recipeKey === "string" ? [recipeKey] : recipeKey);
    }

    static openRecipePageByItem(id: number, data: number, isUsage: boolean): boolean {
        return SubUI.openItemView(id, data, isUsage);
    }

    static openRecipePageByLiquid(liquid: string, isUsage: boolean): boolean {
        return SubUI.openLiquidView(liquid, isUsage);
    }

    static getLiquidByTex(texture: string): string {
        for(let key in LiquidRegistry.liquids){
            if(LiquidRegistry.liquids[key].uiTextures.some(tex => {
                return tex === texture;
            })){
                return key;
            }
        }
        return "";
    }

}