const McFontPaint: android.graphics.Paint = (() => {
    const NativeAPI = ModAPI.requireGlobal("requireMethodFromNativeAPI");
    const getMcTypeface = NativeAPI("utils.FileTools", "getMcTypeface");
    const paint = new android.graphics.Paint();
    paint.setTypeface(getMcTypeface());
    paint.setTextSize(24);
    return paint;
})();


abstract class RecipeType {

    readonly window: UI.Window;
    readonly icon: ItemInstance;
    private description: string;
    private tankLimit: number;

    private elems: {input: UI.Element[], output: UI.Element[], inputLiq: UI.Element[], outputLiq: UI.Element[]} = {input: [], output: [], inputLiq: [], outputLiq: []};

    constructor(private readonly name: string, icon: Tile | number, content: {params?: UI.BindingsSet, drawing?: UI.DrawingElement[], elements: {[key: string]: Partial<UI.UIElement>}}){

        this.window = new UI.Window();
        this.icon = typeof icon === "number" ? {id: icon, count: 1, data: 0} : {...icon, count: 1};

        content.params = content.params || {};
        content.params.slot = content.params.slot || "_default_slot_light";
        content.drawing = content.drawing || [];
        content.drawing.some(elem => elem.type === "background") || content.drawing.unshift({type: "background", color: Color.TRANSPARENT});

        const templateSlot = {type: "slot", visual: true, clicker: UiFuncs.slotClicker, onTouchEvent: UiFuncs.onTouchSlot};
        const templateTank = {type: "scale", direction: 1, clicker: UiFuncs.tankClicker, onTouchEvent: UiFuncs.onTouchTank};

        let isInputSlot: boolean;
        let isOutputSlot: boolean;
        let isInputTank: boolean;
        let isOutputTank: boolean;
        let inputSlotSize = 0;
        let outputSlotSize = 0;
        let inputTankSize = 0;
        let outputTankSize = 0;
        for(let key in content.elements){
            isInputTank = key.startsWith("inputLiq");
            isOutputTank = key.startsWith("outputLiq");
            isInputSlot = key.startsWith("input") && !isInputTank;
            isOutputSlot = key.startsWith("output") && !isOutputTank;
            if(isInputSlot || isOutputSlot){
                content.elements[key] = {...templateSlot, ...content.elements[key]};
                isInputSlot && inputSlotSize++;
                isOutputSlot && outputSlotSize++;
            }
            if(isInputTank || isOutputTank){
                content.elements[key] = {...templateTank, ...content.elements[key]};
                isInputTank && inputTankSize++;
                isOutputTank && outputTankSize++;
            }
        }

        //@ts-ignore
        this.window.setContent({location: {x: 230, y: 55, width: 600, height: 340}, params: content.params, drawing: content.drawing, elements: content.elements});

        const elements = this.window.getElements();
        for(let i = 0; i < inputSlotSize; i++){
            this.elems.input[i] = elements.get("input" + i);
        }
        for(let i = 0; i < outputSlotSize; i++){
            this.elems.output[i] = elements.get("output" + i);
        }
        for(let i = 0; i < inputTankSize; i++){
            this.elems.inputLiq[i] = elements.get("inputLiq" + i);
        }
        for(let i = 0; i < outputTankSize; i++){
            this.elems.outputLiq[i] = elements.get("outputLiq" + i);
        }

    }

    setDescription(text: string): RecipeType {
        this.description = text;
        return this;
    }

    setTankLimit(limit: number): RecipeType {
        this.tankLimit = limit;
        return this;
    }

    getName(): string {
        return this.name;
    }

    getIcon(): ItemInstance {
        return this.icon;
    }

    getDescription(): string {
        return this.description || "";
    }

    getWindow(): UI.Window {
        return this.window;
    }

    abstract getAllList(): RecipePattern[];

    getList(id: number, data: number, isUsage: boolean): RecipePattern[] {
        const list = this.getAllList();
        return isUsage ?
            list.filter(recipe => recipe.input ? recipe.input.some(item => item.id === id && (data === -1 || item.data === data)) : false) :
            list.filter(recipe => recipe.output ? recipe.output.some(item => item.id === id && (data === -1 || item.data === data)) : false);
    }

    getListByLiquid(liquid: string, isUsage: boolean): RecipePattern[] {
        const list = this.getAllList();
        return isUsage ?
            list.filter(recipe => recipe.inputLiq ? recipe.inputLiq.some(liq => liq.liquid === liquid) : false) :
            list.filter(recipe => recipe.outputLiq ? recipe.outputLiq.some(liq => liq.liquid === liquid) : false);
    }

    hasAnyRecipe(id: number, data: number, isUsage: boolean): boolean {
        const list = this.getAllList();
        if(list.length === 0){
            return this.getList(id, data, isUsage).length > 0;
        }
        return isUsage ?
            list.some(recipe => recipe.input ? recipe.input.some(item => item && item.id === id && (data === -1 || item.data === data)) : false) :
            list.some(recipe => recipe.output ? recipe.output.some(item => item && item.id === id && (data === -1 || item.data === data)) : false);
    }

    hasAnyRecipeByLiquid(liquid: string, isUsage: boolean): boolean {
        const list = this.getAllList();
        if(list.length === 0){
            return this.getListByLiquid(liquid, isUsage).length > 0;
        }
        return isUsage ?
            list.some(recipe => recipe.inputLiq ? recipe.inputLiq.some(liq => liq && liq.liquid === liquid) : false) :
            list.some(recipe => recipe.outputLiq ? recipe.outputLiq.some(liq => liq && liq.liquid === liquid) : false);
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
    }

    showRecipe(recipe: RecipePattern): void {

        this.onOpen(this.window.getElements(), recipe);

        const empty = {id: 0, count: 0, data: 0};

        this.elems.input.forEach((elem, i) => {
            elem.setBinding("source", recipe.input ? (recipe.input[i] || empty) : empty);
        });

        this.elems.output.forEach((elem, i) => {
            elem.setBinding("source", recipe.output ? (recipe.output[i] || empty) : empty);
        });

        this.elems.inputLiq.forEach((elem, i) => {
            if(recipe.inputLiq && recipe.inputLiq[i]){
                elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq[i].liquid, elem.elementRect.width(), elem.elementRect.height()));
                elem.setBinding("value", recipe.inputLiq[i].amount / this.tankLimit);
            }
            else{
                elem.setBinding("value", 0);
            }
        });

        this.elems.outputLiq.forEach((elem, i) => {
            if(recipe.outputLiq && recipe.outputLiq[i]){
                elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.outputLiq[i].liquid, elem.elementRect.width(), elem.elementRect.height()));
                elem.setBinding("value", recipe.outputLiq[i].amount / this.tankLimit);
            }
            else{
                elem.setBinding("texture", "_default_slot_empty");
                elem.setBinding("value", 0);
            }
        });

    }

}