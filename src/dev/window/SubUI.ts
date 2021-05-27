interface ViewInfo {
    mode: ViewMode;
    tray: string[];
    id?: number;
    data?: number;
    liquid?: string;
    isUsage?: boolean;
    recipe?: string;
}


class SubUI {

    private static page = 0;
    private static list: RecipePattern[] = [];

    private static select = "";
    private static cache: ViewInfo[] = [];

    private static readonly window: UI.WindowGroup = (() => {

        const window = new UI.WindowGroup();

        window.addWindow("controller", {
            location: {x: 140, y: 10, width: 720, height: 480},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: 666.7, bitmap: "default_frame_bg_light", scale: 2}
            ],
            elements: {
                textRecipe: {type: "text", x: 280, y: 20, font: {size: 40, color: Color.WHITE, shadow: 0.5}},
                textUsage: {type: "text", x: 280, y: 20, font: {size: 40, color: Color.GREEN, shadow: 0.5}},
                textAll: {type: "text", x: 280, y: 20, font: {size: 40, color: Color.YELLOW, shadow: 0.5}},
                buttonBack: {
                    type: "button",
                    x: 120, y: 15, scale: 3,
                    bitmap: "_craft_button_up", bitmap2: "_craft_button_down",
                    clicker: {
                        onClick: () => {
                            SubUI.cache.pop();
                            if(SubUI.cache.length){
                                SubUI.updateWindow();
                                return;
                            }
                            SubUI.window.close();
                        },
                        onLongClick: () => {
                            SubUI.cache.length = 0;
                            SubUI.window.close();
                        }
                    }
                },
                textBack: {type: "text", x: 150, y: 25, z: 1, text: "Back",font: {color: Color.WHITE, size: 30, shadow: 0.5}},
                buttonPrev: {
                    type: "button",
                    x: 150, y: 610, scale: 2,
                    bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
                    clicker: {
                        onClick: () => {
                            SubUI.turnPage(SubUI.page - 1);
                        },
                        onLongClick: () => {
                            SubUI.turnPage(0);
                        }
                    }
                },
                buttonNext: {
                    type: "button",
                    x: 854, y: 610, scale: 2,
                    bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
                    clicker: {
                        onClick: () => {
                            SubUI.turnPage(SubUI.page + 1);
                        },
                        onLongClick: () => {
                            SubUI.turnPage(SubUI.list.length - 1);
                        }
                    }
                },
                scrollPage: {
                    type: "scroll",
                    x: 350, y: 595, length: 400,
                    onTouchEvent: (elem: UI.Element, event: {localX: number, localY: number}) => {
                        const len = SubUI.list.length - 1;
                        const page = Math.round(event.localX * len);
                        SubUI.turnPage(page);
                        event.localX = page / len;
                    }
                },
                textPage: {type: "text", x: 575, y: 535, font: {size: 40, align: UI.Font.ALIGN_CENTER}}
            }
        });

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
                    onClick: (container: UI.Container, tile: TileEntity, elem: UI.Element) => {
                        elem.source.id && SubUI.changeWindow(elem.y / 1000 | 0);
                    },
                    onLongClick: (container: UI.Container, tile: TileEntity, elem: UI.Element) => {
                        const target = SubUI.getTarget();
                        const key = target.tray[elem.y / 1000 | 0];
                        const recipeType = RecipeTypeRegistry.get(key);
                        recipeType && recipeType.getAllList && SubUI.openWindow(key);
                    }
                }
            };
            elements["description" + i] = {
                type: "text",
                x: 500, y: i * 1000 + 600, z: 1,
                font: {size: 160, color: Color.WHITE, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER}
            };
        }

        elements.cursor = {type: "image", x: 0, y: 0, z: 1, bitmap: "_selection", scale: 27.78};

        this.window.addWindow("tray", {
            location: {
                x: 150, y: 20,
                width: 60, height: 400,
                padding: {top: 20, bottom: ScreenHeight - 480},
                scrollY: recipeTypeLength * 60
            },
            params: {slot: "_default_slot_empty"},
            drawing: [{type: "background", color: Color.parseColor("#474343")}],
            elements: elements
        });

    }

    static getTarget(): ViewInfo {
        return this.cache[this.cache.length - 1];
    }

    static openWindow(search: Tile | string, isUsage?: boolean): void {

        const target = this.getTarget();

        if(typeof search === "string"){
            if(isUsage === void 0){
                if(!RecipeTypeRegistry.isExist(search) || target && target.mode === ViewMode.ALL && target.recipe === search){
                    return;
                }
                if(RecipeTypeRegistry.get(search).getAllList().length > 0){
                    this.cache.push({mode: ViewMode.ALL, recipe: search, tray: [search]});
                }
                else{
                    alert("Recipe not found");
                    return;
                }
            }
            else{
                const array = RecipeTypeRegistry.getActiveTypeByLiquid(search, isUsage);
                if(array.length === 0){
                    alert("Recipe not found");
                    return;
                }
                this.cache.push({mode: ViewMode.LIQUID, liquid: search, isUsage: isUsage, tray: array});
            }
        }
        else{
            if(isUsage === void 0 || search.id === 0 || target && typeof target !== "string" && target.id === search.id && target.data === search.data && target.isUsage === isUsage){
                return;
            }
            const array = RecipeTypeRegistry.getActiveType(search.id, search.data, isUsage);
            if(array.length === 0){
                alert("Recipe not found");
                return;
            }
            this.cache.push({mode: ViewMode.ITEM, id: search.id, data: search.data, isUsage: isUsage, tray: array});
        }

        this.page = 0;
        this.updateWindow();
        this.window.open();

    }

    static updateWindow(): void {

        const target = this.getTarget();

        let name: string;
        switch(target.mode){
            case ViewMode.ITEM: name = ItemList.getName(target.id, target.data); break;
            case ViewMode.LIQUID: name = LiquidRegistry.getLiquidName(target.liquid); break;
            case ViewMode.ALL: name = RecipeTypeRegistry.get(target.recipe).getName(); break;
        }

        let elements = this.window.getWindow("controller").getElements();
        elements.get("textRecipe").setBinding("text", target.mode !== ViewMode.ALL && !target.isUsage ? name : "");
        elements.get("textUsage").setBinding("text", target.mode !== ViewMode.ALL && target.isUsage ? name : "");
        elements.get("textAll").setBinding("text", target.mode === ViewMode.ALL ? name : "");
        elements = this.window.getWindow("tray").getElements();

        const length = RecipeTypeRegistry.getLength();
        let recipeType: RecipeType;

        for(let i = 0; i < length; i++){
            if(target.tray[i]){
                recipeType = RecipeTypeRegistry.get(target.tray[i]);
                elements.get("icon" + i).setBinding("source", recipeType.getIcon());
                elements.get("description" + i).setBinding("text", recipeType.getDescription());
            }
            else{
                elements.get("icon" + i).setBinding("source", {id: 0, count: 0, data: 0});
                elements.get("description" + i).setBinding("text", "");
            }
        }

        this.changeWindow(0);

    }

    static changeWindow(index: number): void {

        const trayWindow = this.window.getWindow("tray");
        const target = this.getTarget();
        const tray = typeof target === "string" ? [target] : target.tray;

        this.select = tray[index];
        trayWindow.getElements().get("cursor").setPosition(0, index * 1000);
        trayWindow.getLocation().setScroll(0, tray.length * 60);

        const recipeType = RecipeTypeRegistry.get(this.select);
        this.window.addWindowInstance("custom", recipeType.getWindow());

        try{
            switch(target.mode){
                case ViewMode.ITEM: this.list = recipeType.getList(target.id, target.data, target.isUsage); break;
                case ViewMode.LIQUID: this.list = recipeType.getListByLiquid(target.liquid, target.isUsage); break;
                case ViewMode.ALL: this.list = recipeType.getAllList(); break;
            }
        }
        catch(e){
            RecipeTypeRegistry.delete(this.select);
            alert('[RV] RecipeType "' + this.select + '" has been deleted.\n' + e);
        }

        this.turnPage(0, true);

    }

    static turnPage(page: number, force?: boolean): void {

        if(!force && this.page === page){
            return;
        }

        const recipeType = RecipeTypeRegistry.get(this.select);

        let elements = this.window.getWindow("controller").getElements();
        this.page = page < 0 ? this.list.length : page >= this.list.length ? 0 : page;
        elements.get("scrollPage").setBinding("raw-value", java.lang.Float.valueOf(this.page / (this.list.length - 1)));
        elements.get("textPage").setBinding("text", (this.page + 1) + " / " + this.list.length);
        const recipe = this.list[this.page];
        recipeType.showRecipe(recipe);

    }

}