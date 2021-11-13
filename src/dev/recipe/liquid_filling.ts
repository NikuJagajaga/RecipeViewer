class LiquidFillingRecipe extends RecipeType {

    constructor(){
        super("Liquid Filling", VanillaItemID.bucket, {
            drawing: [
                {type: "frame", x: 450, y: 50, width: 100, height: 400, scale: 4, bitmap: "default_container_frame"},
                {type: "bitmap", x: 330 + 28, y: 190 + 28, scale: 1, bitmap: "_workbench_bar"},
                {type: "bitmap", x: 550 + 28, y: 190 + 28, scale: 1, bitmap: "_workbench_bar"}
            ],
            elements: {
                input0: {x: 210, y: 190, size: 120},
                output0: {x: 670, y: 190, size: 120},
                inputLiq0: {x: 450 + 4, y: 50 + 4, width: 100 - 8, height: 400 - 8}
            }
        });
        this.setTankLimit(1000);
    }

    getAllList(): RecipePattern[] {
        const list: RecipePattern[] = [];
        let empty: {id: number, data: number, liquid: string};
        let full: string[];
        for(let key in LiquidRegistry.EmptyByFull){
            empty = LiquidRegistry.EmptyByFull[key];
            full = key.split(":");
            list.push({
                input: [{id: empty.id, count: 1, data: empty.data}],
                output: [{id: +full[0], count: 1, data: +full[1]}],
                inputLiq: [{liquid: empty.liquid, amount: 1000}]
            });
        }
        return list;
    }

}


RecipeTypeRegistry.register("liquid_filling", new LiquidFillingRecipe());