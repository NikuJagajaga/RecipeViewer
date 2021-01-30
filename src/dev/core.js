const MODE_RECIPE = 0;
const MODE_USAGE = 1;
const MODE_ALL = 2;


const RecipeViewer = {

    list: [],
    recipeType: {},
    recipeTypeLength: 0,

    removeDuplicate: function(item1, index, array){
        return array.findIndex(function(item2){
            return item1.id == item2.id && item1.data == item2.data;
        }) == index;
    },

    addList: function(id, data, type){
        this.list.push({id: id - 0, data: data - 0, type: type});
    },

    addListByData: function(id, data, type){
        if(typeof data == "number"){
            for(let i = 0; i < data; i++){
                this.addList(id, i, type);
            }
        }
        else if(data.length){
            for(let i = 0; i < data.length; i++){
                this.addList(id, data[i], type);
            }
        }
    },

    setup: function(){
        const x = __config__.getNumber("ButtonPosition.x");
        const y = __config__.getNumber("ButtonPosition.y");
        this.startWindow.getLocation().set(x < 0 ? ScreenWidth - (-x): x, y < 0 ? ScreenHeight - (-y): y, 64, 64);
        this.startWindow.setAsGameOverlay(true);
        this.list = this.list.filter(function(item){
            return Item.isValid(item.id);
        }).filter(this.removeDuplicate).map(function(item){
            item.name = RecipeViewer.getName(item.id, item.data);
            return item;
        });
    },

    startWindow: new UI.Window({
        location: {x: 0, y: 0, width: 64, height: 64},
        elements: {
            button: {
                type: "button",
                x: 0, y: 0, scale: 62.5,
                bitmap: "default_button_up", bitmap2: "default_button_down",
                clicker: {
                    onClick: function(){
                        MainUI.openWindow(RecipeViewer.list);
                    },
                    onLongClick: function(){
                        const list = [];
                        let inv;
                        for(let i = 0; i <= 36; i++){
                            inv = Player.getInventorySlot(i);
                            inv.id && list.push({id: inv.id, data: inv.data});
                        }
                        MainUI.openWindow(list.filter(RecipeViewer.removeDuplicate));
                    }
                }
            },
            text: {
                type: "text",
                x: 300, y: 120, z: 1,
                text: "R",
                font: {color: Color.WHITE, size: 600, shadow: 0.5}
            }
        }
    }),

    clicker: {
        onClick: function(o1, o2, elem){
            SubUI.openWindow(elem.source.id, elem.source.data, MODE_RECIPE);
        },
        onLongClick: function(o1, o2, elem){
            SubUI.openWindow(elem.source.id, elem.source.data, MODE_USAGE);
        }
    },

    basicFuncs: {
        getList: function(id, data, isUsage){
            return this.recipeList.filter(function(recipe){
                return recipe[isUsage ? "input" : "output"].some(function(item){
                    return item.id === id && (data === -1 || item.data === data);
                });
            });
        },
        getAllLiist: function(){
            return this.recipeList;
        }
    },

    registerRecipeType: function(name, object){
        const length = {input: 0, output: 0};
        let elem;
        let isInput = isOutput = false;
        if(!object.contents.icon){
            object.contents.icon = {id: VanillaItemID.stick};;
        }
        if(typeof object.contents.icon === "number"){
            object.contents.icon = {id: object.contents.icon};
        }
        object.contents.icon.count = object.contents.icon.count || 1,
        object.contents.icon.data = object.contents.icon.data || 0;
        for(let key in object.contents.elements){
            elem = object.contents.elements[key];
            isInput = key.startsWith("input");
            isOutput = key.startsWith("output");
            if(isInput || isOutput){
                elem.type = "slot";
                elem.visual = true;
                elem.clicker = this.clicker;
                elem.bitmap = elem.bitmap || "_default_slot_light";
                isInput && length.input++;
                isOutput && length.output++;
            }
        }
        object.contents.drawing = object.contents.drawing || [];
        object.contents.drawing.some(function(elem){return elem.type == "background";}) || object.contents.drawing.unshift({type: "background", color: Color.TRANSPARENT});
        if(object.contents.moveItems){
            const moveItems = object.contents.moveItems;
            object.contents.elements.buttonMoveItems = {
                type: "button",
                x: moveItems.x, y: moveItems.y,
                bitmap: "default_button_up", bitmap2: "default_button_down",
                scale: 3,
                clicker: {
                    onClick: function(){
                        SubUI.moveItems(moveItems.slots, moveItems.isPattern, false);
                    },
                    onLongClick: function(){
                        SubUI.moveItems(moveItems.slots, moveItems.isPattern, true);
                    }
                }
            };
            object.contents.elements.textMoveItems = {
                type: "text",
                x: moveItems.x + 10, y: moveItems.y, z: 1,
                text: "+",
                font: {size: 40, color: Color.WHITE, shadow: 0.5}
            };
        }
        this.recipeType[name] = {
            title: object.title || name,
            icon: object.contents.icon,
            description: object.contents.description || "",
            window: new UI.Window({
                location: {x: 230, y: 80, width: 600, height: 340},
                params: object.contents.params,
                drawing: object.contents.drawing,
                elements: object.contents.elements
            }),
            length: length,
            recipeList: object.recipeList || [],
            getList: object.getList || this.basicFuncs.getList,
            getAllList: object.getAllList || (object.recipeList ? this.basicFuncs.getAllLiist : undefined),
            onOpen: object.onOpen
        };
    },

    getIOFromTEWorkbench: function(recipe, cols){
        const array = [];
        let i = j = 0;
        let item;
        switch(recipe.type){
            case "grid":
                for(i = 0; i < recipe.recipe.length; i++){
                    for(j = 0; j < recipe.recipe[i].length; j++){
                        item = recipe.ingridients[recipe.recipe[i][j]];
                        if(item){
                            array[i * cols + j] = {id: item.id, count: 1, data: item.data || 0};
                        }
                    }
                }
            break;
            case "line":
                for(i = 0; i < recipe.recipe.length; i++){
                    item = recipe.ingridients[recipe.recipe[i]];
                    if(item){
                        array[i] = {id: item.id, count: 1, data: item.data || 0};
                    }
                }
            break;
            case "not_shape":
                for(let key in recipe.ingridients){
                    item = recipe.ingridients[key];
                    for(i = 0; i < item.count; i++){
                        array.push({id: item.id, count: 1, data: item.data || 0});
                    }
                }
            break;
        }
        return {input: array, output: [recipe.result]};
    },

    registerTEWorkbenchRecipeType: function(sid, contents, recipes){
        const tile = TileEntity.getPrototype(BlockID[sid]);
        const cols = tile.Columns || tile.columns || tile.Cols || tile.cols || tile.Slots || tile.slots;
        const rows = tile.Rows || tile.rows;
        for(let key in contents.elements){
            if(key.startsWith("input") || key.startsWith("output")){
                contents.elements[key].visual = true;
                contents.elements[key].clicker = this.clicker;
            }
        }
        contents.drawing = contents.drawing || [];
        contents.drawing.some(function(elem){return elem.type == "background";}) || contents.drawing.unshift({type: "background", color: Color.TRANSPARENT});
        this.recipeType["TE_" + sid] = {
            icon: {id: BlockID[sid], count: 1, data: 0},
            description: "",
            window: new UI.Window({
                location: {x: 230, y: 80, width: 600, height: 340},
                params: contents.params,
                drawing: contents.drawing,
                elements: contents.elements
            }),
            length: {input: rows * cols, output: 1},
            getList: function(id, data, isUsage){
                //const recipes = RecipeTE.getRecipes(sid);
                const list = [];
                if(isUsage){
                    let key = "";
                    for(let i = 0; i < recipes.length; i++){
                        for(key in recipes[i].ingridients){
                            if(recipes[i].ingridients[key].id === id && (data === -1 || !recipes[i].ingridients[key].data || (recipes[i].ingridients[key].data || 0) === data)){
                                list.push(RecipeViewer.getIOFromTEWorkbench(recipes[i], cols));
                                break;
                            }
                        }
                    }
                }
                else{
                    for(let i = 0; i < recipes.length; i++){
                        recipes[i].result.id === id && (data === -1 || recipes[i].result.data === data) && list.push(RecipeViewer.getIOFromTEWorkbench(recipes[i], cols));
                    }
                }
                return list;
            },
        };
    },

    getWindow: function(key){
        return this.recipeType[key].window;
    },

    getTitle: function(key){
        return this.recipeType[key].title;
    },

    getIcon: function(key){
        return this.recipeType[key].icon;
    },

    getDescription: function(key){
        return this.recipeType[key].description;
    },

    getLength: function(key){
        return this.recipeType[key].length;
    },

    getRecipeList: function(key, id, data, isUsage){
        if(!this.recipeType[key]){
            return [];
        }
        let list;
        try{
            list = this.recipeType[key].getList(id, data, isUsage);
        }
        catch(e){
            list = [];
            delete this.recipeType[key];
            alert('[RV] RecipeType "' + key + '" has been deleted.\n' + e);
        }
        return list;
    },

    getAllRecipeList: function(key){
        if(!this.recipeType[key] || !this.recipeType[key].getAllList){
            return [];
        }
        let list;
        try{
            list = this.recipeType[key].getAllList();
        }
        catch(e){
            list = [];
            delete this.recipeType[key];
            alert('[RV] RecipeType "' + key + '" has been deleted.\n' + e);
        }
        return list;
    },

    getOpenFunc: function(key){
        return this.recipeType[key] ? this.recipeType[key].onOpen : undefined;
    },

    getName: function(id, data){
        let name = "";
        try{
            name = Item.getName(id, data === -1 ? 0 : data);
        }
        catch(e){
            alert(e);
            name = "name name";
        }
        index = name.indexOf("\n");
        if(index !== -1){
            name = name.slice(0, index);
        }
        index = name.indexOf("§");
        if(index !== -1){
            name = name.slice(0, index) + name.slice(index + 2);
        }
        return name;
    },

    openRecipePage: function(key, container){
        SubUI.openWindow(key, 0, MODE_ALL, container);
    },

    buttons: {},
    putButtonOnNativeGui: function(screenName, window){
        if(typeof window == "string"){
            const key = window;
            window = new UI.Window({
                location: {x: ScreenWidth - 128, y: ScreenHeight - 96, width: 64, height: 64},
                elements: {
                    button: {type: "button", x: 0, y: 0, scale: 62.5, bitmap: "default_button_up", bitmap2: "default_button_down", clicker: {
                        onClick: function(){
                            RecipeViewer.openRecipePage(key);
                        }
                    }},
                    text: {type: "text", x: 300, y: 120, z: 1, text: "R", font: {color: Color.WHITE, size: 600, shadow: 0.5}}
                }
            });
        }
        window.setAsGameOverlay(true);
        this.buttons[screenName] = window;
    },

    transparentBackground: function(){
        //abolish
    }

};


