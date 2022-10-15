declare namespace BehaviorJsonReader {
    function readJson(path: string): any;
    function readListOfJson(path: string): any[];
    function forEachJson(path: string, callback: (json: any) => void, threads?: number): void;
    function getNumericID(key: string): number;
    function convertToItem(str: string): Tile;
}

declare interface RecipeJsonOld {
    type: "crafting_shaped" | "crafting_shapeless" | "furnace_recipe";
    tags: ("crafting_table" | "furnace" | "blast_furnace" | "smoker" | "campfire" | "stonecutter")[];
    key?: {[key: string]: {item: string, data?: number}};
    ingredients?: {item: string, count?: number, data?: number}[];
    result?: {item: string, count?: number, data?: number};
    input?: string;
    output?: string;
}

declare interface RecipeJson {
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