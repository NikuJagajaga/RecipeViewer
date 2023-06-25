abstract class RecipeType {

    private readonly windows: UI.Window[];
    readonly window: UI.Window;
    readonly icon: ItemInstance;
    private description: string;
    private tankLimit: number;

    private readonly inputSlotSize: number;
    private readonly outputSlotSize: number;
    private readonly inputTankSize: number;
    private readonly outputTankSize: number;

    private windowWidth: number;
    private windowHeight: number;

    constructor(private readonly name: string, icon: Tile | number, content: {params?: UI.BindingsSet, drawing?: UI.DrawingElement[], elements: {[key: string]: Partial<UI.UIElement>}}){

        this.icon = typeof icon === "number" ? {id: icon, count: 1, data: 0} : {...icon, count: 1};

        content.params = content.params || {};
        content.params.slot = content.params.slot || "_default_slot_light";
        content.drawing = content.drawing || [];
        content.drawing.some(elem => elem.type === "background") || content.drawing.unshift({type: "background", color: Color.TRANSPARENT});

        const that = this;

        const templateSlot = {
            type: "slot",
            visual: true,
            clicker: UiFuncs.slotClicker,
            onTouchEvent: (elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}) => {
                const name = elem.source.id !== 0 ? ItemList.getName(elem.source.id, elem.source.data) : "";
                UiFuncs.popupTips(that.slotTooltip(name, elem.source, elem.getBinding("rv_tips")), elem, event);
            }
        };

        const templateTank = {
            type: "scale",
            direction: 1,
            clicker: UiFuncs.tankClicker,
            onTouchEvent: (elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}) => {
                const liquid = RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + "");
                const amount = elem.getBinding("value") * this.tankLimit;
                const name = LiquidRegistry.isExists(liquid) ? LiquidRegistry.getLiquidName(liquid) : "";
                UiFuncs.popupTips(that.tankTooltip(name, {liquid: liquid, amount: amount}, elem.getBinding("rv_tips")), elem, event);
            }
        };

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
                content.elements[key] = {...content.elements[key], ...templateSlot};
                isInputSlot && inputSlotSize++;
                isOutputSlot && outputSlotSize++;
            }
            if(isInputTank || isOutputTank){
                content.elements[key] = {...content.elements[key], ...templateTank};
                isInputTank && inputTankSize++;
                isOutputTank && outputTankSize++;
            }
        }

        this.inputSlotSize = inputSlotSize;
        this.outputSlotSize = outputSlotSize;
        this.inputTankSize = inputTankSize;
        this.outputTankSize = outputTankSize;

        const locCtrler = new UI.WindowLocation({x: (1000 - ScreenHeight * 1.5) / 2, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight});

        this.window = new UI.Window();
        this.windowWidth = locCtrler.windowToGlobal(860);
        this.windowHeight = ScreenHeight - locCtrler.windowToGlobal(75 + 75);

        this.window.setContent({
            location: {
                x: locCtrler.x + locCtrler.windowToGlobal(120),
                y: locCtrler.y + locCtrler.windowToGlobal(75),
                width: this.windowWidth,
                height: this.windowHeight
            },
            params: content.params,
            drawing: content.drawing,
            elements: content.elements as UI.UIElementSet
        });

        this.windows = [this.window];

    }

    setGridView(row: number, col: number, border?: boolean | number/*Color*/): RecipeType {

        const content = this.window.getContent();
        const locCtrler = new UI.WindowLocation({x: (1000 - ScreenHeight * 1.5) / 2, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight});
        const x = locCtrler.x + locCtrler.windowToGlobal(120);
        const y = locCtrler.y + locCtrler.windowToGlobal(75);
        const w = locCtrler.windowToGlobal(860);
        const h = (ScreenHeight - locCtrler.windowToGlobal(75 + 75));
        let window: UI.Window;

        this.windows.length = 0;
        this.windowWidth = w / col;
        this.windowHeight = h / row;

        for(let c = 0; c < col; c++){
            for(let r = 0; r < row; r++){
                window = (c === 0 && r === 0) ? this.window : new UI.Window({...content});
                window.getLocation().set(x + this.windowWidth * c, y + this.windowHeight * r, this.windowWidth, this.windowHeight);
                this.windows.push(window);
            }
        }

        for(let i = 1; i < this.windows.length; i++){
            this.window.addAdjacentWindow(this.windows[i]);
            this.windows[i].setParentWindow(this.window);
        }

        if(border){

            const color: number = typeof border === "boolean" ? Color.rgb(80, 70, 80) : border;
            const location = new UI.WindowLocation({x: x, y: y, width: w, height: h});
            const lines: UI.DrawingElement[] = [];
            let pos = 0;

            for(let r = 1; r < row; r++){
                pos = location.getWindowHeight() / row * r;
                lines.push({type: "line", x1: 0, x2: 1000, y1: pos, y2: pos, color: color, width: 6});
            }

            for(let c = 1; c < col; c++){
                pos = 1000 / col * c;
                lines.push({type: "line", x1: pos, x2: pos, y1: 0, y2: location.getWindowHeight(), color: color, width: 6});
            }

            window = new UI.Window({
                location: location.asScriptable(),
                drawing: [
                    {type: "background", color: Color.TRANSPARENT},
                    ...lines
                ],
                elements: {}
            });

            window.setTouchable(false);
            this.window.addAdjacentWindow(window);

        }

        return this;

    }
