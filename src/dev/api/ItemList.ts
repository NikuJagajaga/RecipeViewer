const ItemIconSource = WRAP_JAVA("com.zhekasmirnov.innercore.api.mod.ui.icon.ItemIconSource").instance;

class ItemList {

    private static list: ItemInfo[] = [];

    static get(): ItemInfo[] {
        return this.list;
    }

    static getItemType(id: number): "block" | "item" {
        const info = IDRegistry.getIdInfo(id);
        if(info.startsWith("block")){
            return "block";
        }
        if(info.startsWith("item")){
            return "item";
        }
    }

    static addToList(id: number, data: number, type?: "block" | "item"): void {
        this.list.push({id: id, data: data, name: "", type: type || this.getItemType(id)});
    }

    static addToListByData(id: number, data: number | number[], type?: "block" | "item"): void {
        if(typeof data === "number"){
            for(let i = 0; i < data; i++){
                this.addToList(id, i, type);
            }
        }
        else{
            for(let i = 0; i < data.length; i++){
                this.addToList(id, data[i], type);
            }
        }
    }

    static addVanillaItems(): void {

        Object.keys(FileTools.ReadJSON(__packdir__ + "assets/innercore/icons/block_models.json")).forEach(key => {
            const split = key.split(":");
            let id: number;
            let data: number;
            if (split.length === 2) {
                id = +split[0];
                data = +split[1];
                !isNaN(id) && !isNaN(data) && this.addToList(Block.convertBlockToItemId(id), data, "block");
            }
            else if(split.length === 1){
                id = +split[0];
                if(isNaN(id)){
                    id = VanillaBlockID[split[0]];
                }
                !isNaN(id) && this.addToList(Block.convertBlockToItemId(id), -1, "block");
            }
        });

        Object.keys(FileTools.ReadJSON(__packdir__ + "assets/innercore/icons/item_textures.json")).forEach(key => {
            const split = key.split(":");
            let id: number;
            let data: number;
            if (split.length === 2) {
                id = +split[0];
                data = +split[1];
                !isNaN(id) && !isNaN(data) && this.addToList(id, data, "item");
            }
            else if(split.length === 1){
                id = +split[0];
                if(isNaN(id)){
                    id = VanillaItemID[split[0]];
                }
                !isNaN(id) && this.addToList(id, -1, "item");
            }
        });

    }

    static addModItems(): void {

        let recipes: java.util.Collection<Recipes.WorkbenchRecipe>;
        let it: java.util.Iterator<Recipes.WorkbenchRecipe>;
        let item: ItemInstance;

        for(let key in BlockID){
            recipes = Recipes.getWorkbenchRecipesByResult(BlockID[key], -1, -1);
            if(recipes.isEmpty()){
                this.addToList(BlockID[key], 0, "block");
                continue;
            }
            it = recipes.iterator();
            while(it.hasNext()){
                item = it.next().getResult();
                this.addToList(item.id, item.data, "block");
            }
        }

        for(let key in ItemID){
            this.addToList(ItemID[key], 0, "item");
        }

    }

    static getName(id: number, data?: number): string {
        /*
        const find = this.list.find(item => item.id === id && item.data === data);
        if(find && find.name){
            return find.name;
        }
        */
        let name = "";
        try{
            name = Item.getName(id, data === -1 ? 0 : data);
        }
        catch(e){
            alert(e);
            name = "name name";
        }
        let index = name.indexOf("\n");
        if(index !== -1){
            name = name.slice(0, index);
        }
        index = name.indexOf("§");
        if(index !== -1){
            name = name.slice(0, index) + name.slice(index + 2);
        }
        return name;
    }

    static setup(): void {
        this.list = this.list.filter(item => Item.isValid(item.id, item.data)).filter(removeDuplicateFilterFunc);
        this.list.forEach(item => {
            item.name = this.getName(item.id, item.data);
        });
    }

    static cacheIcons(): void {
        this.list.forEach(item => {
            ItemIconSource.getScaledIcon(item.id, item.data, 16);
        });
    }

}