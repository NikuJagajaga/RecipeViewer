class MainUI {

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

    static readonly slotCountX = 12;

    static readonly slotCountY: number = (() => {
        const slotSize = 960 / this.slotCountX;
        let slotCountY = 0;
        for(let y = 68; y <= ScreenHeight - 80 - slotSize; y += slotSize){
            slotCountY++;
        }
        return slotCountY;
    })();

    static readonly slotCount = this.slotCountX * this.slotCountY;
    static readonly tankCount = 8;

    private static readonly listWindow: {item: UI.Window, liquid: UI.Window} = (() => {

        const width = 960;
        const height = this.slotCountY * (960 / this.slotCountX);

        const location: UI.WindowLocationParams = {
            x: 20,
            y: 68,
            width: width,
            height: height,
        };

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

        const bgColor = UI.FrameTextureSource.get("classic_frame_slot").getCentralColor();

        const winSlot = new UI.Window({
            location: location,
            params: {slot: "_default_slot_empty"},
            drawing: [
                {type: "background", color: bgColor}
            ],
            elements: elemSlot
        });

        const drawTank: UI.DrawingElement[] = [{type: "background", color: bgColor}];
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
                bitmap: "_liquid_water_texture_0",
                value: 1,
                clicker: UiFuncs.tankClicker,
                onTouchEvent: UiFuncs.onTouchTank
            };
        }

        const winTank = new UI.Window({
            location: location,
            drawing: drawTank,
            elements: elemTank
        });

        return {item: winSlot, liquid: winTank};

    })();

    private static readonly window: UI.WindowGroup = (() => {

        const window = new UI.WindowGroup();

        const elements: UI.UIElementSet = {
            buttonClose: {
                type: "closeButton",
                x: 1000 - 45 - 9, y: 9, scale: 3,
                bitmap: "classic_close_button", bitmap2: "classic_close_button_down"
            },
            buttonSearch: {
                type: "button",
                x: 20, y: 16, scale: 0.8,
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
                x: 30, y: 26, z: 1,
                font: {color: Color.WHITE, size: 20},
                text: "Search"
            },
            buttonSort: {
                type: "button",
                x: 450, y: 16, scale: 0.8,
                bitmap: "mod_browser_button", bitmap2: "mod_browser_button_down",
                clicker: {onClick: () =>{
                    this.changeSortMode();
                    this.updateWindow();
                }}
            },
            textSort: {
                type: "text",
                x: 465, y: 26, z: 1,
                text: "",
                font: {color: Color.WHITE, size: 16, shadow: 0.5}
            },
            switchMode: {type: "switch", x: 753, y: 20, scale: 2, onNewState: (state) => {
                World.isWorldLoaded() && this.switchWindow(!!state);
            }}
        };

        const slotSize = 960 / this.slotCountX;

        elements.buttonPrev = {
            type: "button",
            x: 20, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
            clicker: {
                onClick: () => {
                    this.page--;
                    this.updateWindow();
                }
            }
        };

        elements.buttonNext = {
            type: "button",
            x: 884, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
            clicker: {
                onClick: () => {
                    this.page++;
                    this.updateWindow();
                }
            }
        };

        elements.textPage = {type: "text", x: 490, y: ScreenHeight - 80, font: {size: 40, align: UI.Font.ALIGN_CENTER}};

        window.addWindow("controller", {
            location: {x: 0, y: 0, width: 1000, height: ScreenHeight},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: ScreenHeight, bitmap: "classic_frame_bg_light", scale: 3},
                {type: "frame", x: 20 - 3, y: 68 - 3, width: 960 + 6, height: this.slotCountY * slotSize + 6, bitmap: "classic_frame_slot", scale: 3},
                {type: "text", x: 700, y: 43, text: "Item", font: {size: 20}},
                {type: "text", x: 820, y: 43, text: "Liquid", font: {size: 20}}
            ],
            elements: elements
        });

        window.addWindowInstance("list", this.listWindow.item);
        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setBlockingBackground(true);
        window.setContainer(new UI.Container());

        window.getWindow("controller").setEventListener({
            onOpen: () => {
                StartButton.close();
            },
            onClose: () => {
                StartButton.open();
            }
        });

        return window;

    })();

    static switchWindow(liquidMode: boolean, force?: boolean): void {
        if(!force && this.liquidMode === liquidMode){
            return;
        }
        this.liquidMode = liquidMode;
        this.page = 0;
        this.window.addWindowInstance("list", liquidMode ? this.listWindow.liquid : this.listWindow.item);
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

    static updateWindow(): void {
        let elements = this.window.getElements();
        const maxPage = this.liquidMode ? (this.liqList.length / this.tankCount | 0) + 1 : (this.list.length / this.slotCount | 0) + 1;
        this.page = this.page < 0 ? maxPage - 1 : this.page >= maxPage ? 0 : this.page;
        elements.get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);
        if(this.liquidMode){
            elements = this.listWindow.liquid.getElements();
            let elem: UI.Element;
            let liquid: string;
            for(let i = 0; i < this.tankCount; i++){
                elem = elements.get("tank" + i);
                liquid = this.liqList[this.tankCount * this.page + i];
                if(liquid){
                    elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(liquid, elem.elementRect.width(), elem.elementRect.height()));
                    elem.setBinding("value", 1);
                }
                else{
                    elem.setBinding("texture", "");
                    elem.setBinding("value", 0);
                }
            }
        }
        else{
            elements = this.listWindow.item.getElements();
            let item: ItemInfo;
            for(let i = 0; i < this.slotCount; i++){
                item = this.list[this.slotCount * this.page + i];
                elements.get("slot" + i).setBinding("source", item ? {id: item.id, count: 1, data: item.data} : {id: 0, count: 0, data: 0});
            }
        }
    }

    static openWindow(list: ItemInfo[] = ItemList.get()): void {
        this.list = list;
        this.liqList = Object.keys(LiquidRegistry.liquids);
        this.window.open();
        this.changeSortMode(true);
        this.switchWindow(false, true);
    }


}