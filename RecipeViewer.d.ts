/// <reference path="core-engine.d.ts" />
declare type ItemType = "block" | "item";
declare interface ItemInfo {
    id: number;
    data: number;
    name: string;
    type: ItemType;
}
declare interface LiquidInstance {
    liquid: string,
    amount: number;
}
declare interface RecipePattern {
    input?: ItemInstance[],
    output?: ItemInstance[],
    inputLiq?: LiquidInstance[],
    outputLiq?: LiquidInstance[]
}
declare interface OldRecipeContents {
    icon: Tile | number;
    description?: string;
    params?: UI.BindingsSet;
    drawing?: UI.DrawingSet;
    elements: {[key: string]: Partial<UI.UIElement>};
}
declare interface OldRecipeTypeProperty {
    title?: string;
    contents: OldRecipeContents;
    recipeList?: RecipePattern[];
    getList?: (id: number, data: number, isUsage: boolean) => RecipePattern[];
    getAllList?: () => RecipePattern[];
    onOpen?: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern) => void;
}
declare interface RecipeTE {
    type: "grid" | "line" | "not_shape";
    recipe: string[] | string[][];
    ingredients: {[key: string]: ItemInstance};
    result: ItemInstance;
}
/** @deprecated */
declare interface RecipeViewerOld {
    registerRecipeType(key: string, obj: OldRecipeTypeProperty): void;
    getIOFromTEWorkbench(recipe: RecipeTE, cols: number): RecipePattern;
    registerTEWorkbenchRecipeType(sid: string, contents: OldRecipeContents, recipes: RecipeTE[]): void;
    removeDuplicate(item1: ItemInfo, index: number, array: ItemInfo[]): boolean;
    getName(id: number, data?: number): string;
    addList(id: number, data: number, type?: ItemType): void;
    addListByData(id: number, data: number, type?: ItemType): void;
    openRecipePage(key: string, container: UI.Container): void;
    putButtonOnNativeGui(screen: string, key: string): void;
}
declare interface RecipeContents {
    params?: UI.BindingsSet,
    drawing?: UI.DrawingSet,
    elements: {[key: string]: Partial<UI.UIElement>};
}
declare abstract class RecipeType {
    constructor(name: string, icon: number | Tile, content: RecipeContents);
    setDescription(text: string): this;
    setTankLimit(limit: number): this;
    abstract getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
}
declare interface RecipeTypeRegistry {
    readonly types: {[key: string]: RecipeType};
    register(key: string, recipeType: RecipeType): void;
    get(key: string): RecipeType;
    isExist(key: string): boolean;
    delete(key: string): void;
    getLength(): number;
    getActiveType(id: number, data: number, isUsage: boolean): string[];
    getActiveTypeByLiquid(liquid: string, isUsage: boolean): string[];
    openRecipePage(key: string): void;
}
declare interface ItemList {
    get(): ItemInfo[];
    getItemType(id: number): ItemType;
    addToList(id: number, data: number, type?: ItemType): void;
    addToListByData(id: number, data: number | number[], type?: ItemType): void;
    addVanillaItems(): void;
    addModItems(): void;
    getName(id: number, data?: number): string;
    setup(): void;
}
declare interface BehaviorTools {
    readJson(path: string): any;
    readListOfJson(path: string): any[];
    getNumericID(key: string): number;
    convertToItem(str: string): Tile;
}
declare interface BrewingRecipe {
    recipeList: RecipePattern[];
    registerRecipe(input: string, reagent: string, output: string): void;
    recipeListOld: RecipePattern[];
    getName(meta: number): string;
}
declare interface LikeFurnaceRecipe {
    recipeList: RecipePattern[];
    registerRecipe(input: string, output: string): void;
    getAllList(): RecipePattern[];
}
declare interface StonecutterRecipe {
    recipeList: RecipePattern[];
    registerRecipe(input: { item: string, count?: number, data?: number }, output: { item: string, count?: number, data?: number }): void;
}
declare interface MainUI {
    readonly slotCountX: 12;
    page: number;
    list: ItemInfo[];
    liquidMode: boolean;
    liqList: string[];
    currentSortMode: number;
    sortMode: { text: string, type: "id" | "name", reverse: boolean }[];
    sortFunc: { id: (a: ItemInfo, b: ItemInfo) => number, name: (a: ItemInfo, b: ItemInfo) => 1 | -1 };
    readonly slotCount: number;
    readonly listWindow: { item: UI.Window, liquid: UI.Window };
    readonly window: UI.WindowGroup;
    readonly elements: java.util.HashMap<string, UI.Element>;
    readonly elemSlots: UI.Element[];
    readonly elemTanks: UI.Element[];
    changeSortMode(notChange?: boolean): void;
    updateWindow(): void;
    openWindow(list?: ItemInfo[]): void;
}
declare interface RButton {
    currentScreen: string;
    data: {[screen: string]: string};
    window: UI.Window;
    putOnNativeGui(screenName: string, recipeTypeKey: string): void;
    onNativeGuiChanged(screen: string): void;
}
declare interface ViewInfo {
    mode: 0 | 1 | 2,
    tray: string[],
    id?: number,
    data?: number,
    liquid?: string,
    isUsage?: boolean,
    recipe?: string;
}
declare interface SubUI {
    page: number;
    list: RecipePattern[];
    select: string;
    cache: ViewInfo[];
    readonly window: UI.WindowGroup;
    setupWindow(): void;
    getTarget(): ViewInfo;
    openWindow(search: Tile | string, isUsage?: boolean): void;
    updateWindow(): void;
    changeWindow(index: number): void;
    turnPage(page: number, force?: boolean): void;
}
declare interface RecipeViewerAPI {
    Core: RecipeViewerOld;
    ItemList: ItemList;
    RecipeType: typeof RecipeType;
    RecipeTypeRegistry: RecipeTypeRegistry;
    requireGlobal(name: "BehaviorTools"): BehaviorTools;
    requireGlobal(name: "BrewingRecipe"): BrewingRecipe;
    requireGlobal(name: "BlastFurnaceRecipe"): LikeFurnaceRecipe;
    requireGlobal(name: "SmokerRecipe"): LikeFurnaceRecipe;
    requireGlobal(name: "CampfireRecipe"): LikeFurnaceRecipe;
    requireGlobal(name: "StonecutterRecipe"): StonecutterRecipe;
    requireGlobal(name: "MainUI"): MainUI;
    requireGlobal(name: "RButton"): RButton;
    requireGlobal(name: "SubUI"): SubUI;
}
declare namespace ModAPI {
    function addAPICallback(apiName: "RecipeViewer", func: (api: RecipeViewerAPI) => void): void;
}
