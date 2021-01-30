const SubUI = {

    cache: [],
    list: [],
    page: 0,
    select: "",

    window: new UI.WindowGroup(),
    container: null,

    setupWindow: function(){

        this.window.addWindow("controller", {
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
                        onClick: function(){
                            SubUI.cache.pop();
                            if(SubUI.cache.length){
                                SubUI.refresh();
                                return;
                            }
                            SubUI.window.close();
                        },
                        onLongClick: function(){
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
                        onClick: function(){
                            SubUI.turnPage(SubUI.page - 1);
                        },
                        onLongClick: function(){
                            SubUI.turnPage(0);
                        }
                    }
                },
                buttonNext: {
                    type: "button",
                    x: 854, y: 610, scale: 2,
                    bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
                    clicker: {
                        onClick: function(){
                            SubUI.turnPage(SubUI.page + 1);
                        },
                        onLongClick: function(){
                            SubUI.turnPage(SubUI.list.length - 1);
                        }
                    }
                },
                scrollPage: {
                    type: "scroll",
                    x: 350, y: 595, length: 400,
                    onTouchEvent: function(elem, event){
                        const len = SubUI.list.length - 1;
                        const page = Math.round(event.localX * len);
                        SubUI.turnPage(page);
                        event.localX = page / len;
                    }
                },
                textPage: {type: "text", x: 575, y: 535, font: {size: 40, align: 1}}
            }
        });

        const elements = {};
        let i = 0;
        for(let key in RecipeViewer.recipeType){
            elements["icon" + i] = {
                type: "slot",
                x: 0, y: i * 1000, size: 1000,
                visual: true, needClean: true,
                clicker: {
                    onClick: function(o1, o2, elem){
                        elem.source.id && SubUI.changeWindow(elem.y / 1000 | 0);
                    },
                    onLongClick: function(o1, o2, elem){
                        const target = SubUI.getTarget();
                        const key = target.tray[elem.y / 1000 | 0];
                        RecipeViewer.recipeType[key] && RecipeViewer.recipeType[key].getAllList && SubUI.openWindow(key, 0, MODE_ALL);
                    }
                }
            };
            elements["description" + i] = {
                type: "text",
                x: 500, y: i * 1000 + 700, z: 1,
                font: {size: 160, color: Color.WHITE, shadow: 0.5, alignment: 1}
            };
            i++;
        }
        elements.cursor = {type: "image", x: 0, y: 0, z: 1, bitmap: "_selection", scale: 27.78};
        this.window.addWindow("tray", {
            location: {
                x: 150, y: 20,
                width: 60, height: 400,
                padding: {top: 30, bottom: ScreenHeight - 490},
                scrollY: RecipeViewer.recipeTypeLength * 60
            },
            params: {slot: "_default_slot_empty"},
            drawing: [{type: "background", color: Color.parseColor("#474343")}],
            elements: elements
        });

        this.window.setContainer(new UI.Container());
        this.window.setBlockingBackground(true);

    },

    getTarget: function(){
        return this.cache[this.cache.length - 1];
    },

    openWindow: function(id, data, mode, container){
        const target = this.getTarget();
        if(id === 0 || target && target.id == id && target.data == data && target.mode == mode){
            return;
        }
        Threading.initThread("rv_openWindow", function(){
            try{
                const array = [];
                if(mode === MODE_ALL){
                    RecipeViewer.recipeType[id] && RecipeViewer.recipeType[id].getAllList && array.push(id);
                }
                else{
                    for(let key in RecipeViewer.recipeType){
                        RecipeViewer.getRecipeList(key, id, data, mode === MODE_USAGE).length !== 0 && array.push(key);
                    }
                }
                if(!array.length){
                    alert("Recipe not found");
                    return;
                }
                SubUI.cache.push({id: id, data: data, mode: mode, tray: array});
                SubUI.page = 0;
                SubUI.refresh();
                SubUI.container = container;
                SubUI.window.open();
            }
            catch(e){
                alert(e);
            }
        });
    },

    refresh: function(){
        const target = this.getTarget();
        const name = target.mode == MODE_ALL ? RecipeViewer.getTitle(target.id) : RecipeViewer.getName(target.id, target.data);
        let elements = this.window.getWindow("controller").getElements();
        elements.get("textRecipe").onBindingUpdated("text", target.mode == MODE_RECIPE ? name : "");
        elements.get("textUsage").onBindingUpdated("text", target.mode == MODE_USAGE ? name : "");
        elements.get("textAll").onBindingUpdated("text", target.mode == MODE_ALL ? name : "");
        elements = this.window.getWindow("tray").getElements();
        for(let i = 0; i < RecipeViewer.recipeTypeLength; i++){
            elements.get("icon" + i).onBindingUpdated("source", target.tray[i] ? RecipeViewer.getIcon(target.tray[i]) : {id: 0, count: 0, data: 0});
            elements.get("description" + i).onBindingUpdated("text", target.tray[i] ? RecipeViewer.getDescription(target.tray[i]) : "");
        }
        this.changeWindow(0);
    },

    changeWindow: function(index){
        const trayWindow = this.window.getWindow("tray");
        const target = this.getTarget();
        this.select = target.tray[index];
        trayWindow.getElements().get("cursor").setPosition(0, index * 1000);
        trayWindow.getLocation().setScroll(0, target.tray.length * 60);
        this.window.addWindowInstance("custom", RecipeViewer.getWindow(this.select));
        this.list = target.mode == MODE_ALL ? RecipeViewer.getAllRecipeList(this.select) : RecipeViewer.getRecipeList(this.select, target.id, target.data, target.mode == MODE_USAGE);
        this.turnPage(0, true);
    },

    turnPage: function(page, force){
        if(!force && this.page == page){
            return;
        }
        const length = RecipeViewer.getLength(this.select);
        const onOpen = RecipeViewer.getOpenFunc(this.select);
        let elements = this.window.getWindow("controller").getElements();
        this.page = page < 0 ? this.list.length : page >= this.list.length ? 0 : page;
        elements.get("scrollPage").onBindingUpdated("raw-value", java.lang.Float.valueOf(this.page / (this.list.length - 1)));
        elements.get("textPage").onBindingUpdated("text", (this.page + 1) + " / " + this.list.length);
        const recipe = this.list[this.page];
        elements = this.window.getWindow("custom").getElements();
        let i = 0;
        for(i = 0; i < length.input; i++){
            elements.get("input" + i).onBindingUpdated("source", recipe.input[i] || {id: 0, count: 0, data: 0});
        }
        for(i = 0; i < length.output; i++){
            elements.get("output" + i).onBindingUpdated("source", recipe.output[i] || {id: 0, count: 0, data: 0});
        }
        onOpen && onOpen(elements, recipe);
    },

    moveItems: function(slots, isPattern, all){

        if(!this.container){
            alert("Container is not open.");
            return;
        }

        Threading.initThread("rv_moveItems", function(){

            try{

                const require = SubUI.list[SubUI.page].input;
                let i = 0;
                let count = 0;
                let slot;

                for(i = 0; i < slots.length; i++){
                    slot = SubUI.container.getSlot(slots[i]);
                    if(slot.id !== 0){
                        isPattern || addItemToInventory(slot.id, slot.count, slot.data, slot.extra);
                        SubUI.container.clearSlot(slots[i]);
                    }
                }

                if(isPattern){
                    count = 1;
                }
                else{

                    const stackedRequire = {};
                    const stackedItems = {};

                    let key = "";

                    for(i = 0; i < require.length; i++){
                        if(require[i] && require[i].id !== 0){
                            key = require[i].id + ":" + require[i].data;
                            stackedItems[key] = stackedItems[key] || 0;
                            stackedRequire[key] = stackedRequire[key] || 0;
                            stackedRequire[key] += require[i].count;
                        }
                    }

                    for(i = 0; i < 36; i++){
                        slot = InvSource.get(i);
                        key = slot.id + ":" + slot.data;
                        if(!slot.extra && stackedRequire[key]){
                            stackedItems[key] += slot.count;
                        }
                    }

                    const counts = [];

                    for(key in stackedRequire){
                        counts.push(stackedItems[key] / stackedRequire[key] | 0);
                    }

                    all || counts.push(1);
                    count = Math.min.apply(null, counts);

                    if(count < 1){
                        alert("Not enough ingredients");
                    }
                    else{
                        for(let key in stackedRequire){
                            stackedRequire[key] *= count;
                        }
                        let min = 0;
                        for(i = 0; i < 36; i++){
                            slot = InvSource.get(i);
                            key = slot.id + ":" + slot.data;
                            if(!slot.extra && stackedRequire[key] > 0){
                                min = Math.min(slot.count, stackedRequire[key]);
                                slot.count -= min;
                                stackedRequire[key] -= min;
                                slot.count > 0 ? InvSource.set(i, slot.id, slot.count, slot.data) : InvSource.set(i, 0, 0, 0);
                                if(stackedRequire[key] <= 0){
                                    delete stackedRequire[key];
                                }
                            }
                        }
                    }

                }

                if(count >= 1){
                    for(i = 0; i < slots.length; i++){
                        require[i] && require[i].id !== 0 && SubUI.container.setSlot(slots[i], require[i].id, require[i].count * count, require[i].data);
                    }
                    SubUI.cache.length = 0;
                    SubUI.window.close();
                    const tile = SubUI.container.getParent();
                    tile && tile.onMoveItems && tile.onMoveItems();
                }

            }
            catch(e){
                alert(e);
            }

        });

    }

};