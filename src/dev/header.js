IMPORT("ChargeItem");

const Bitmap = android.graphics.Bitmap;
const Canvas = android.graphics.Canvas;
const Rect = android.graphics.Rect;
const Color = android.graphics.Color;
const Context = UI.getContext();
const ScreenWidth = 1000;
const ScreenHeight = UI.getScreenHeight();

const setLoadingTip = ModAPI.requireGlobal("MCSystem.setLoadingTip");
const NativeAPI = ModAPI.requireGlobal("requireMethodFromNativeAPI");
const InvSource = {
    get: NativeAPI("api.mod.util.InventorySource", "getSource"),
    set: NativeAPI("api.mod.util.InventorySource", "setSource")
};

const addItemToInventory = function(id, count, data, extra){
    const stack = Item.getMaxStack(id);
    let slot;
    let add = 0;
    for(let i = 0; i < 36; i++){
        slot = InvSource.get(i);
        if(slot.id === 0 || slot.id === id && slot.data === data && slot.count < stack && !slot.extra){
            add = Math.min(count, stack - slot.count);
            slot.id = id;
            slot.data = data;
            slot.count += add;
            count -= add;
            if(extra){
                slot.extra = extra.copy();
            }
            InvSource.set(i, slot.id, slot.count, slot.data, slot.extra);
            if(count <= 0){
                return;
            }
        }
    }
    if(count > 0){
        const pos = Player.getPosition();
        while(count > 0){
            add = Math.min(count, stack);
            World.drop(pos.x, pos.y, pos.z, id, add, data, extra);
            count -= add;
        }
    }
};


const getNumericID = function(key){
    if(!key.startsWith("minecraft:")){
        return 0;
    }
    const key2 = key.substr(10);
    const array = key2.split("_");
    let id = 0;
    if(array[0] === "block"){
        const slice = array.slice(1);
        id = BlockID[slice.join("_")];
        if(id){
            return id;
        }
        let key3 = slice[0];
        for(let i = 1; i < slice.length; i++){
            key3 += slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
        }
        id = BlockID[key3];
        if(id){
            return id;
        }
    }
    if(array[0] === "item"){
        id = ItemID[array.slice(1).join("_")];
        if(id){
            return id;
        }
        let key3 = slice[0];
        for(let i = 1; i < slice.length; i++){
            key3 += slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
        }
        id = ItemID[key3];
        if(id){
            return id;
        }
    }
    return VanillaBlockID[key2] || VanillaItemID[key2] || 0;
}


Callback.addCallback("PostLoaded", function(){

    const defs = [__packdir__ + "assets/definitions/"];
    const search = function(path){
        FileTools.GetListOfDirs(path).forEach(function(dir){
            const path2 = dir.getAbsolutePath();
            dir.getName() == "definitions" ? defs.push(path2 + "/") : search(path2);
        });
    };
    search(__packdir__ + "innercore/mods/");

    const jsons = [];
    defs.forEach(function(path){
        FileTools.GetListOfFiles(path + "recipe/", ".json").forEach(function(file){
            jsons.push(file.getAbsolutePath());
        });
    });

    jsons.forEach(function(path, index){
        const json = FileTools.ReadJSON(path);
        if(json.tags){
            json.tags.forEach(function(tag){
                switch(tag){
                    case "campfire": CampfireRecipe.addFromJSON(json); break;
                    case "smoker": SmokerRecipe.addFromJSON(json); break;
                    case "blast_furnace": BlastFurnaceRecipe.addFromJSON(json); break;
                    case "stonecutter": StonecutterRecipe.addFromJSON(json); break;
                }
            });
        }
        setLoadingTip("[RV]: read JSON  (" + (index + 1) + " / " + jsons.length + ")");
    });
    
});