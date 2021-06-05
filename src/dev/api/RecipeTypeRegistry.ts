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

    static getLength(): number {
        return Object.keys(this.types).length;
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

    static openRecipePage (key: string): void {
        SubUI.openWindow(key);
    }

}