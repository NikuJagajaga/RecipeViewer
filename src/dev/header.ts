IMPORT("BehaviorJsonReader");


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

interface ItemInstanceWithTips extends ItemInstance {
    tips?: {[key: string]: any};
}

interface LiquidInstanceWithTips extends LiquidInstance {
    tips?: {[key: string]: any};
}

interface RecipePattern {
    input?: ItemInstanceWithTips[];
    output?: ItemInstanceWithTips[];
    inputLiq?: LiquidInstanceWithTips[];
    outputLiq?: LiquidInstanceWithTips[];
    [key: string]: any;
}


const Math_clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const removeDuplicateFilterFunc = (item1: ItemInfo, index: number, array: ItemInfo[]) => array.findIndex(item2 => item1.id === item2.id && item1.data === item2.data && item1.type === item2.type) === index;

const unifyMinMax = (val: number | MinMax): MinMax => {
    if(typeof val === "object"){
        return {min: val.min | 0, max: val.max | 0};
    }
    return {min: val | 0, max: val | 0};
};

const MinMaxtoString = (mm: MinMax): string => mm.min === mm.max ? mm.min + "" : mm.min + "-" + mm.max;

const isBlockID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("block");
};

const isItemID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("item");
};

let getNumericID: (key: any_string) => number  =  (key: string) => BehaviorJsonReader.getNumericID(String(key));


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


const joinThread = (threadName: string, startMsg?: string, doneMsg?: string): void => {
    const thread = Threading.getThread(threadName);
    if(thread){
        startMsg && alert(startMsg);
        thread.join();
        doneMsg && alert(doneMsg);
    }
}