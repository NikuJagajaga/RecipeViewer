/*

interface LootTips {
    pools: number;
    rolls: MinMax;
    count: MinMax;
    data: MinMax;
    weight: number;
    weight_sum: number;
    random_chance: number;
    killed_by_player: boolean;
}

interface LootRecipePattern extends RecipePattern {
    tips: LootTips[]
}


class LootRecipe extends RecipeType {

    private recipeList: RecipePattern[] = [];

    constructor(name: string, icon: number | Tile, description?: string){

        const elements: {[key: string]: Partial<UI.UIElement>} = {
            textName: {type: "text", x: 180, y: 20, font: {size: 40, color: Color.WHITE, shadow: 0.5}}
        };

        for(let i = 0; i < 18; i++){
            elements["output" + i] = {
                x: (i % 6) * 100 + 200,
                y: (i / 6 | 0) * 100 + 120,
                size: 100
            };
        }

        super(name, icon, {
            drawing: [],
            elements: elements
        });

        if(description){
            this.setDescription(description);
        }

    }

    getAllList(): RecipePattern[] {
        return this.recipeList;
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
        elements.get("textName").setBinding("text", recipe.name);
    }

    registerRecipe(name: string, json: KEX.LootModule.LootTableTypes.JsonFormat): void {

        const items: ItemInstanceWithTips[] = [];

        json.pools.forEach((pool, n) => {

            let condition: KEX.LootModule.LootTableTypes.Conditions;
            let entry: KEX.LootModule.LootTableTypes.Entries;
            let func: KEX.LootModule.LootTableTypes.EntryFunctions;

            let count: MinMax;
            let data: MinMax;

            let killed_by_player = false;
            let random_chance = 1;

            if(pool.conditions){

                for(let i = 0; i < pool.conditions.length; i++){

                    condition = pool.conditions[i];

                    switch(condition.condition){
                        case "killed_by_player":
                        case "killed_by_player_or_pets":
                            killed_by_player = true;
                        break;
                        case "random_chance":
                        case "random_chance_with_looting":
                            random_chance = condition.chance;
                        break;
                    }

                }

            }

            if(pool.entries){

                const weightSum = pool.entries.reduce((sum, ent) => {
                    if(ent.type === "item"){
                        return sum + (ent.weight || 0);
                    }
                    return sum;
                }, 0);

                for(let i = 0; i < pool.entries.length; i++){

                    entry = pool.entries[i];

                    switch(entry.type){

                        case "item":

                            count = unifyMinMax(entry.count || 1);
                            data = unifyMinMax(0);

                            if(entry.functions){
                                for(let j = 0; j < entry.functions.length; j++){
                                    func = entry.functions[j];
                                    switch(func.function){
                                        case "set_count":
                                            count = unifyMinMax(func.count);
                                        break;
                                        case "set_data":
                                            data = unifyMinMax(func.data);
                                        break;
                                    }
                                }
                            }

                            items.push({
                                id: getNumericID(entry.name),
                                count: Math.max(count.min, 1),
                                data: data && data.min === data.max ? data.min : -1,
                                tips: {
                                    pools: n,
                                    count: count,
                                    data: data,
                                    weight: entry.weight,
                                    weight_sum: weightSum,
                                    random_chance: random_chance,
                                    killed_by_player: killed_by_player
                                }
                            });

                        break;

                    }

                }

            }

        });

        this.recipeList.push({name: name, output: items});

    }

    slotTooltip(name: string, item: ItemInstance, tips: LootTips): string {
        let tooltip = "";
        tooltip += "Pool " + tips.pools;
        if(tips.random_chance){
            tooltip += " (" + (Math.round(tips.random_chance * 1000) / 10) + "%)";
        }
        tooltip += "\nrolls: " + MinMaxtoString(tips.rolls);
        tooltip += "\ncount: " + MinMaxtoString(tips.count);
        if(tips.weight){
            tooltip += `\nweight: ${tips.weight} (${Math.round(tips.weight / tips.weight_sum * 1000) / 10}%)`;
        }
        if(tips.killed_by_player){
            tooltip += "\nKilled By Player";
        }
        return "[" + name + "]\n" + tooltip;
    }

}


const MobDropRecipe = new LootRecipe("Mob Drop", VanillaItemID.iron_sword);

RecipeTypeRegistry.register("mob_drop", MobDropRecipe);


class BlockDropRecipe extends RecipeType {

    constructor(){

        const elements: {[key: string]: Partial<UI.UIElement>} = {
            input0: {x: 0, y: 0, size: 100}
        };

        for(let i = 0; i < 18; i++){
            elements["output" + i] = {
                x: (i % 6) * 100 + 200,
                y: (i / 6 | 0) * 100 + 120,
                size: 100
            };
        }

        super("Block Drop", VanillaItemID.iron_pickaxe, {
            drawing: [],
            elements: elements
        });

    }

    getAllList(): RecipePattern[] {
        const list: RecipePattern[] = [];
        ItemList.get().filter(iteminfo => iteminfo.type === "block").forEach(block => {
            const output: ItemInstance[] = [];
            const dropFunc = Block.getDropFunction(block.id);
            let drops: [number, number, number, number?][] = [];
            if(dropFunc){
                try{
                    drops = dropFunc({x: 0, y: 0, z: 0, relative: {x: 0, y: 0, z: 0}, side: -1}, block.id, block.data, 10, {silk: false, fortune: 0, efficiency: 0, unbreaking: 0, experience: 0}, {id: 0, count: 0, data: 0}, BlockSource.getDefaultForActor(Player.get())) || [];
                }
                catch(e){
                    return;
                }
            }
            if(drops.length > 0){
                list.push({
                    input: [{id: block.id, count: 1, data: block.data}],
                    output: drops.map(block => ({id: block[0], count: block[1], data: block[2]}))
                });
            }
        });
        return list;
    }

}

RecipeTypeRegistry.register("block_drop", new BlockDropRecipe());

*/