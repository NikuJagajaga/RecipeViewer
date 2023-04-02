declare const Color: typeof globalAndroid.graphics.Color;
declare const ScreenHeight: number;
declare const isLegacy: boolean;
interface ItemInfo {
    id: number;
    data: number;
    name: string;
    type: "block" | "item";
}
type TouchEventType = "DOWN" | "UP" | "MOVE" | "CLICK" | "LONG_CLICK" | "CANCEL";
interface LiquidInstance {
    liquid: string;
    amount: number;
}
interface ItemInstanceWithTips extends ItemInstance {
    tips?: {
        [key: string]: any;
    };
}
interface LiquidInstanceWithTips extends LiquidInstance {
    tips?: {
        [key: string]: any;
    };
}
interface RecipePattern {
    input?: ItemInstanceWithTips[];
    output?: ItemInstanceWithTips[];
    inputLiq?: LiquidInstanceWithTips[];
    outputLiq?: LiquidInstanceWithTips[];
    [key: string]: any;
}
declare const Math_clamp: (value: number, min: number, max: number) => number;
declare const removeDuplicateFilterFunc: (item1: ItemInfo, index: number, array: ItemInfo[]) => boolean;
declare const unifyMinMax: (val: number | MinMax) => MinMax;
declare const MinMaxtoString: (mm: MinMax) => string;
declare const isBlockID: (id: number) => boolean;
declare const isItemID: (id: number) => boolean;
declare let getNumericID: (key: any_string) => number;
declare const Context: globalAndroid.app.Activity;
declare const runOnUiThread: (func: () => void) => void;
declare const joinThread: (threadName: string, startMsg?: string, doneMsg?: string) => void;
declare const Cfg: {
    readonly set: (name: string, value: any) => void;
    readonly loadIcon: boolean;
    readonly buttonX: number;
    readonly buttonY: number;
    readonly slotCountX: number;
    readonly showId: boolean;
    readonly preventMistap: boolean;
    readonly $workbench: boolean;
    readonly $furnace: boolean;
    readonly $fuel: boolean;
    readonly $blast_furnace: boolean;
    readonly $smoker: boolean;
    readonly $campfire: boolean;
    readonly $brewing: boolean;
    readonly $stonecutter: boolean;
    readonly $smithing: boolean;
    readonly $trading: boolean;
    readonly $liquid_filling: boolean;
};
declare const ItemIconSource: any;
declare class ItemList {
    private static list;
    static get(): ItemInfo[];
    static getItemType(id: number): "block" | "item";
    static addToList(id: number, data: number, type?: "block" | "item"): void;
    static addToListByData(id: number, data: number | number[], type?: "block" | "item"): void;
    static addVanillaItems(): void;
    static addModItems(): void;
    static getName(id: number, data?: number): string;
    static setup(): void;
    static cacheIcons(): void;
}
declare const McFontPaint: android.graphics.Paint;
declare namespace UiFuncs {
    const slotClicker: UI.UIClickEvent;
    const tankClicker: UI.UIClickEvent;
    const genOverlayWindow: () => UI.Window;
    const moveOverlayOnTop: (winGroup: UI.WindowGroup) => void;
    const getElementName: (elem: UI.Element) => string;
    const popupTips: (str: string, elem: UI.Element, event: {
        x: number;
        y: number;
        localX: number;
        localY: number;
        type: TouchEventType;
    }) => void;
    const onTouchSlot: (elem: UI.Element, event: {
        x: number;
        y: number;
        localX: number;
        localY: number;
        type: TouchEventType;
    }) => void;
    const onTouchTank: (elem: UI.Element, event: {
        x: number;
        y: number;
        localX: number;
        localY: number;
        type: TouchEventType;
    }) => void;
    const show404Anim: (elem: UI.Element) => void;
}
declare abstract class RecipeType {
    private readonly name;
    private readonly windows;
    readonly window: UI.Window;
    readonly icon: ItemInstance;
    private description;
    private tankLimit;
    private readonly inputSlotSize;
    private readonly outputSlotSize;
    private readonly inputTankSize;
    private readonly outputTankSize;
    private windowWidth;
    private windowHeight;
    constructor(name: string, icon: Tile | number, content: {
        params?: UI.BindingsSet;
        drawing?: UI.DrawingElement[];
        elements: {
            [key: string]: Partial<UI.UIElement>;
        };
    });
    setGridView(row: number, col: number, border?: boolean | number): RecipeType;
    setDescription(text: string): RecipeType;
    setTankLimit(limit: number): RecipeType;
    getName(): string;
    getIcon(): ItemInstance;
    getDescription(): string;
    getWindow(): UI.Window;
    getRecipeCountPerPage(): number;
    abstract getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    getListByLiquid(liquid: string, isUsage: boolean): RecipePattern[];
    hasAnyRecipe(id: number, data: number, isUsage: boolean): boolean;
    hasAnyRecipeByLiquid(liquid: string, isUsage: boolean): boolean;
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
    showRecipe(recipes: RecipePattern[]): void;
    slotTooltip(name: string, item: ItemInstance, tips: {
        [key: string]: any;
    }): string;
    tankTooltip(name: string, liquid: LiquidInstance, tips: {
        [key: string]: any;
    }): string;
}
declare class RecipeTypeRegistry {
    private static readonly types;
    static register(key: string, recipeType: RecipeType): void;
    static get(key: string): RecipeType;
    static isExist(key: string): boolean;
    static delete(key: string): void;
    static getAllKeys(): string[];
    static getLength(): number;
    static getActiveType(id: number, data: number, isUsage: boolean): string[];
    static getActiveTypeByLiquid(liquid: string, isUsage: boolean): string[];
    static openRecipePage(recipeKey: string | string[]): void;
    static openRecipePageByItem(id: number, data: number, isUsage: boolean): boolean;
    static openRecipePageByLiquid(liquid: string, isUsage: boolean): boolean;
    static getLiquidByTex(texture: string): string;
}
interface OldRecipeContents {
    icon: Tile | number;
    description?: string;
    params?: UI.BindingsSet;
    drawing?: UI.DrawingElement[];
    elements: {
        [key: string]: Partial<UI.UIElement>;
    };
}
interface OldRecipeTypeProperty {
    title?: string;
    contents: OldRecipeContents;
    recipeList?: RecipePattern[];
    getList?: (id: number, data: number, isUsage: boolean) => RecipePattern[];
    getAllList?: () => RecipePattern[];
    onOpen?: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern) => void;
}
declare class OldRecipeType extends RecipeType {
    private readonly recipeList;
    private readonly funcs;
    constructor(obj: OldRecipeTypeProperty);
    getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
}
interface RecipeTE {
    type: "grid" | "line" | "not_shape";
    recipe: any;
    ingridients: {
        [char: string]: ItemInstance;
    };
    result: ItemInstance;
}
declare class OldVersion {
    static registerRecipeType(key: string, obj: OldRecipeTypeProperty): void;
    static getIOFromTEWorkbench(recipe: RecipeTE, cols: number): RecipePattern;
    static registerTEWorkbenchRecipeType(sid: string, contents: OldRecipeContents, recipes: RecipeTE[]): void;
    static removeDuplicate: (item1: ItemInfo, index: number, array: ItemInfo[]) => boolean;
    static getName(id: number, data?: number): string;
    static addList(id: number, data: number, type?: "block" | "item"): void;
    static addListByData(id: number, data: number, type?: "block" | "item"): void;
    static openRecipePage(key: string, container: UI.Container): void;
    static putButtonOnNativeGui(screen: string, key: string): void;
}
declare const StartButton: UI.Window;
declare const InventoryScreen: {
    readonly inventory_screen: true;
    readonly inventory_screen_pocket: true;
    readonly survival_inventory_screen: true;
    readonly creative_inventory_screen: true;
};
declare class MainUI {
    private static readonly INNER_WIDTH;
    private static readonly SLOT_X_MIN;
    private static readonly SLOT_X_MAX;
    private static readonly SLOT_MAX;
    private static page;
    private static list;
    private static liquidMode;
    private static liqList;
    private static currentSortMode;
    private static sortMode;
    private static sortFunc;
    private static slotCountX;
    private static slotCountY;
    private static slotCount;
    static readonly tankCount = 8;
    private static calcSlotCountY;
    private static setSlotCount;
    private static changeSlotXCount;
    private static refreshSlotsWindow;
    private static slotsWindow;
    private static tanksWindow;
    private static readonly window;
    static setCloseOnBackPressed(val: boolean): void;
    static isOpened(): boolean;
    static switchWindow(liquidMode: boolean, force?: boolean): void;
    static changeSortMode(notChange?: boolean): void;
    private static whileDisplaying;
    static updateWindow(): void;
    static openWindow(list?: ItemInfo[]): void;
}
declare const ViewMode: {
    readonly ITEM: 0;
    readonly LIQUID: 1;
    readonly LIST: 2;
};
interface ItemView {
    mode: 0;
    tray: string[];
    id: number;
    data: number;
    isUsage: boolean;
}
interface LiquidView {
    mode: 1;
    tray: string[];
    liquid: string;
    isUsage: boolean;
}
interface ListView {
    mode: 2;
    tray: string[];
}
type ViewInfo = ItemView | LiquidView | ListView;
declare const isItemView: (a: ViewInfo) => a is ItemView;
declare const isLiquidView: (a: ViewInfo) => a is LiquidView;
declare const isListView: (a: ViewInfo) => a is ListView;
declare class SubUI {
    private static page;
    private static list;
    private static select;
    private static recent;
    private static readonly window;
    static isOpened(): boolean;
    static setupWindow(): void;
    static getView(): ViewInfo;
    static openItemView(id: number, data: number, isUsage: boolean): boolean;
    static openLiquidView(liquid: string, isUsage: boolean): boolean;
    static openListView(recipes: string[]): void;
    static setTitle(): void;
    static updateWindow(): void;
    static changeWindow(index: number): void;
    static turnPage(page: number, force?: boolean): void;
}
declare class RButton {
    private static currentScreen;
    private static data;
    private static window;
    static putOnNativeGui(screenName: string, recipeKey: string | string[]): void;
    static onNativeGuiChanged(screen: string): void;
}
declare class WorkbenchRecipe extends RecipeType {
    constructor();
    convertToJSArray(set: java.util.Collection<Recipes.WorkbenchRecipe>): RecipePattern[];
    getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    hasAnyRecipe(id: number, data: number, isUsage: boolean): boolean;
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
}
declare class FurnaceRecipe extends RecipeType {
    constructor();
    getAllList(): RecipePattern[];
}
declare class FurnaceFuelRecipe extends RecipeType {
    constructor();
    getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
}
declare class LikeFurnaceRecipe extends RecipeType {
    private recipeList;
    constructor(name: string, icon: Tile | number);
    registerRecipe(input: Tile, output: Tile): void;
    getAllList(): RecipePattern[];
}
declare const BlastFurnaceRecipe: LikeFurnaceRecipe;
declare const SmokerRecipe: LikeFurnaceRecipe;
declare const CampfireRecipe: LikeFurnaceRecipe;
declare class BrewingRecipe extends RecipeType {
    private static recipeList;
    private static recipeListOld;
    constructor();
    getAllList(): RecipePattern[];
}
declare class StonecutterRecipe extends RecipeType {
    private static recipeList;
    static registerRecipe(input: ItemInstance, output: ItemInstance): void;
    constructor();
    getAllList(): RecipePattern[];
}
declare class SmithingRecipe extends RecipeType {
    private static recipeList;
    static overrideList(recipeList: RecipePattern[]): void;
    constructor();
    getAllList(): RecipePattern[];
}
interface VillagerWant {
    item: string;
    quantity: number | MinMax;
}
interface VillagerGive {
    item: string;
    functions: {
        function: string;
        treasure: boolean;
        levels: MinMax;
    }[];
}
interface VillagerTrade {
    wants: VillagerWant[];
    gives: [VillagerGive];
}
interface TradingJson {
    tiers: {
        trades: VillagerTrade[];
    }[];
}
declare class TradingRecipe extends RecipeType {
    private static convertToJobName;
    private static allTrade;
    constructor();
    getAllList(): RecipePattern[];
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
    static setup(): void;
}
declare class LiquidFillingRecipe extends RecipeType {
    constructor();
    getAllList(): RecipePattern[];
}