/*
    setParentWindow(window: UI.WindowGroup): void {
        for(let i = 0; i < this.windows.length; i++){
            this.windows[i].setParentWindow(window);
        }
    }
*/
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

    getRecipeCountPerPage(): number {
        return this.windows.length;
    }

    abstract getAllList(): RecipePattern[];

    getList(id: number, data: number, isUsage: boolean): RecipePattern[] {
        const list = this.getAllList();
        const callback = item => item.id === id && (data === -1 || item.data === -1 || item.data === data);
        return isUsage ?
            list.filter(recipe => recipe.input ? recipe.input.some(callback) : false) :
            list.filter(recipe => recipe.output ? recipe.output.some(callback) : false);
    }

    getListByLiquid(liquid: string, isUsage: boolean): RecipePattern[] {
        const list = this.getAllList();
        const callback = liq => liq.liquid === liquid;
        return isUsage ?
            list.filter(recipe => recipe.inputLiq ? recipe.inputLiq.some(callback) : false) :
            list.filter(recipe => recipe.outputLiq ? recipe.outputLiq.some(callback) : false);
    }

    hasAnyRecipe(id: number, data: number, isUsage: boolean): boolean {
        const list = this.getAllList();
        if(list.length === 0){
            return this.getList(id, data, isUsage).length > 0;
        }
        const callback = item => item && item.id === id && (data === -1 || item.data === -1 || item.data === data);
        return isUsage ?
            list.some(recipe => recipe.input ? recipe.input.some(callback) : false) :
            list.some(recipe => recipe.output ? recipe.output.some(callback) : false);
    }

    hasAnyRecipeByLiquid(liquid: string, isUsage: boolean): boolean {
        const list = this.getAllList();
        if(list.length === 0){
            return this.getListByLiquid(liquid, isUsage).length > 0;
        }
        const callback = liq => liq && liq.liquid === liquid;
        return isUsage ?
            list.some(recipe => recipe.inputLiq ? recipe.inputLiq.some(callback) : false) :
            list.some(recipe => recipe.outputLiq ? recipe.outputLiq.some(callback) : false);
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
    }

    showRecipe(recipes: RecipePattern[]): void {

        const empty = {id: 0, count: 0, data: 0};
        const recsPerPage = this.getRecipeCountPerPage();
        let recipe: RecipePattern;
        let elements: java.util.HashMap<string, UI.Element>
        let elem: UI.Element;

        for(let i = 0; i < recsPerPage; i++){

            recipe = recipes[i] || {};
            elements = this.windows[i].getElements();

            recipes[i] && this.onOpen(elements, recipe);

            for(let j = 0; j < this.inputSlotSize; j++){
                elem = elements.get("input" + j);
                if(recipe.input && recipe.input[j]){
                    elem.setBinding("source", {id: recipe.input[j].id, count: recipe.input[j].count, data: recipe.input[j].data});
                    recipe.input[j].tips && elem.setBinding("rv_tips", recipe.input[j].tips);
                }
                else{
                    elem.setBinding("source", empty);
                    elem.setBinding("rv_tips", null);
                }
            }

            for(let j = 0; j < this.outputSlotSize; j++){
                elem = elements.get("output" + j);
                if(recipe.output && recipe.output[j]){
                    elem.setBinding("source", {id: recipe.output[j].id, count: recipe.output[j].count, data: recipe.output[j].data});
                    recipe.output[j].tips && elem.setBinding("rv_tips", recipe.output[j].tips);
                }
                else{
                    elem.setBinding("source", empty);
                    elem.setBinding("rv_tips", null);
                }
            }

            for(let j = 0; j < this.inputTankSize; j++){
                elem = elements.get("inputLiq" + j);
                if(recipe.inputLiq && recipe.inputLiq[j]){
                    elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq[j].liquid, elem.elementRect.width(), elem.elementRect.height()));
                    elem.setBinding("value", recipe.inputLiq[j].amount / this.tankLimit);
                    recipe.inputLiq[j].tips && elem.setBinding("rv_tips", recipe.inputLiq[j].tips);
                }
                else{
                    elem.setBinding("texture", "_default_slot_empty");
                    elem.setBinding("value", 0);
                    elem.setBinding("rv_tips", null);
                }
            }

            for(let j = 0; j < this.outputTankSize; j++){
                elem = elements.get("outputLiq" + j);
                if(recipe.outputLiq && recipe.outputLiq[j]){
                    elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.outputLiq[j].liquid, elem.elementRect.width(), elem.elementRect.height()));
                    elem.setBinding("value", recipe.outputLiq[j].amount / this.tankLimit);
                    recipe.outputLiq[j].tips && elem.setBinding("rv_tips", recipe.outputLiq[j].tips);
                }
                else{
                    elem.setBinding("texture", "_default_slot_empty");
                    elem.setBinding("value", 0);
                    elem.setBinding("rv_tips", null);
                }
            }

        }

    }

    slotTooltip(name: string, item: ItemInstance, tips: {[key: string]: any}): string {
        let str = name;
        if(name && Cfg.showId){
            str += item.data === -1 ? `\n(#${item.id})` : `\n(#${item.id}/${item.data})`;
        }
        return str;
    }

    tankTooltip(name: string, liquid: LiquidInstance, tips: {[key: string]: any}): string {
        return name;
    }

}