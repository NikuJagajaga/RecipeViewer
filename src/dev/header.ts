const Color = android.graphics.Color;
const ScreenHeight = UI.getScreenHeight();
const isLegacy = getMCPEVersion().array[1] === 11;

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

interface RecipePattern {
    input?: ItemInstance[];
    output?: ItemInstance[];
    inputLiq?: LiquidInstance[];
    outputLiq?: LiquidInstance[];
    [key: string]: any;
}


const Math_clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const removeDuplicateFilterFunc = (item1: ItemInfo, index: number, array: ItemInfo[]) => array.findIndex(item2 => item1.id === item2.id && item1.data === item2.data && item1.type === item2.type) === index;

const isBlockID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("block");
};

const isItemID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("item");
};


const Context = UI.getContext();
const runOnUiThread = (func: () => void) => {
    Context.runOnUiThread(new java.lang.Runnable({
        run: () =>{
            try{
                func();
            }
            catch(e){
                alert(e);
            }
        }
    }));
}

/*
const SafeInsets: {left: number, right: number} = (() => {
    //@ts-ignore
    const cutout: android.view.DisplayCutout = Context.getWindowManager().getCurrentWindowMetrics().getWindowInsets().getDisplayCutout();
    return {left: cutout.getSafeInsetLeft(), right: cutout.getSafeInsetRight()};
})();
*/