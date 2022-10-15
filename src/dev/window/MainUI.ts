class MainUI {

    private static readonly INNER_WIDTH = 960;

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

    private static readonly slotCountXLimit = {min: 8, max: 24};
    private static slotCountX = 0;
    private static slotCountY: number = this.calcSlotCountY();
    private static slotCount = this.slotCountX * this.slotCountY;
    static readonly tankCount = 8;

    private static calcSlotCountY(): number {
        const slotSize = this.INNER_WIDTH / this.slotCountX;
        let count = 0;
        while(68 + slotSize * count <= ScreenHeight - 70){
            count++;
        }
        return count - 1;
    }

    private static setSlotCount(x: number): boolean { //return [need refresh]
        const x2 = Math.min(Math.max(x, this.slotCountXLimit.min), this.slotCountXLimit.max);
        if(this.slotCountX === x2){
            return false;
        }
        this.slotCountX = x2;
        this.slotCountY = this.calcSlotCountY();
        this.slotCount = this.slotCountX * this.slotCountY;
        Cfg.set("slotCountX", x2);
        return true;
    }

    private static changeSlotXCount(val: -1 | 1): void {
        if(!this.liquidMode){
            if(this.setSlotCount(this.slotCountX + val)){
                this.refreshSlotsWindow();
                this.switchWindow(false, true);
            }
        }
    }

    private static refreshSlotsWindow(): void {

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
            drawing: [
                {type: "background", color: UI.FrameTextureSource.get("classic_frame_slot").getCentralColor()}
            ],
            elements: elemSlot
        });

    }


    private static slotsWindow: UI.Window;

    private static tanksWindow: UI.Window = (() => {

        const height = ScreenHeight - 68 - 70;
        const location: UI.WindowLocationParams = {x: 20, y: 68, width: this.INNER_WIDTH, height: height};
        const drawTank: UI.DrawingElement[] = [{type: "background", color: UI.FrameTextureSource.get("classic_frame_slot").getCentralColor()}];
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

        return new UI.Window({
            location: location,
            drawing: drawTank,
            elements: elemTank
        });

    })();


    private static readonly window: UI.WindowGroup = (() => {

        const window = new UI.WindowGroup();
        const slotSize = 960 / this.slotCountX;

        const controller = window.addWindow("controller", {
            location: {x: 0, y: 0, width: 1000, height: ScreenHeight},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: ScreenHeight, bitmap: "classic_frame_bg_light", scale: 3},
                {type: "frame", x: 20 - 3, y: 68 - 3, width: 960 + 6, height: ScreenHeight - 68 - 70 + 6, bitmap: "classic_frame_slot", scale: 3},
                {type: "frame", x: 20, y: ScreenHeight - 60, width: 230, height: 50, bitmap: "classic_frame_bg_light", scale: 1},
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
                buttonPlus: {type: "button", x: 800, y: 25, bitmap: "rv.button_plus", bitmap2: "rv.button_plus_pressed", scale: 2, clicker: {
                    onClick: () => {
                        this.changeSlotXCount(-1);
                    }
                }},
                buttonMinus: {type: "button", x: 850, y: 25, bitmap: "rv.button_minus", bitmap2: "rv.button_minus_pressed", scale: 2, clicker: {
                    onClick: () => {
                        this.changeSlotXCount(1);
                    }
                }},
                switchMode: {type: "switch", x: 93, y: ScreenHeight - 50, scale: 2, onNewState: (state, container, elem) => {
                    World.isWorldLoaded() && this.switchWindow(!!state);
                    //elem.texture = new UI.Texture(UI.TextureSource.get("default_switch" + (state ? "on" : "off")));
                }},
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

        controller.setEventListener({
            onOpen: () => {
                StartButton.close();
            },
            onClose: () => {
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
    }


}