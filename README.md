# Recipe Viewer
[Recipe Viewer](https://icmods.mineprogramming.org/mod?id=455) is a mod for Minecraft BE 1.11.4 that allows you to view all kinds of recipes.

## Usage
* Tap the R button on the inventory screen to open main window.
* Tapping item button will display that item's recipe while long tapping shows what recipes it is used in.
* Tapping back button will back to previous page while long tapping will close recipe window.
### Introduction Videos
* Basic usage  [![](http://img.youtube.com/vi/Cajagp_BZyU/0.jpg)](http://www.youtube.com/watch?v=Cajagp_BZyU)
* New features  [![](http://img.youtube.com/vi/XXLsaUkFfUE/0.jpg)](http://www.youtube.com/watch?v=XXLsaUkFfUE "")


## How to add Recipe Type (for Developers)
### Syntax
```
interface RecipePattern {
    input: ItemInstance[],
    output: ItemInstance[],
    [key: string]: any //arbitrary data
}

let RV;
ModAPI.addAPICallback("RecipeViewer", function(api){
    RV = api.Core;
    RV.registerRecipeType(uniqueKey: string, interface: {
        title?: string, //If omitted, it becomes uniqueKey
        contents: {
            icon: {id: number, count?: number, data?: number} | number, //ItemInstance or ID
            description?: string, //a string under icon
            drawing?: UI.DrawingElement[],
            elements: {
                [key: string]: UI.UIElement
                /*
                Keys that starts with "input" or "output" is slot.
                add numbers in order from 0 at the end.
                ex)
                input0: {x: 200, y: 100, size: 100},
                input1: {x: 200, y: 200, size: 100},
                input2: {x: 200, y: 300, size: 100},
                output0: {x: 700, y: 200, size: 100}
                */
            },
            moveItems?: {
                x: number, y: number, // position of [+] button
                slots: string[], //name of input slot
                isPattern?: boolean //If true, items does not decrease from inventory
            }
        },
        recipeList?: RecipePattern[],
        getList?: (id: number, data: number, isUsage: boolean) => RecipePattern[],
        getAllList?: () => RecipePattern[],
        //register either recipeList or getList
        onOpen?: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern) => void
        //ex) elements.get(elemName).onBindinUpdated("text", Item.getName(recipe.output[0].id, recipe.output[0].data));
    });
});
```
### Examples
Let's register recipe type of [ICPE Ore Washer](https://github.com/MineExplorer/IndustrialCraft_2/blob/master/IndustrialCraft2/dev/machine/processing/ore_washer.js)
* pattern A (Classic)
```
RV.registerRecipeType("icpe_ore_washer", {
    contents: {
        icon: BlockID.oreWasher,
        drawing: [
            {type: "bitmap", x: 300, y: 110, scale: 5, bitmap: "ore_washer_background_edit"}
        ],
        elements: {
            input0: {type: "slot", x: 515, y: 90, size: 90},
            output0: {type: "slot", x: 425, y: 315, size: 90},
            output1: {type: "slot", x: 515, y: 315, size: 90},
            output2: {type: "slot", x: 605, y: 315, size: 90}
        }
    },
    getList: function(id, data, isUsage){
        let result;
        if(isUsage){
            result = MachineRecipeRegistry.getRecipeResult("oreWasher", id);
            return result ? [{
                input: [{id: id, count: 1, data: data}],
                output: [
                    {id: result[0] || 0, count: result[1] || 0, data: 0},
                    {id: result[2] || 0, count: result[3] || 0, data: 0},
                    {id: result[4] || 0, count: result[5] || 0, data: 0}
                ]
            }] : [];
        }
        let list = [];
        let recipe = MachineRecipeRegistry.requireRecipesFor("oreWasher");
        for(let key in recipe){
            result = recipe[key];
            if(result[0] == id || result[2] == id || result[4] == id){
                list.push({
                    input: [{id: parseInt(key), count: 1, data: 0}],
                    output: [
                        {id: result[0] || 0, count: result[1] || 0, data: 0},
                        {id: result[2] || 0, count: result[3] || 0, data: 0},
                        {id: result[4] || 0, count: result[5] || 0, data: 0}
                    ]
                });
            }
        }
        return list;
    },
    getAllList: function(){
        let list = [];
        let recipe = MachineRecipeRegistry.requireRecipesFor("oreWasher");
        let result;
        for(let key in recipe){
            result = recipe[key];
            list.push({
                input: [{id: parseInt(key), count: 1, data: 0}],
                output: [
                    {id: result[0] || 0, count: result[1] || 0, data: 0},
                    {id: result[2] || 0, count: result[3] || 0, data: 0},
                    {id: result[4] || 0, count: result[5] || 0, data: 0}
                ]
            });
        }
        return list;
    }
});
```
* Pattern B (Recommended)
```
Callback.addCallback("PostLoaded", function(){

    const recipe = MachineRecipeRegistry.requireRecipesFor("oreWasher");
    const recipeList = [];
    let result;
    for(let key in recipe){
        result = recipe[key];
        list.push({
            input: [{id: parseInt(key), count: 1, data: 0}],
            output: [
                {id: result[0] || 0, count: result[1] || 0, data: 0},
                {id: result[2] || 0, count: result[3] || 0, data: 0},
                {id: result[4] || 0, count: result[5] || 0, data: 0}
            ]
        });
    }

    RV.registerRecipeType("icpe_ore_washer", {
        contents: {
            //same as above
        },
        recipeList: recipeList
    });

});
```
### Open Recipe Viewer from custom GUI
* Prerequisite: "moveItems" parameter exists in the recipe type interface.
* in clicker of any element
```
clicker: {
    onClick: function(container){
        if(RV){
            RV.openRecipePage(uniqueKey, container);
        }
    }
}
```
* If TileEntity has a "onMoveItems" method, it will execute when the [+] button is pressed.