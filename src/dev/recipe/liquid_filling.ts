class LiquidFillingRecipe extends RecipeType {

    constructor(){
        const top = 50;
        const size = 300;
        super("Liquid Filling", VanillaItemID.bucket, {
            drawing: [
                {type: "frame", x: 500 - size / 2, y: size * 2 + top, width: size, height: size, scale: 12, bitmap: "default_container_frame"},
                {type: "bitmap", x: 500 - 90, y: size + 18 + top, scale: 12, bitmap: "rv.arrow_down"}
            ],
            elements: {
                input0: {x: 500 - size / 2, y: top, size: size},
                output0: {x: 500 - size / 2, y: size * 3.75 + top, size: size},
                inputLiq0: {x: 500 - size / 2 + 12, y: size * 2 + 12 + top, width: size - 24, height: size - 24}
            }
        });
        this.setGridView(1, 3, true);
        this.setTankLimit(1000);
    }

    getAllList(): RecipePattern[] {

        const list: RecipePattern[] = [];
        let empty: {id: number, data: number, liquid: string, storage?: number};
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

        for(let key in LiquidItemRegistry.EmptyByFull){
            if(!!LiquidRegistry.getEmptyItem(+key, 0)) continue;
            empty = LiquidItemRegistry.EmptyByFull[key];
            list.push({
                input: [{id: empty.id, count: 1, data: empty.data}],
                output: [{id: +key, count: 1, data: 0}],
                inputLiq: [{liquid: empty.liquid, amount: empty.storage || 1000}]
            });
        }

        return list;

    }

}