const Color = android.graphics.Color;
const ScreenWidth = 1000;
const ScreenHeight = UI.getScreenHeight();
const Context = UI.getContext();
const isLegacy = getMCPEVersion().array[1] === 11;

interface ItemInfo {
    id: number;
    data: number;
    name: string;
    type: "block" | "item";
}

type valueof<T> = T[keyof T];
const ViewMode = {ITEM: 0, LIQUID: 1, ALL: 2} as const;
type ViewMode = valueof<typeof ViewMode>;

interface LiquidInstance {
    liquid: string;
    amount: number;
}

interface RecipePattern {
    input?: ItemInstance[];
    output?: ItemInstance[];
    inputLiq?: LiquidInstance[];
    outputLiq?: LiquidInstance[];
    [key: string]: any;
}


const removeDuplicateFilterFunc = (item1: ItemInfo, index: number, array: ItemInfo[]) => array.findIndex(item2 => item1.id === item2.id && item1.data === item2.data && item1.type === item2.type) === index;
const setLoadingTip: (text: string) => void = ModAPI.requireGlobal("MCSystem.setLoadingTip");

const isBlockID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("block");
};

const isItemID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("item");
};