Callback.addCallback("PostLoaded", function(){

    const NativeAPI = ModAPI.requireGlobal("requireMethodFromNativeAPI");
    const getAssetAsJSON = NativeAPI("utils.FileTools", "getAssetAsJSON");
    let it;//go
    let item;
    let key = "";
    let recipes;

    it = getAssetAsJSON("innercore/icons/block_models.json").keys();
    while(it.hasNext()){
        item = it.next().split(":");
        RecipeViewer.addList(Block.convertBlockToItemId(item[0] - 0), item[1] || -1, "block");
    }

    it = getAssetAsJSON("innercore/icons/item_textures.json").keys();
    while(it.hasNext()){
        item = it.next().split(":");
        RecipeViewer.addList(item[0], item[1] || -1, "item");
    }

    for(key in BlockID){
        recipes = Recipes.getWorkbenchRecipesByResult(BlockID[key], -1, -1);
        if(recipes.isEmpty()){
            RecipeViewer.addList(BlockID[key], 0, "block");
            continue;
        }
        it = recipes.iterator();
        while(it.hasNext()){
            item = it.next().getResult();
            RecipeViewer.addList(item.id, item.data, "block");
        }
    }

    for(key in ItemID){
        RecipeViewer.list.some(function(item){return item.id == ItemID[key];}) || RecipeViewer.addList(ItemID[key], 0, "item");
    }

    RecipeViewer.recipeTypeLength = Object.keys(RecipeViewer.recipeType).length;
    MainUI.setupWindow();
    SubUI.setupWindow();

});


Callback.addCallback("LevelLoaded", function(){
    RecipeViewer.setup();
});

const InventoryScreen = {
    inventory_screen: true,
    inventory_screen_pocket: true,
    survival_inventory_screen: true,
    creative_inventory_screen: true
};

Callback.addCallback("NativeGuiChanged", function(screenName){
    InventoryScreen[screenName] ? RecipeViewer.startWindow.open() : RecipeViewer.startWindow.close();
    for(let name in RecipeViewer.buttons){
        name === screenName ? RecipeViewer.buttons[name].open() : RecipeViewer.buttons[name].close();
    }
});