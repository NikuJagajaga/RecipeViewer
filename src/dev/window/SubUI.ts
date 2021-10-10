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

        window.addWindow("controller", {
            location: {x: 140, y: 0, width: 720, height: 480},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: 666.7, bitmap: "default_frame_bg_light", scale: 4}
            ],
            elements: {
                textRecipe: {type: "text", x: 280, y: 20, font: {size: 40, color: Color.WHITE, shadow: 0.5}},
                textUsage: {type: "text", x: 280, y: 20, font: {size: 40, color: Color.GREEN, shadow: 0.5}},
                textAll: {type: "text", x: 280, y: 20, font: {size: 40, color: Color.YELLOW, shadow: 0.5}, clicker: {
                    onClick: (container, tile, elem) => {
                        this.openListView(RecipeTypeRegistry.getAllKeys());
                    }
                },
                onTouchEvent: (elem, event) => {
                    UiFuncs.popupTips("Show All Recipes", elem, event);
                }},
                buttonBack: {
                    type: "button",
                    x: 120, y: 15, scale: 3,
                    bitmap: "_craft_button_up", bitmap2: "_craft_button_down",
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
                            this.recent.length = 0;
                            this.window.close();
                        }
                    }
                },
                textBack: {type: "text", x: 150, y: 25, z: 1, text: "Back",font: {color: Color.WHITE, size: 30, shadow: 0.5}},
                buttonPrev: {
                    type: "button",
                    x: 250 - 48 * 2.5, y: 590, scale: 2.5,
                    bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
                    clicker: {
                        onClick: () => {
                            this.turnPage(this.page - 1);
                        },
                        onLongClick: () => {
                            this.turnPage(0);
                        }
                    }
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
                    x: 350, y: 595, length: 400,
                    onTouchEvent: (elem, event) => {
                        const len = this.list.length - 1;
                        const page = Math.round(event.localX * len);
                        this.turnPage(page);
                        event.localX = page / len;
                    }
                },
                textPage: {type: "text", x: 575, y: 535, font: {size: 40, align: UI.Font.ALIGN_CENTER}}
            }
        });

        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setContainer(new UI.Container());
        window.setBlockingBackground(true);

        return window;

    })();


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
                        elem.source.id && this.changeWindow(elem.y / 1000 | 0);
                    },
                    onLongClick: (container, tile, elem) => {
                        const view = this.getView();
                        const key = view.tray[elem.y / 1000 | 0];
                        this.openListView([key]);
                    }
                },
                /*
                onTouchEvent: (elem, event) => {
                    const view = this.getView();
                    const key = view.tray[elem.y / 1000 | 0];
                    RecipeType.onTouch.popup(RecipeTypeRegistry.isExist(key) ? RecipeTypeRegistry.get(key).getName() : "", elem, event);
                }
                */
            };
            elements["description" + i] = {
                type: "text",
                x: 500, y: i * 1000 + 600, z: 1,
                font: {size: 160, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}
            };
        }

        elements.cursor = {type: "image", x: 0, y: 0, z: 1, bitmap: "_selection", scale: 27.78};

        this.window.addWindow("tray", {
            location: {
                x: 150, y: 10,
                width: 60, height: 460,
                scrollY: recipeTypeLength * 60
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
        const tray: string[] = recipes.filter((recipe) => RecipeTypeRegistry.isExist(recipe) && RecipeTypeRegistry.get(recipe).getAllList().length > 0);
        if(tray.length === 0){
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
            alert("up: " + e);
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
        const elements = this.window.getWindow("controller").getElements();
        this.page = page < 0 ? this.list.length : page >= this.list.length ? 0 : page;
        elements.get("scrollPage").setBinding("raw-value", java.lang.Float.valueOf(this.page / (this.list.length - 1)));
        elements.get("textPage").setBinding("text", (this.page + 1) + " / " + this.list.length);
        recipeType.showRecipe(this.list[this.page]);
    }

}