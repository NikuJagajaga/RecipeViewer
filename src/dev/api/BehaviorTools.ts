class BehaviorTools {

    static readJson(path: string): any {
        const reader = new java.io.BufferedReader(new java.io.FileReader(path));
        const lines: string[] = [];
        let str: string;
        let i: number;
        while(str = reader.readLine()){
            //str.trim().startsWith("//") || lines.push(str);
            i = str.indexOf("//");
            lines.push(i === -1 ? str : str.slice(0, i));
        }
        reader.close();
        try{
            return JSON.parse(lines.join("\n")) || null;
        }
        catch(e){
            return null;
        }
    }

    static readListOfJson(path: string): any[] {
        const dir = new java.io.File(path);
        const files = dir.listFiles();
        const list = [];
        let json: any;
        for(let i = 0; i < files.length; i++){
            if(!files[i].isDirectory() && files[i].getName().endsWith(".json")){
                json = this.readJson(files[i].getAbsolutePath());
                json && list.push(json);
            }
        }
        return list;
    }

    static getNumericID(key: string): number {
        if(!key.startsWith("minecraft:")){
            return 0;
        }
        const key2 = key.substr(10);
        const array = key2.split("_");
        const slice = array.slice(1);
        let id: number;
        if(array[0] === "block"){
            id = BlockID[slice.join("_")];
            if(id){
                return id;
            }
            let key3 = slice[0];
            for(let i = 1; i < slice.length; i++){
                key3 += slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
            }
            id = BlockID[key3];
            if(id){
                return id;
            }
        }
        if(array[0] === "item"){
            id = ItemID[array.slice(1).join("_")];
            if(id){
                return id;
            }
            let key3 = slice[0];
            for(let i = 1; i < slice.length; i++){
                key3 += slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
            }
            id = ItemID[key3];
            if(id){
                return id;
            }
        }
        return VanillaBlockID[key2] || VanillaItemID[key2] || 0;
    }

    static convertToItem(str: string): Tile {
        const split = str.split(":");
        if(split.length >= 2 && split[0] === "minecraft"){
            const key = split[1].toLowerCase();
            const id: number = VanillaBlockID[key] || VanillaItemID[key];
            if(id){
                return {id: id, data: +split[2] || -1};
            }
        }
        return null;
    }

    private static potionMeta = {

    } as const;

    static convertToItemForPotion(str: string): Tile {
        const suffix = "minecraft:potion_type:";
        if(str.startsWith(suffix)){

        }

        const split = str.split(":");
        if(split.length >= 2 && split[0] === "minecraft"){
            const key = split[1].toLowerCase();
            const id: number = VanillaBlockID[key] || VanillaItemID[key];
            const data: number = this.potionMeta[split[2]];
            if(id){
                return {id: id, data: +split[2] || -1};
            }
        }
        return null;
    }

}


interface RecipeJsonOld {
    type: "crafting_shaped" | "crafting_shapeless" | "furnace_recipe";
    tags: ("crafting_table" | "furnace" | "blast_furnace" | "smoker" | "campfire" | "stonecutter")[];
    key?: {[key: string]: {item: string, data?: number}};
    ingredients?: {item: string, count?: number, data?: number}[];
    result?: {item: string, count?: number, data?: number};
    input?: string;
    output?: string;
}

interface RecipeJson {
    format_version: string;
    "minecraft:recipe_shaped"?: {
        description: {
            identifier: string;
        };
        tags: ["crafting_table"];
        pattern: string[];
        key: {[key: string]: {item: string, data?: number}};
        result: {item: string, count?: number, data?: number};
    };
    "minecraft:recipe_shapeless"?: {
        description: {
            identifier: string;
        };
        tags: ("crafting_table" | "stonecutter")[];
        priority: number;
        ingredients: {item: string, count?: number, data?: number}[];
        result: {item: string, count?: number, data?: number};
    };
    "minecraft:recipe_furnace"?: {
        description: {
            identifier: string;
        };
        tags: ("furnace" | "blast_furnace" | "smoker" | "campfire")[];
        input: string;
        output: string;
    };
    "minecraft:recipe_brewing_mix"?: {
        description: {
            identifier: string;
        };
        tags: ["brewing_stand"];
        input: string;
        reagent: string;
        output: string;
    };
}