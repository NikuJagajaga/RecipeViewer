interface VillagerWant {
    item: string;
    quantity: number | MinMax;
}

interface VillagerGive {
    item: string;
    functions: {
        function: string;
        treasure: boolean;
        levels: MinMax;
    }[];
}

interface VillagerTrade {
    wants: VillagerWant[];
    gives: [VillagerGive];
}

interface TradingJson {
    tiers: {
        trades: VillagerTrade[]
    }[];
}


class TradingRecipe extends RecipeType {

    private static convertToJobName(fileName: string): string {
        const suffix = "_trades.json";
        return fileName.endsWith(suffix) ? fileName.slice(0, -suffix.length).split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : fileName;
    }

    private static allTrade: RecipePattern[] = [];

    constructor(){
        super("Villager Trading", VanillaItemID.emerald, {
            drawing: [
                {type: "bitmap", x: 506, y: 199, scale: 6, bitmap: "rv.bar_trading"}
            ],
            elements: {
                input0: {x: 250, y: 190, size: 120},
                input1: {x: 370, y: 190, size: 120},
                output0: {x: 630, y: 190, size: 120},
                textCount0: {type: "text", x: 310, y: 310, font: {size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}},
                textCount1: {type: "text", x: 430, y: 310, font: {size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}},
                textInfo: {type: "text", x: 500, y: 80, font: {size: 40, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}},
                textEnch: {type: "text", x: 690, y: 310, font: {size: 30, color: Color.GREEN, shadow: 0.5, align: UI.Font.ALIGN_CENTER}}
            }
        });
        this.setDescription("Trade");
    }

    getAllList(): RecipePattern[] {
        return TradingRecipe.allTrade;
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
        elements.get("textInfo").setBinding("text", `Level ${recipe.info.tier} - ${recipe.info.job}`);
        elements.get("textCount0").setBinding("text", recipe.quantity[0] ? MinMaxtoString(recipe.quantity[0]) : "");
        elements.get("textCount1").setBinding("text", recipe.quantity[1] ? MinMaxtoString(recipe.quantity[1]) : "");
        elements.get("textEnch").setBinding("text", recipe.isEnchanted ? "Enchanted" : "");
    }

    static setup(): void {
        FileTools.GetListOfFiles(__packdir__ + "assets/behavior_packs/vanilla/trading/", ".json").forEach(file => {
            try{
                const json: TradingJson = BehaviorJsonReader.readJson(file.getAbsolutePath());
                const jobName = this.convertToJobName(file.getName());
                let i: number;
                let j: number;
                let trade: VillagerTrade;
                let input: Tile;
                let input2: Tile;
                let amount: number | MinMax;
                let amount2: number | MinMax;
                let output: Tile;
                for(i = 0; i < json.tiers.length; i++){
                    for(j = 0; j < json.tiers[i].trades.length; j++){
                        trade = json.tiers[i].trades[j];
                        input = BehaviorJsonReader.convertToItem(trade.wants[0].item);
                        amount = trade.wants[0].quantity;
                        if(trade.wants[1]){
                            input2 = BehaviorJsonReader.convertToItem(trade.wants[1].item);
                            amount2 = trade.wants[1].quantity;
                        }
                        else{
                            input2 = amount2 = null;
                        }
                        output = BehaviorJsonReader.convertToItem(trade.gives[0].item);
                        input && output && this.allTrade.push({
                            input: [
                                {id: input.id, count: amount && typeof amount === "number" ? amount : 1, data: input.data},
                                input2 ? {id: input2.id, count: amount2 && typeof amount2 === "number" ? amount2 : 1, data: input2.data} : {id: 0, count: 0, data: 0}
                            ],
                            output: [
                                {id: output.id, count: 1, data: output.data}
                            ],
                            quantity: [
                                typeof amount === "number" ? null : amount,
                                typeof amount2 === "number" ? null : amount2
                            ],
                            isEnchanted: trade.gives[0].functions && trade.gives[0].functions.some(func => func.function === "enchant_with_levels"),
                            info: {tier: i + 1, job: jobName}
                        });
                    }
                }
            }
            catch(e){
                alert("[RV]: TradeJson\n" + e);
            }
        });
    }

}