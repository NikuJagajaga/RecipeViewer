RecipeViewer.registerRecipeType("workbench", {
    contents: {
        icon: VanillaBlockID.crafting_table,
        drawing: [
            {type: "bitmap", x: 530, y: 185, scale: 2, bitmap: "_workbench_bar"}
        ],
        elements: {
            input0: {x: 200, y: 100, size: 100},
            input1: {x: 300, y: 100, size: 100},
            input2: {x: 400, y: 100, size: 100},
            input3: {x: 200, y: 200, size: 100},
            input4: {x: 300, y: 200, size: 100},
            input5: {x: 400, y: 200, size: 100},
            input6: {x: 200, y: 300, size: 100},
            input7: {x: 300, y: 300, size: 100},
            input8: {x: 400, y: 300, size: 100},
            output0: {x: 680, y: 190, size: 120}
        }
    },
    getList: function(id, data, isUsage){
        const list = [];
        const data2 = Item.getMaxDamage(id) ? -1 : data;
        const recipe = isUsage ? Recipes.getWorkbenchRecipesByIngredient(id, data2) : Recipes.getWorkbenchRecipesByResult(id, -1, data2);
        const iterator = recipe.iterator();
        let entry, field, result, input, chargeData;
        let i = amount = 0;
        while(iterator.hasNext()){
            entry = iterator.next();
            result = entry.getResult();
            field = entry.getSortedEntries();
            input = [];
            chargeData = ChargeItemRegistry.getItemData(result.id);
            for(i = 0; i < 9; i++){
                if(!field[i]){
                    break;
                }
                input[i] = {id: field[i].id, count: 1, data: field[i].data};
                amount += chargeData ? ChargeItemRegistry.getEnergyStored(field[i], chargeData.energy) : 0;
            }
            chargeData && chargeData.type != "extra" && result.count == 1 && ChargeItemRegistry.addEnergyTo(result, chargeData.energy, amount, amount, 100);
            list.push({input: input, output: [result]});
        }
        return list;
    }
});