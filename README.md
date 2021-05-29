# Recipe Viewer
[Recipe Viewer](https://icmods.mineprogramming.org/mod?id=455) is a mod for Inner Core (Minecraft BE 1.11.4 and 1.16.201) that allows you to view all kinds of recipes.

## Usage
* Tap the R button on the inventory screen to open main window.
* Tapping items or liquids will display that recipe while long tapping shows what recipes it is used in.
* Tapping back button will back to previous page while long tapping will close recipe window.
### Introduction Videos
* Basic usage  [![](http://img.youtube.com/vi/Cajagp_BZyU/0.jpg)](http://www.youtube.com/watch?v=Cajagp_BZyU)
* New features  [![](http://img.youtube.com/vi/XXLsaUkFfUE/0.jpg)](http://www.youtube.com/watch?v=XXLsaUkFfUE "")


## How to add Recipe Type (for Developers)
- Import [RecipeViewer.d.ts](/RecipeViewer.d.ts) into your mod.
- Prepare a function that will return all your recipes. () => RecipePattern[]
- Add the following callback at the end of your mod. (All subsequent code should be written in it.)
    ```
    ModAPI.addAPICallback("RecipeViewer", (api: {Core: any, RecipeType: typeof RecipeType, RecipeTypeRegistry: RecipeTypeRegistry}) => {

    });
  ```
- Declare a class for your recipe type
    ```
    class YourRecipeType extends api.RecipeType {

        getAllList(): RecipePattern[] {
            return PreparedFunc();
        }

    }
    ```
- Create instance
    ```
    const YourRecipe = new YourRecipeType("Your Recipe", BlockID.block, {
        params: {},
        drawing: [],
        elements: {

            //"input" + index starts from zero -> InputSlot
            input0: {x: 0, y: 0, size: 100},
            input1: {x: 0, y: 0, size: 100},
            input2: {x: 0, y: 0, size: 100},

            //"output" + index starts from zero -> OutputSlot
            output0: {x: 0, y: 0, size: 100},
            output1: {x: 0, y: 0, size: 100},
            output2: {x: 0, y: 0, size: 100},

            //"inputLiq" + index starts from zero -> InputTank
            inputLiq0: {x: 0, y: 0, width: 50, height: 200},
            inputLiq1: {x: 0, y: 0, width: 50, height: 200},
            inputLiq2: {x: 0, y: 0, width: 50, height: 200},

            //"outputLiq" + index starts from zero -> OutputTank
            outputLiq0: {x: 0, y: 0, width: 50, height: 200},
            outputLiq1: {x: 0, y: 0, width: 50, height: 200},
            outputLiq2: {x: 0, y: 0, width: 50, height: 200}

        }
    });
    ```
- For recipes that use liquids, set the liquid limit.
    ```
    YourRecipe.setTankLimit(8);
    ```
- Register a class in the RecipeTypeRegistry
    ```
    RecipeTypeRegistry.register("your_key", YourRecipe);
    ```
- If you cannot get all the recipes, you can use the following method.
    ```
    class YourRecipeType extends api.RecipeType {

        getAllList(): RecipePattern[] {
            return [];
        }

        getList(id: number, data: number, isUsage: boolean): RecipePattern[] {
            return PreparedFunc(id, data, isUsage);
        }

    }
    ```
- It can also be written as follows
    ```
    class YourRecipeType extends api.RecipeType {

        constructor(){
            super("Your Recipe", BlockID.block, {
                params: {},
                drawing: [],
                elements: {}
            });
            this.setTankLimit(8);
        }

        getAllList(): RecipePattern[] {
            return PreparedFunc();
        }

    }

    RecipeTypeRegistry.register("your_key", new YourRecipeType());
    ```
    ```
    class YourRecipeType extends api.RecipeType {

        constructor(name: string){
            super(name, BlockID.block, {
                params: {},
                drawing: [],
                elements: {}
            });
            this.setTankLimit(8);
        }

        getAllList(): RecipePattern[] {
            return PreparedFunc();
        }

    }

    RecipeTypeRegistry.register("your_key1", new YourRecipeType("Your Recipe 1"));
    RecipeTypeRegistry.register("your_key2", new YourRecipeType("Your Recipe 2"));
    ```