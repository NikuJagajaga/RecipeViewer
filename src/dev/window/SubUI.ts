const ViewMode = {
    ITEM: 0,
    LIQUID: 1,
    LIST: 2
} as const;

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
const isItemView = (a: ViewInfo): a is ItemView => a && a.mode === ViewMode.ITEM;
const isLiquidView = (a: ViewInfo): a is LiquidView => a && a.mode === ViewMode.LIQUID;
const isListView = (a: ViewInfo): a is ListView => a && a.mode === ViewMode.LIST;


class SubUI {

    private static page = 0;
    private static list: RecipePattern[] = [];

    private static select = "";
    private static recent: ViewInfo[] = [];

    private static readonly window: UI.WindowGroup = (() => {

        const window = new UI.WindowGroup();

        const controller = window.addWindow("controller", {
            location: {x: (1000 - ScreenHeight * 1.5) / 2, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: 1000 / 1.5, bitmap: "default_frame_bg_light", scale: 4},
                {type: "frame", x: 300, y: 590, width: 500, height: 60, bitmap: "default_scroll_bg", scale: 4}//scroll background
            ],
            elements: {
                textRecipe: {type: "text", x: 280, y: 18, font: {size: 40, color: Color.WHITE, shadow: 0.5}},
                textUsage: {type: "text", x: 280, y: 18, font: {size: 40, color: Color.GREEN, shadow: 0.5}},
                textAll: {type: "text", x: 280, y: 18, font: {size: 40, color: Color.YELLOW, shadow: 0.5},
                    clicker: {
                        onClick: (container, tile, elem) => {
                            this.openListView(RecipeTypeRegistry.getAllKeys());
                        }
                    },
                    onTouchEvent: (elem, event) => {
                        UiFuncs.popupTips("Show All Recipes", elem, event);
                    }
                },
                buttonBack: {
                    type: "button",
                    x: 120, y: 20, scale: 0.8,
                    bitmap: "mod_browser_back", bitmap2: "mod_browser_back_down",
                    clicker: {
                        onClick: () => {
                            this.recent.pop();
                            if(this.recent.length > 0){
                                this.updateWindow();
                                return;
                            }
                            this.window.close();
                        },
                        onLongClick: () => {
                            this.window.close();
                        }
                    }
                },
                buttonPrev: {
                    type: "button",
                    x: 250 - 48 * 2.5, y: 590, scale: 2.5,
                    bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
                    clicker: {
                        onClick: () => {
                            this.turnPage(this.page - 1);
                        },
                        onLongClick: (container, tile, elem) => {
                            this.turnPage(0);
                        }
                    },
                    /*
                    onTouchEvent(elem, event){
                        const that = this;
                        Threading.initThread("rv_holdButton", () => {
                            java.lang.Thread.sleep(500);
                            while(elem.isTouched){
                                that.turnPage(that.page - 1);
                                java.lang.Thread.sleep(200);
                            }
                            alert("Touch Finish!");
                        });
                    }
                    */
                },
                buttonNext: {
                    type: "button",
                    x: 850, y: 590, scale: 2.5,
                    bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
                    clicker: {
                        onClick: () => {
                            this.turnPage(this.page + 1);
                        },
                        onLongClick: () => {
                            this.turnPage(this.list.length - 1);
                        }
                    }
                },
                scrollPage: {
                    type: "scroll",
                    x: 300, y: 590, z: 1,
                    length: 500 - 60 * 10 / 16, width: 60,
                    bitmapBg: "_default_slot_empty",
                    bitmapBgHover: "_default_slot_empty",
                    onTouchEvent: (elem, event) => {
                        const recipeType = RecipeTypeRegistry.get(this.select);
                        const recsPerPage = recipeType.getRecipeCountPerPage();
                        const maxPage = Math.ceil(this.list.length / recsPerPage) - 1;
                        const page = Math.round(event.localX * maxPage);
                        this.turnPage(page);
                        event.localX = page / maxPage;
                    }
                },
                textPage: {type: "text", x: 550, y: 595, font: {size: 24, align: UI.Font.ALIGN_CENTER}}
            }
        });

        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setContainer(new UI.Container());
        window.setBlockingBackground(true);
        window.setCloseOnBackPressed(true);

        controller.setBackgroundColor(Color.TRANSPARENT);

        controller.setEventListener({
            onOpen: () => {
                MainUI.isOpened() && MainUI.setCloseOnBackPressed(false);
            },
            onClose: () => {
                this.recent.length = 0;
                MainUI.isOpened() && MainUI.setCloseOnBackPressed(true);
            }
        });

        return window;

    })();

    static isOpened(): boolean {
        return this.window.isOpened();
    }

    static setupWindow(): void {

        const recipeTypeLength = RecipeTypeRegistry.getLength();
        const elements: UI.UIElementSet = {};

        for(let i = 0; i < recipeTypeLength; i++){
            elements["icon" + i] = {
                type: "slot",
                x: 0, y: i * 1000, size: 1000,
                visual: true,
                clicker: {
                    onClick: (container, tile, elem) => {
                        const index = parseInt(UiFuncs.getElementName(elem).slice(("icon").length));
                        elem.source.id && this.changeWindow(index);
                    },
                    onLongClick: (container, tile, elem) => {
                        const index = parseInt(UiFuncs.getElementName(elem).slice(("icon").length));
                        const view = this.getView();
                        this.openListView([view.tray[index]]);
                    }
                }
            };
            elements["description" + i] = {
                type: "text",
                x: 500, y: i * 1000 + 600, z: 1,
                font: {size: 160, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}
            };
        }

        elements.cursor = {type: "image", x: 0, y: 0, z: 1, bitmap: "_selection", scale: 27.78};

        const location = this.window.getWindow("controller").getLocation();

        this.window.addWindow("tray", {
            location: {
                x: location.x + location.windowToGlobal(20),
                y: location.y + location.windowToGlobal(20),
                width: location.windowToGlobal(80),
                height: location.getWindowHeight() - location.windowToGlobal(40),
                padding: {top: location.windowToGlobal(20), bottom: location.windowToGlobal(20)},
                scrollY: recipeTypeLength * location.windowToGlobal(80)
            },
            params: {slot: "_default_slot_empty"},
            drawing: [{type: "background", color: Color.parseColor("#474343")}],
            elements: elements
        });

        this.window.moveOnTop("overlay");

    }

    static getView(): ViewInfo {
        return this.recent[this.recent.length - 1];
    }

    static openItemView(id: number, data: number, isUsage: boolean): boolean {
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
        const currentView = this.getView();
        if(id === 0 || isItemView(currentView) && currentView.id === id && currentView.data === data && currentView.isUsage === isUsage){
            return false;
        }
        const array = RecipeTypeRegistry.getActiveType(id, data, isUsage);
        if(array.length === 0){
            return true;
        }
        const view: ItemView = {mode: ViewMode.ITEM, id: id, data: data, isUsage: isUsage, tray: array};
        this.recent.push(view);
        this.page = 0;
        this.updateWindow();
        this.window.open();
        return false;
    }

    static openLiquidView(liquid: string, isUsage: boolean): boolean {
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
        const currentView = this.getView();
        if(liquid === "" || isLiquidView(currentView) && currentView.liquid === liquid && currentView.isUsage === isUsage){
            return false;
        }
        const array = RecipeTypeRegistry.getActiveTypeByLiquid(liquid, isUsage);
        if(array.length === 0){
            return true;
        }
        const view: LiquidView = {mode: ViewMode.LIQUID, liquid: liquid, isUsage: isUsage, tray: array};
        this.recent.push(view);
        this.page = 0;
        this.updateWindow();
        this.window.open();
        return false;
    }

    static openListView(recipes: string[]): void {
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
        const currentView = this.getView();
        const tray: string[] = recipes.filter((recipe) => RecipeTypeRegistry.isExist(recipe) && RecipeTypeRegistry.get(recipe).getAllList().length > 0);
        if(tray.length === 0 || isListView(currentView) && [...currentView.tray].sort().join(",") === [...tray].sort().join(",")){
            return;
        }
        const view: ListView = {mode: ViewMode.LIST, tray: tray};
        this.recent.push(view);
        this.page = 0;
        this.updateWindow();
        this.window.open();
    }

    static setTitle(): void {
        const view = this.getView();
        const elements = this.window.getWindow("controller").getElements();
        const title: string =
            isItemView(view) ? ItemList.getName(view.id, view.data) :
            isLiquidView(view) ? LiquidRegistry.getLiquidName(view.liquid) :
            isListView(view) ? RecipeTypeRegistry.get(this.select).getName() : "";
        elements.get("textRecipe").setBinding("text", !isListView(view) && !view.isUsage ? title : "");
        elements.get("textUsage").setBinding("text", !isListView(view) && view.isUsage ? title : "");
        elements.get("textAll").setBinding("text", isListView(view) ? title : "");
    }

    static updateWindow(): void {

        try{

            const elements = this.window.getWindow("tray").getElements();
            const view = this.getView();
            const length = RecipeTypeRegistry.getLength();
            let recipeType: RecipeType;
            let icon: UI.Element;
            let description: UI.Element;

            for(let i = 0; i < length; i++){
                icon = elements.get("icon" + i);
                description = elements.get("description" + i);
                if(view.tray[i]){
                    recipeType = RecipeTypeRegistry.get(view.tray[i]);
                    icon.setBinding("source", recipeType.getIcon());
                    description.setBinding("text", recipeType.getDescription());
                }
                else{
                    icon.setBinding("source", {id: 0, count: 0, data: 0});
                    description.setBinding("text", "");
                }
            }

            this.changeWindow(0);

        }
        catch(e){
            alert("SubUI.UpdateWindow\n" + e);
        }

    }

    static changeWindow(index: number): void {

        const trayWindow = this.window.getWindow("tray");
        const view = this.getView();

        this.select = view.tray[index];
        trayWindow.getElements().get("cursor").setPosition(0, index * 1000);
        //trayWindow.getLocation().setScroll(0, view.tray.length * 60);

        const recipeType = RecipeTypeRegistry.get(this.select);
        this.window.addWindowInstance("custom", recipeType.getWindow());
        UiFuncs.moveOverlayOnTop(this.window);

        try{
            this.list =
                isItemView(view) ? recipeType.getList(view.id, view.data, view.isUsage) :
                isLiquidView(view) ? recipeType.getListByLiquid(view.liquid, view.isUsage) :
                isListView(view) ? recipeType.getAllList() : [];
        }
        catch(e){
            RecipeTypeRegistry.delete(this.select);
            alert('[RV] RecipeType "' + this.select + '" has been deleted.\n' + e);
        }

        this.setTitle();
        this.turnPage(0, true);

    }

    static turnPage(page: number, force?: boolean): void {
        if(!force && this.page === page){
            return;
        }
        const recipeType = RecipeTypeRegistry.get(this.select);
        const recsPerPage = recipeType.getRecipeCountPerPage();
        const elements = this.window.getWindow("controller").getElements();
        const maxPage = Math.ceil(this.list.length / recsPerPage);
        this.page = page < 0 ? maxPage - 1 : page >= maxPage ? 0 : page;
        elements.get("scrollPage").setBinding("raw-value", java.lang.Float.valueOf(this.page / (maxPage - 1)));
        elements.get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);
        elements.get("textPage").setPosition(550 + (this.page < maxPage / 2 ? 150 : -150), 595);
        recipeType.showRecipe(this.list.slice(this.page * recsPerPage, this.page * recsPerPage + recsPerPage));
    }

}