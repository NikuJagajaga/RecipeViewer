RecipeViewer.registerRecipeType("furnace", {
    title: "Smelting",
    contents: {
        icon: VanillaBlockID.furnace,
        drawing: [
            {type: "bitmap", x: 440, y: 185, scale: 2, bitmap: "_workbench_bar"}
        ],
        elements: {
            input0: {x: 280, y: 190, size: 120},
            output0: {x: 600, y: 190, size: 120}
        }
    },
    getList: function(id, data, isUsage){
        let result;
        if(isUsage){
            result = Recipes.getFurnaceRecipeResult(id, data);
            return result ? [{
                input: [{id: id, count: 1, data: data}],
                output: [result]
            }] : [];
        }
        const list = [];
        const recipe = Recipes.getFurnaceRecipesByResult();
        const iterator = recipe.iterator();
        let entry;
        while(iterator.hasNext()){
            entry = iterator.next();
            result = entry.getResult();
            id == result.id && (!~data || data == result.data) && list.push({
                input: [{id: entry.inId, count: 1, data: entry.inData}],
                output: [result]
            });
        }
        return list;
    },
    getAllList: function(){
        const list = [];
        const recipe = Recipes.getFurnaceRecipesByResult();
        const iterator = recipe.iterator();
        let entry;
        while(iterator.hasNext()){
            entry = iterator.next();
            list.push({
                input: [{id: entry.inId, count: 1, data: entry.inData}],
                output: [entry.getResult()]
            });
        }
        return list;
    }
});


RecipeViewer.registerRecipeType("fuel", {
    title: "Furnace Fuel",
    contents: {
        icon: VanillaBlockID.furnace,
        description: "fuel",
        drawing: [
            {type: "bitmap", x: 290, y: 140, scale: 8, bitmap: "furnace_burn"}
        ],
        elements: {
            input0: {x: 280, y: 260, size: 120},
            text: {type: "text", x: 450, y: 220, multiline: true, font: {size: 40, color: Color.WHITE, shadow: 0.5}}
        }
    },
    getList: function(id, data, isUsage){
        return isUsage && Recipes.getFuelBurnDuration(id, data) > 0 ? [{input: [{id: id, count: 1, data: data}]}] : [];
    },
    onOpen: function(elements, recipe){
        const item = recipe.input[0];
        const time = Recipes.getFuelBurnDuration(item.id, item.data);
        elements.get("text").onBindingUpdated("text", time + " tick\n(smelts  "+ ((time / 20 | 0) / 10) +"  items)");
    }
});


RecipeViewer.putButtonOnNativeGui("furnace_screen", "furnace");