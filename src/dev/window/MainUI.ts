class MainUI {

    private static readonly INNER_WIDTH = 960;
    private static readonly SLOT_X_MIN = 8;
    private static readonly SLOT_X_MAX = 24;
    private static readonly SLOT_MAX = this.SLOT_X_MAX * this.calcSlotCountY(this.SLOT_X_MAX);

    private static page = 0;
    private static list: ItemInfo[] = [];

    private static liquidMode = false;
    private static liqList: string[] = [];

    private static currentSortMode = 0;
    private static sortMode: {text: string, type: "id" | "name", reverse: boolean}[] = [
        {text: "Sort by ID (ASC)", type: "id", reverse: false},
        {text: "Sort by ID (DESC)", type: "id", reverse: true},
        {text: "Sort by Name (ASC)", type: "name", reverse: false},
        {text: "Sort by Name (DESC)", type: "name", reverse: true}
    ];


    private static sortFunc = {
        id: (a: ItemInfo, b: ItemInfo) => {
            if(a.type === "block" && b.type === "item"){
                return -1;
            }
            if(a.type === "item" && b.type === "block"){
                return 1;
            }
            return Block.convertItemToBlockId(a.id) - Block.convertItemToBlockId(b.id) || a.data - b.data;
        },
        name: (a: ItemInfo, b: ItemInfo) => {
            return a.name > b.name ? 1 : -1;
        }
    }

    private static slotCountX = Cfg.slotCountX;
    private static slotCountY = this.calcSlotCountY(this.slotCountX);
    private static slotCount = this.slotCountX * this.slotCountY;
    static readonly tankCount = 8;

    private static calcSlotCountY(slotCountX: number): number {
        const slotSize = this.INNER_WIDTH / slotCountX;
        let count = 0;
        while(68 + slotSize * count <= ScreenHeight - 70){
            count++;
        }
        return count - 1;
    }

    private static setSlotCount(x: number): boolean { //return [need refresh]
        const x2 = Math.min(Math.max(x, this.SLOT_X_MIN), this.SLOT_X_MAX);
        if(this.slotCountX === x2){
            return false;
        }
        this.slotCountX = x2;
        this.slotCountY = this.calcSlotCountY(this.slotCountX);
        this.slotCount = this.slotCountX * this.slotCountY;
        return true;
    }

    private static changeSlotXCount(val: number, force?: boolean): void {

        if(this.liquidMode){
            return;
        }

        if(this.setSlotCount(val) || force){
            const elements = this.window.getElements();
            const diff = this.SLOT_X_MAX - this.SLOT_X_MIN;
            elements.get("textZoom").setBinding("text", this.slotCountX + "");
            elements.get("scrollZoom").setBinding("raw-value", java.lang.Float.valueOf((this.SLOT_X_MAX - this.slotCountX) / diff));
            this.page = 0;
            this.refreshSlotsWindow();
            this.updateWindow();
        }

    }
/*
    private static refreshSlotsWindow_old(): void {

        const height = this.slotCountY * (this.INNER_WIDTH / this.slotCountX);
        const location: UI.WindowLocationParams = {x: 20, y: 68, width: this.INNER_WIDTH, height: height};
        const slotSize = 1000 / this.slotCountX;
        const elemSlot: UI.UIElementSet = {};

        for(let i = 0; i < this.slotCount; i++){
            elemSlot["slot" + i] = {
                type: "slot",
                x: (i % this.slotCountX) * slotSize,
                y: (i / this.slotCountX | 0) * slotSize,
                size: slotSize,
                visual: true,
                clicker: UiFuncs.slotClicker,
                onTouchEvent: UiFuncs.onTouchSlot
            };
        }

        this.slotsWindow = new UI.Window({
            location: location,
            params: {slot: "_default_slot_empty"},
            drawing: [],
            elements: elemSlot
        });

        this.slotsWindow.setBackgroundColor(Color.parseColor("#8B8B8B"));

    }
*/
    private static refreshSlotsWindow(): void {

        const slotSize = 1000 / this.slotCountX;
        const elements = this.slotsWindow.getElements();
        const empty = {id: 0, count: 0, data: 0};
        let elem: UI.Element;

        for(let i = 0; i < this.SLOT_MAX; i++){
            elem = elements.get("slot" + i);
            elem.setBinding("source", empty);
            if(i < this.slotCount){
                elem.size = java.lang.Integer.valueOf(slotSize);
                elem.setSize(slotSize, slotSize);
                elem.setPosition((i % this.slotCountX) * slotSize, (i / this.slotCountX | 0) * slotSize);
                continue;
            }
            elem.setPosition(-1000, -1000);
        }

    }


    private static slotsWindow: UI.Window = (() => {

        const height = ScreenHeight - 68 - 70;
        const location: UI.WindowLocationParams = {x: 20, y: 68, width: this.INNER_WIDTH, height: height};
        const slotSize = 1000 / this.SLOT_X_MAX;
        const elemSlot: UI.UIElementSet = {};

        for(let i = 0; i < this.SLOT_MAX; i++){
            elemSlot["slot" + i] = {
                type: "slot",
                x: (i % this.SLOT_X_MAX) * slotSize,
                y: (i / this.SLOT_X_MAX | 0) * slotSize,
                size: slotSize,
                visual: true,
                clicker: UiFuncs.slotClicker,
                onTouchEvent: UiFuncs.onTouchSlot
            };
        }

        const window: UI.Window = new UI.Window({
            location: location,
            params: {slot: "_default_slot_empty"},
            elements: elemSlot
        });

        window.setBackgroundColor(Color.parseColor("#8B8B8B"));

        return window;

    })();

    private static tanksWindow: UI.Window = (() => {

        const height = ScreenHeight - 68 - 70;
        const location: UI.WindowLocationParams = {x: 20, y: 68, width: this.INNER_WIDTH, height: height};
        const drawTank: UI.DrawingElement[] = [];
        const elemTank: UI.UIElementSet = {};

        for(let i = 0; i < this.tankCount; i++){
            drawTank.push({
                type: "frame",
                x: 30 + i * 120,
                y: 50,
                width: 100,
                height: height - 100,
                bitmap: "default_container_frame",
                scale: 3
            });
            elemTank["tank" + i] = {
                type: "scale",
                x: 33 + i * 120,
                y: 53,
                width: 94,
                height: height - 106,
                bitmap: "_default_slot_empty",
                value: 1,
                clicker: UiFuncs.tankClicker,
                onTouchEvent: UiFuncs.onTouchTank
            };
        }

        const window = new UI.Window({
            location: location,
            drawing: drawTank,
            elements: elemTank
        })

        window.setBackgroundColor(Color.parseColor("#8B8B8B"));

        return window;

    })();


    private static readonly window: UI.WindowGroup = (() => {

        const window = new UI.WindowGroup();

        const controller = window.addWindow("controller", {
            location: {x: 0, y: 0, width: 1000, height: ScreenHeight},
            drawing: [
                {type: "frame", x: 0, y: 0, width: 1000, height: ScreenHeight, bitmap: "classic_frame_bg_light", scale: 3},
                {type: "frame", x: 20 - 3, y: 68 - 3, width: 960 + 6, height: ScreenHeight - 68 - 70 + 6, bitmap: "classic_frame_slot", scale: 3},
                {type: "frame", x: 20, y: ScreenHeight - 60, width: 230, height: 50, bitmap: "classic_frame_bg_light", scale: 1},
                {type: "line", x1: 740, y1: 40, x2: 900, y2: 40, width: 4, color: Color.DKGRAY},
                {type: "text", x: 40, y: ScreenHeight - 27, text: "Item", font: {size: 20}},
                {type: "text", x: 160, y: ScreenHeight - 27, text: "Liquid", font: {size: 20}}
            ],
            elements: {
                buttonClose: {
                    type: "closeButton",
                    x: 1000 - 45 - 9, y: 9, scale: 3,
                    bitmap: "classic_close_button", bitmap2: "classic_close_button_down"
                },
                buttonSearch: {
                    type: "button",
                    x: 20, y: 15, scale: 0.8,
                    bitmap: "mod_browser_search_field",
                    clicker: {
                        onClick: () => {
                            runOnUiThread(() => {
                                const editText = new android.widget.EditText(Context);
                                editText.setHint("in this space");
                                new android.app.AlertDialog.Builder(Context)
                                    .setTitle("Please type the keywords")
                                    .setView(editText)
                                    .setPositiveButton("Search", new android.content.DialogInterface.OnClickListener({
                                        onClick: () => {
                                            const elements = this.window.getElements();
                                            const keyword = editText.getText() + "";
                                            const regexp = new RegExp(keyword, "i");
                                            elements.get("textSearch").setBinding("text", keyword.length ? keyword : "Search");
                                            this.list = ItemList.get().filter(item => item.name.match(regexp));
                                            this.liqList = Object.keys(LiquidRegistry.liquids).filter(liquid => LiquidRegistry.getLiquidName(liquid).match(regexp));
                                            this.page = 0;
                                            this.updateWindow();
                                        }
                                    })).show();
                            });
                        }
                    }
                },
                textSearch: {
                    type: "text",
                    x: 30, y: 25, z: 1,
                    font: {color: Color.WHITE, size: 20},
                    text: "Search"
                },
                buttonSort: {
                    type: "button",
                    x: 450, y: 15, scale: 0.8,
                    bitmap: "mod_browser_button", bitmap2: "mod_browser_button_down",
                    clicker: {onClick: (con, tile, elem) =>{
                        this.changeSortMode();
                        this.updateWindow();
                    }}
                },
                textSort: {
                    type: "text",
                    x: 465, y: 25, z: 1,
                    text: "",
                    font: {color: Color.WHITE, size: 16, shadow: 0.5}
                },
                scrollZoom: {
                    type: "scroll",
                    x: 740, y: 30,
                    length: 160 - 20, width: 20,
                    bitmapHandle: "rv.handle_zoom", bitmapHandleHover: "rv.handle_zoom",
                    bitmapBg: "_default_slot_empty", bitmapBgHover: "_default_slot_empty",
                    onTouchEvent: (elem, event) => {
                        const diff = this.SLOT_X_MAX - this.SLOT_X_MIN;
                        const page = Math.round(event.localX * diff);
                        const zoom = this.SLOT_X_MAX - page;
                        if(this.liquidMode){
                            event.localX = (this.SLOT_X_MAX - this.slotCountX) / diff;
                            return;
                        }
                        event.localX = page / diff;
                        elem.window.getElements().get("textZoom").setBinding("text", zoom + "");
                        this.changeSlotXCount(zoom);
                    }
                },
                textZoom: {type: "text", x: 820, y: 8, font: {color: Color.DKGRAY, size: 12, align: UI.Font.ALIGN_CENTER}},
                buttonMinus: {type: "button", x: 710, y: 30, bitmap: "rv.button_minus", bitmap2: "rv.button_minus_pressed", scale: 1.5, clicker: {
                    onClick: () => {
                        if(!this.liquidMode){
                            this.changeSlotXCount(this.slotCountX + 1);
                        }
                    }
                }},
                buttonPlus: {type: "button", x: 910, y: 30, bitmap: "rv.button_plus", bitmap2: "rv.button_plus_pressed", scale: 1.5, clicker: {
                    onClick: () => {
                        if(!this.liquidMode){
                            this.changeSlotXCount(this.slotCountX - 1);
                        }
                    }
                }},
                switchMode: {
                    type: "switch",
                    x: 93, y: ScreenHeight - 50, scale: 2,
                    onNewState: (state, container, elem) => {
                        World.isWorldLoaded() && this.switchWindow(!!state);
                        //elem.texture = new UI.Texture(UI.TextureSource.get("default_switch" + (state ? "on" : "off")));
                    }
                },
                buttonPrev: {
                    type: "button",
                    x: 520, y: ScreenHeight - 60, scale: 2,
                    bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
                    clicker: {
                        onClick: () => {
                            this.page--;
                            this.updateWindow();
                        }
                    }
                },
                buttonNext: {
                    type: "button",
                    x: 1000 - 48 * 2 - 20, y: ScreenHeight - 60, scale: 2,
                    bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
                    clicker: {
                        onClick: () => {
                            this.page++;
                            this.updateWindow();
                        }
                    }
                },
                textPage: {type: "text", x: 750, y: ScreenHeight - 75, font: {size: 40, align: UI.Font.ALIGN_CENTER}}
            }
        });

        this.setSlotCount(Cfg.slotCountX);
        this.refreshSlotsWindow();
        window.addWindowInstance("list", this.slotsWindow);
        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setContainer(new UI.Container());
        window.setBlockingBackground(true);
        window.setCloseOnBackPressed(true);

        controller.setBackgroundColor(Color.TRANSPARENT);

        controller.setEventListener({
            onOpen: window => {
                StartButton.close();
            },
            onClose: window => {
                this.liquidMode = false;
                Cfg.set("slotCountX", this.slotCountX);
                StartButton.open();
            }
        });

        return window;

    })();

    static setCloseOnBackPressed(val: boolean): void {
        this.window.setCloseOnBackPressed(val);
    }

    static isOpened(): boolean {
        return this.window.isOpened();
    }

    static switchWindow(liquidMode: boolean, force?: boolean): void {
        if(!force && this.liquidMode === liquidMode){
            return;
        }
        this.liquidMode = liquidMode;
        this.page = 0;
        this.window.addWindowInstance("list", liquidMode ? this.tanksWindow : this.slotsWindow);
        UiFuncs.moveOverlayOnTop(this.window);
        this.updateWindow();
    }


    static changeSortMode(notChange?: boolean): void {
        const elements = this.window.getElements();
        notChange || this.currentSortMode++;
        this.currentSortMode %= this.sortMode.length;
        const mode = this.sortMode[this.currentSortMode];
        elements.get("textSort").setBinding("text", mode.text);
        this.list.sort(this.sortFunc[mode.type]);
        mode.reverse && this.list.reverse();
        this.page = 0;
    }


    private static whileDisplaying = false;

    static updateWindow(): void {

        const threadName = "rv_MainUI_updateWindow";

        this.whileDisplaying = false;
        joinThread(threadName);

        const maxPage = Math.ceil(this.liquidMode ? this.liqList.length / this.tankCount : this.list.length / this.slotCount);
        this.page = this.page < 0 ? maxPage - 1 : this.page >= maxPage ? 0 : this.page;
        this.window.getElements().get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);

        if(this.liquidMode){
            Threading.initThread(threadName, () => {
                const elems = this.tanksWindow.getElements();
                let elem: UI.Element;
                let liquid: string;
                this.whileDisplaying = true;
                for(let i = 0; i < this.tankCount && this.whileDisplaying; i++){
                    elem = elems.get("tank" + i);
                    liquid = this.liqList[this.tankCount * this.page + i];
                    if(liquid){
                        elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(liquid, elem.elementRect.width(), elem.elementRect.height()));
                        elem.setBinding("value", 1);
                    }
                    else{
                        elem.setBinding("texture", "_default_slot_empty");
                        elem.setBinding("value", 0);
                    }
                }
            });
        }
        else{
            Threading.initThread(threadName, () => {
                const elems = this.slotsWindow.getElements();
                const empty = {id: 0, count: 0, data: 0};
                let item: ItemInfo;
                this.whileDisplaying = true;
                java.lang.Thread.sleep(20);
                for(let i = 0; i < this.slotCount && this.whileDisplaying; i++){
                    item = this.list[this.slotCount * this.page + i];
                    elems.get("slot" + i).setBinding("source", item ? {id: item.id, count: 1, data: item.data} : empty);
                }
            });
        }

    }


    static openWindow(list: ItemInfo[] = ItemList.get()): void {
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
        this.list = list;
        this.liqList = Object.keys(LiquidRegistry.liquids);
        this.window.open();
        this.changeSortMode(true);
        this.switchWindow(false, true);
        this.changeSlotXCount(this.slotCountX, true);
    }


}