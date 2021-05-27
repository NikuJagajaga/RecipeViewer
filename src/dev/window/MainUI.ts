class MainUI {

    private static readonly slotCountX = 12;

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

    private static readonly slotCount: number = (() => {
        const slotSize = 960 / MainUI.slotCountX;
        let slotCount = 0;
        for(let y = 68; y <= ScreenHeight - 80 - slotSize; y += slotSize){
            slotCount += MainUI.slotCountX;
        }
        return slotCount;
    })();

    private static readonly listWindow: {item: UI.Window, liquid: UI.Window} = (() => {

        const slotSizeGlobal = 960 / MainUI.slotCountX;
        const slotSize = 1000 / MainUI.slotCountX;
        const height = MainUI.slotCount / MainUI.slotCountX * slotSizeGlobal;

        const elemSlot: UI.UIElementSet = {};

        for(let i = 0; i < MainUI.slotCount; i++){
            elemSlot["slot" + i] = {
                type: "slot",
                x: (i % MainUI.slotCountX) * slotSize, y: (i / MainUI.slotCountX | 0) * slotSize, size: slotSize,
                visual: true,
                clicker: RecipeType.slotClicker
            };
        }

        const winSlot = new UI.Window({
            location: {x: 20, y: 68, width: 960, height: height},
            params: {slot: "_default_slot_empty"},
            drawing: [
                {type: "background", color: Color.TRANSPARENT}
            ],
            elements: elemSlot
        });

        const drawTank: UI.DrawingElement[] = [{type: "background", color: Color.TRANSPARENT}];
        const elemTank: UI.UIElementSet = {};

        for(let i = 0; i < 8; i++){
            drawTank.push({type: "frame", x: 30 + i * 120, y: 50, width: 100, height: height - 100, bitmap: "default_container_frame", scale: 3});
            elemTank["tank" + i] = {
                type: "scale",
                x: 33 + i * 120, y: 53,
                width: 94, height: height - 106,
                bitmap: "_liquid_water_texture_0",
                value: 1,
                clicker: RecipeType.tankClicker
            };
        }

        const winTank = new UI.Window({
            location: {x: 20, y: 68, width: 960, height: height},
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
                clicker: {onClick: function(){
                    Context.runOnUiThread(new java.lang.Runnable({
                        run: () =>{
                            try{
                                const editText = new android.widget.EditText(Context);
                                editText.setHint("in this space");
                                new android.app.AlertDialog.Builder(Context)
                                    .setTitle("Please type the keywords")
                                    .setView(editText)
                                    .setPositiveButton("Search", new android.content.DialogInterface.OnClickListener({
                                        onClick: () => {
                                            const keyword = editText.getText() + "";
                                            const regexp = new RegExp(keyword, "i");
                                            MainUI.elements.get("textSearch").setBinding("text", keyword.length ? keyword : "Search");
                                            MainUI.list = ItemList.get().filter(item => item.name.match(regexp));
                                            MainUI.liqList = Object.keys(LiquidRegistry.liquids).filter(liquid => LiquidRegistry.getLiquidName(liquid).match(regexp));
                                            MainUI.page = 0;
                                            MainUI.updateWindow();
                                        }
                                    })).show();
                            }
                            catch(e){
                                alert(e);
                            }
                        }
                    }));
                }}
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
                    MainUI.changeSortMode();
                }}
            },
            textSort: {
                type: "text",
                x: 465, y: 26, z: 1,
                text: "",
                font: {color: Color.WHITE, size: 16, shadow: 0.5}
            },
            switchMode: {type: "switch", x: 753, y: 20, scale: 2, onNewState: (state) => {
                if(World.isWorldLoaded()){
                    MainUI.liquidMode = state;
                    MainUI.page = 0;
                    MainUI.updateWindow();
                }
            }}
        };

        const slotSize = 960 / MainUI.slotCountX;

        elements.buttonPrev = {
            type: "button",
            x: 20, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
            clicker: {onClick: () => {
                MainUI.page--;
                MainUI.updateWindow();
            }}
        };

        elements.buttonNext = {
            type: "button",
            x: 884, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
            clicker: {onClick: () => {
                MainUI.page++;
                MainUI.updateWindow();
            }}
        };

        elements.textPage = {type: "text", x: 490, y: ScreenHeight - 80, font: {size: 40, align: UI.Font.ALIGN_CENTER}};

        window.addWindow("controller", {
            location: {
                padding: {
                    left: __config__.getNumber("Padding.left"),
                    right: __config__.getNumber("Padding.right")
                }
            },
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: ScreenWidth, height: ScreenHeight, bitmap: "classic_frame_bg_light", scale: 3},
                {type: "frame", x: 20 - 3, y: 68 - 3, width: 16 * 60 + 6, height: MainUI.slotCount / MainUI.slotCountX * slotSize + 6, bitmap: "classic_frame_slot", scale: 3},
                {type: "text", x: 700, y: 43, text: "Item", font: {size: 20}},
                {type: "text", x: 820, y: 43, text: "Liquid", font: {size: 20}}
            ],
            elements: elements
        });

        window.addWindowInstance("list", MainUI.listWindow.item);
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

    private static readonly elements = MainUI.window.getWindow("controller").getElements();

    private static readonly elemSlots: UI.Element[] = (() => {
        const array = [];
        const elements = MainUI.listWindow.item.getElements();
        for(let i = 0; i < MainUI.slotCount; i++){
            array[i] = elements.get("slot" + i);
        }
        return array;
    })();

    private static readonly elemTanks: UI.Element[] = (() => {
        const array = [];
        const elements = MainUI.listWindow.liquid.getElements();
        for(let i = 0; i < 8; i++){
            array[i] = elements.get("tank" + i);
        }
        return array;
    })();

    private static changeSortMode(notChange?: boolean): void {
        notChange || this.currentSortMode++;
        this.currentSortMode %= this.sortMode.length;
        const mode = this.sortMode[this.currentSortMode];
        this.elements.get("textSort").onBindingUpdated("text", mode.text);
        this.list.sort(this.sortFunc[mode.type]);
        mode.reverse && this.list.reverse();
        this.page = 0;
        this.updateWindow();
    }

    private static updateWindow(): void {
        if(this.liquidMode){
            this.listWindow.liquid.isOpened() || this.window.addWindowInstance("list", this.listWindow.liquid);
            this.listWindow.item.close();
            const maxPage = (this.liqList.length / 8 | 0) + 1;
            this.page = this.page < 0 ? maxPage - 1 : this.page >= maxPage ? 0 : this.page;
            this.elements.get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);
            this.elemTanks.forEach((elem, i) => {
                const liquid = this.liqList[8 * this.page + i];
                if(liquid){
                    elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(liquid, elem.elementRect.width(), elem.elementRect.height()));
                    elem.setBinding("value", 1);
                }
                else{
                    elem.setBinding("value", 0);
                }
            });
        }
        else{
            this.listWindow.item.isOpened() || this.window.addWindowInstance("list", this.listWindow.item);
            this.listWindow.liquid.close();
            const maxPage = (this.list.length / this.slotCount | 0) + 1;
            this.page = this.page < 0 ? maxPage - 1 : this.page >= maxPage ? 0 : this.page;
            this.elements.get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);
            this.elemSlots.forEach((elem, i) => {
                const item = this.list[this.slotCount * this.page + i];
                elem.setBinding("source", item ? {id: item.id, count: 1, data: item.data} : {id: 0, count: 0, data: 0});
            });
        }
    }

    static openWindow(list: ItemInfo[] = ItemList.get()): void {
        this.list = list;
        this.liqList = Object.keys(LiquidRegistry.liquids);
        this.page = 0;
        this.liquidMode = false;
        this.window.open();
        this.changeSortMode(true);
    }


}