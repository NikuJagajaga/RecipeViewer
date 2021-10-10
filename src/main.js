var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Color = android.graphics.Color;
var ScreenHeight = UI.getScreenHeight();
var isLegacy = getMCPEVersion().array[1] === 11;
var Math_clamp = function (value, min, max) { return Math.min(Math.max(value, min), max); };
var removeDuplicateFilterFunc = function (item1, index, array) { return array.findIndex(function (item2) { return item1.id === item2.id && item1.data === item2.data && item1.type === item2.type; }) === index; };
var isBlockID = function (id) {
    var info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("block");
};
var isItemID = function (id) {
    var info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("item");
};
var Context = UI.getContext();
var runOnUiThread = function (func) {
    Context.runOnUiThread(new java.lang.Runnable({
        run: function () {
            try {
                func();
            }
            catch (e) {
                alert(e);
            }
        }
    }));
};
var BehaviorTools = /** @class */ (function () {
    function BehaviorTools() {
    }
    BehaviorTools.readJson = function (path) {
        var reader = new java.io.BufferedReader(new java.io.FileReader(path));
        var lines = [];
        var str;
        var i;
        while (str = reader.readLine()) {
            //str.trim().startsWith("//") || lines.push(str);
            i = str.indexOf("//");
            lines.push(i === -1 ? str : str.slice(0, i));
        }
        reader.close();
        try {
            return JSON.parse(lines.join("\n")) || null;
        }
        catch (e) {
            return null;
        }
    };
    BehaviorTools.readListOfJson = function (path) {
        var dir = new java.io.File(path);
        var files = dir.listFiles();
        var list = [];
        var json;
        for (var i = 0; i < files.length; i++) {
            if (!files[i].isDirectory() && files[i].getName().endsWith(".json")) {
                json = this.readJson(files[i].getAbsolutePath());
                json && list.push(json);
            }
        }
        return list;
    };
    BehaviorTools.getNumericID = function (key) {
        if (!key.startsWith("minecraft:")) {
            return 0;
        }
        var key2 = key.substr(10);
        var array = key2.split("_");
        var slice = array.slice(1);
        var id;
        if (array[0] === "block") {
            id = BlockID[slice.join("_")];
            if (id) {
                return id;
            }
            var key3 = slice[0];
            for (var i = 1; i < slice.length; i++) {
                key3 += slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
            }
            id = BlockID[key3];
            if (id) {
                return id;
            }
        }
        if (array[0] === "item") {
            id = ItemID[array.slice(1).join("_")];
            if (id) {
                return id;
            }
            var key3 = slice[0];
            for (var i = 1; i < slice.length; i++) {
                key3 += slice[i].charAt(0).toUpperCase() + slice[i].slice(1);
            }
            id = ItemID[key3];
            if (id) {
                return id;
            }
        }
        return VanillaBlockID[key2] || VanillaItemID[key2] || 0;
    };
    BehaviorTools.convertToItem = function (str) {
        var split = str.split(":");
        if (split.length >= 2 && split[0] === "minecraft") {
            var key = split[1].toLowerCase();
            var id = VanillaBlockID[key] || VanillaItemID[key];
            if (id) {
                return { id: id, data: +split[2] || -1 };
            }
        }
        return null;
    };
    BehaviorTools.convertToItemForPotion = function (str) {
        var suffix = "minecraft:potion_type:";
        if (str.startsWith(suffix)) {
        }
        var split = str.split(":");
        if (split.length >= 2 && split[0] === "minecraft") {
            var key = split[1].toLowerCase();
            var id = VanillaBlockID[key] || VanillaItemID[key];
            var data = this.potionMeta[split[2]];
            if (id) {
                return { id: id, data: +split[2] || -1 };
            }
        }
        return null;
    };
    BehaviorTools.potionMeta = {};
    return BehaviorTools;
}());
var ItemList = /** @class */ (function () {
    function ItemList() {
    }
    ItemList.get = function () {
        return this.list;
    };
    ItemList.getItemType = function (id) {
        var info = IDRegistry.getIdInfo(id);
        if (info.startsWith("block")) {
            return "block";
        }
        if (info.startsWith("item")) {
            return "item";
        }
    };
    ItemList.addToList = function (id, data, type) {
        this.list.push({ id: id, data: data, name: "", type: type || this.getItemType(id) });
    };
    ItemList.addToListByData = function (id, data, type) {
        if (typeof data === "number") {
            for (var i = 0; i < data; i++) {
                this.addToList(id, i, type);
            }
        }
        else {
            for (var i = 0; i < data.length; i++) {
                this.addToList(id, data[i], type);
            }
        }
    };
    ItemList.addVanillaItems = function () {
        var _this = this;
        Object.keys(FileTools.ReadJSON(__packdir__ + "assets/innercore/icons/block_models.json")).forEach(function (key) {
            var split = key.split(":");
            var id;
            var data;
            if (split.length === 2) {
                id = +split[0];
                data = +split[1];
                !isNaN(id) && !isNaN(data) && _this.addToList(Block.convertBlockToItemId(id), data, "block");
            }
            else if (split.length === 1) {
                id = +split[0];
                if (isNaN(id)) {
                    id = VanillaBlockID[split[0]];
                }
                !isNaN(id) && _this.addToList(Block.convertBlockToItemId(id), -1, "block");
            }
        });
        Object.keys(FileTools.ReadJSON(__packdir__ + "assets/innercore/icons/item_textures.json")).forEach(function (key) {
            var split = key.split(":");
            var id;
            var data;
            if (split.length === 2) {
                id = +split[0];
                data = +split[1];
                !isNaN(id) && !isNaN(data) && _this.addToList(id, data, "item");
            }
            else if (split.length === 1) {
                id = +split[0];
                if (isNaN(id)) {
                    id = VanillaItemID[split[0]];
                }
                !isNaN(id) && _this.addToList(id, -1, "item");
            }
        });
    };
    ItemList.addModItems = function () {
        var recipes;
        var it;
        var item;
        for (var key in BlockID) {
            recipes = Recipes.getWorkbenchRecipesByResult(BlockID[key], -1, -1);
            if (recipes.isEmpty()) {
                this.addToList(BlockID[key], 0, "block");
                continue;
            }
            it = recipes.iterator();
            while (it.hasNext()) {
                item = it.next().getResult();
                this.addToList(item.id, item.data, "block");
            }
        }
        for (var key in ItemID) {
            this.addToList(ItemID[key], 0, "item");
        }
    };
    ItemList.getName = function (id, data) {
        var name = "";
        try {
            name = Item.getName(id, data === -1 ? 0 : data);
        }
        catch (e) {
            alert(e);
            name = "name name";
        }
        var index = name.indexOf("\n");
        if (index !== -1) {
            name = name.slice(0, index);
        }
        index = name.indexOf("§");
        if (index !== -1) {
            name = name.slice(0, index) + name.slice(index + 2);
        }
        return name;
    };
    ItemList.setup = function () {
        var _this = this;
        this.list = this.list.filter(function (item) { return Item.isValid(item.id, item.data); }).filter(removeDuplicateFilterFunc);
        this.list.forEach(function (item) {
            item.name = _this.getName(item.id, item.data);
        });
    };
    ItemList.list = [];
    return ItemList;
}());
var UiFuncs;
(function (UiFuncs) {
    UiFuncs.slotClicker = {
        onClick: function (container, tile, elem) {
            SubUI.openItemView(elem.source.id, elem.source.data, false) && UiFuncs.show404Anim(elem);
        },
        onLongClick: function (container, tile, elem) {
            SubUI.openItemView(elem.source.id, elem.source.data, true) && UiFuncs.show404Anim(elem);
        }
    };
    UiFuncs.tankClicker = {
        onClick: function (container, tile, elem) {
            SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), false) && UiFuncs.show404Anim(elem);
        },
        onLongClick: function (container, tile, elem) {
            SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), true) && UiFuncs.show404Anim(elem);
        }
    };
    UiFuncs.genOverlayWindow = function () {
        var window = new UI.Window({
            location: { x: 0, y: 0, width: 1000, height: ScreenHeight },
            drawing: [{ type: "background", color: Color.TRANSPARENT }],
            elements: {
                popupFrame: {
                    type: "scale",
                    x: -1000,
                    y: -1000,
                    width: 64,
                    height: 64,
                    scale: 3,
                    bitmap: "workbench_frame3",
                    value: 1
                },
                popupText: {
                    type: "text",
                    x: -1000,
                    y: -1000,
                    z: 1,
                    font: { color: Color.WHITE, size: 24, shadow: 0.5, align: UI.Font.ALIGN_CENTER }
                },
                notFound: {
                    type: "text",
                    x: -1000,
                    y: -1000,
                    text: "404",
                    font: { color: Color.RED, size: 32, shadow: 0.5, align: UI.Font.ALIGN_CENTER }
                }
            }
        });
        window.setTouchable(false);
        window.setAsGameOverlay(true);
        window.setEventListener({
            onOpen: function (win) {
                var elems = win.getElements();
                elems.get("popupText").setPosition(-1000, -1000);
                elems.get("popupFrame").setPosition(-1000, -1000);
                elems.get("notFound").setPosition(-1000, -1000);
            }
        });
        return window;
    };
    UiFuncs.moveOverlayOnTop = function (winGroup) {
        if (!winGroup.isOpened()) {
            winGroup.moveOnTop("overlay");
            return;
        }
        var ovl = winGroup.getWindow("overlay");
        ovl.setParentWindow(null);
        ovl.close();
        ovl.setParentWindow(winGroup);
        ovl.open();
    };
    UiFuncs.popupTips = function (str, elem, event) {
        var elements = elem.window.getParentWindow().getElements();
        var text = elements.get("popupText");
        var frame = elements.get("popupFrame");
        if (str && event.type == "MOVE") {
            var frameTex = UI.FrameTextureSource.get("workbench_frame3");
            var width = McFontPaint.measureText(str) + 30;
            var location = elem.window.getLocation();
            var x = location.x + location.windowToGlobal(event.x);
            var y = location.y + location.windowToGlobal(event.y);
            frame.setSize(width, 48);
            frame.setBinding("texture", frameTex.expandAndScale(width, 48, 3, frameTex.getCentralColor()));
            frame.setPosition(Math_clamp(x - width / 2, 0, 1000 - width), Math.max(y - 100, 0));
            text.setPosition(Math_clamp(x, width / 2, 1000 - width / 2), Math.max(y - 100, 0) - 3);
            text.setBinding("text", str);
        }
        else {
            frame.setPosition(-1000, -1000);
            text.setPosition(-1000, -1000);
        }
    };
    UiFuncs.onTouchSlot = function (elem, event) {
        UiFuncs.popupTips(elem.source.id !== 0 ? ItemList.getName(elem.source.id, elem.source.data) : "", elem, event);
    };
    UiFuncs.onTouchTank = function (elem, event) {
        var liquid = RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + "");
        UiFuncs.popupTips(LiquidRegistry.isExists(liquid) ? LiquidRegistry.getLiquidName(liquid) : "", elem, event);
    };
    UiFuncs.show404Anim = function (elem) {
        var window = elem.window.getParentWindow();
        var text = window.getElements().get("notFound");
        var location = elem.window.getLocation();
        var x = location.x + location.windowToGlobal(elem.elementRect.centerX());
        var y = location.y + location.windowToGlobal(elem.elementRect.centerY()) - 32;
        Threading.initThread("rv_404Anim", function () {
            var step = 0;
            while (window.isOpened() && step <= 3) {
                step & 1 ? text.setPosition(-1000, -1000) : text.setPosition(x, y);
                step++;
                java.lang.Thread.sleep(200);
            }
        });
    };
})(UiFuncs || (UiFuncs = {}));
var McFontPaint = (function () {
    var NativeAPI = ModAPI.requireGlobal("requireMethodFromNativeAPI");
    var getMcTypeface = NativeAPI("utils.FileTools", "getMcTypeface");
    var paint = new android.graphics.Paint();
    paint.setTypeface(getMcTypeface());
    paint.setTextSize(24);
    return paint;
})();
var RecipeType = /** @class */ (function () {
    function RecipeType(name, icon, content) {
        this.name = name;
        this.elems = { input: [], output: [], inputLiq: [], outputLiq: [] };
        this.window = new UI.Window();
        this.icon = typeof icon === "number" ? { id: icon, count: 1, data: 0 } : __assign(__assign({}, icon), { count: 1 });
        content.params = content.params || {};
        content.params.slot = content.params.slot || "_default_slot_light";
        content.drawing = content.drawing || [];
        content.drawing.some(function (elem) { return elem.type === "background"; }) || content.drawing.unshift({ type: "background", color: Color.TRANSPARENT });
        var templateSlot = { type: "slot", visual: true, clicker: UiFuncs.slotClicker, onTouchEvent: UiFuncs.onTouchSlot };
        var templateTank = { type: "scale", direction: 1, clicker: UiFuncs.tankClicker, onTouchEvent: UiFuncs.onTouchTank };
        var isInputSlot;
        var isOutputSlot;
        var isInputTank;
        var isOutputTank;
        var inputSlotSize = 0;
        var outputSlotSize = 0;
        var inputTankSize = 0;
        var outputTankSize = 0;
        for (var key in content.elements) {
            isInputTank = key.startsWith("inputLiq");
            isOutputTank = key.startsWith("outputLiq");
            isInputSlot = key.startsWith("input") && !isInputTank;
            isOutputSlot = key.startsWith("output") && !isOutputTank;
            if (isInputSlot || isOutputSlot) {
                content.elements[key] = __assign(__assign({}, templateSlot), content.elements[key]);
                isInputSlot && inputSlotSize++;
                isOutputSlot && outputSlotSize++;
            }
            if (isInputTank || isOutputTank) {
                content.elements[key] = __assign(__assign({}, templateTank), content.elements[key]);
                isInputTank && inputTankSize++;
                isOutputTank && outputTankSize++;
            }
        }
        //@ts-ignore
        this.window.setContent({ location: { x: 230, y: 55, width: 600, height: 340 }, params: content.params, drawing: content.drawing, elements: content.elements });
        var elements = this.window.getElements();
        for (var i = 0; i < inputSlotSize; i++) {
            this.elems.input[i] = elements.get("input" + i);
        }
        for (var i = 0; i < outputSlotSize; i++) {
            this.elems.output[i] = elements.get("output" + i);
        }
        for (var i = 0; i < inputTankSize; i++) {
            this.elems.inputLiq[i] = elements.get("inputLiq" + i);
        }
        for (var i = 0; i < outputTankSize; i++) {
            this.elems.outputLiq[i] = elements.get("outputLiq" + i);
        }
    }
    RecipeType.prototype.setDescription = function (text) {
        this.description = text;
        return this;
    };
    RecipeType.prototype.setTankLimit = function (limit) {
        this.tankLimit = limit;
        return this;
    };
    RecipeType.prototype.getName = function () {
        return this.name;
    };
    RecipeType.prototype.getIcon = function () {
        return this.icon;
    };
    RecipeType.prototype.getDescription = function () {
        return this.description || "";
    };
    RecipeType.prototype.getWindow = function () {
        return this.window;
    };
    RecipeType.prototype.getList = function (id, data, isUsage) {
        var list = this.getAllList();
        return isUsage ?
            list.filter(function (recipe) { return recipe.input ? recipe.input.some(function (item) { return item.id === id && (data === -1 || item.data === data); }) : false; }) :
            list.filter(function (recipe) { return recipe.output ? recipe.output.some(function (item) { return item.id === id && (data === -1 || item.data === data); }) : false; });
    };
    RecipeType.prototype.getListByLiquid = function (liquid, isUsage) {
        var list = this.getAllList();
        return isUsage ?
            list.filter(function (recipe) { return recipe.inputLiq ? recipe.inputLiq.some(function (liq) { return liq.liquid === liquid; }) : false; }) :
            list.filter(function (recipe) { return recipe.outputLiq ? recipe.outputLiq.some(function (liq) { return liq.liquid === liquid; }) : false; });
    };
    RecipeType.prototype.hasAnyRecipe = function (id, data, isUsage) {
        var list = this.getAllList();
        if (list.length === 0) {
            return this.getList(id, data, isUsage).length > 0;
        }
        return isUsage ?
            list.some(function (recipe) { return recipe.input ? recipe.input.some(function (item) { return item && item.id === id && (data === -1 || item.data === data); }) : false; }) :
            list.some(function (recipe) { return recipe.output ? recipe.output.some(function (item) { return item && item.id === id && (data === -1 || item.data === data); }) : false; });
    };
    RecipeType.prototype.hasAnyRecipeByLiquid = function (liquid, isUsage) {
        var list = this.getAllList();
        if (list.length === 0) {
            return this.getListByLiquid(liquid, isUsage).length > 0;
        }
        return isUsage ?
            list.some(function (recipe) { return recipe.inputLiq ? recipe.inputLiq.some(function (liq) { return liq && liq.liquid === liquid; }) : false; }) :
            list.some(function (recipe) { return recipe.outputLiq ? recipe.outputLiq.some(function (liq) { return liq && liq.liquid === liquid; }) : false; });
    };
    RecipeType.prototype.onOpen = function (elements, recipe) {
    };
    RecipeType.prototype.showRecipe = function (recipe) {
        var _this = this;
        this.onOpen(this.window.getElements(), recipe);
        var empty = { id: 0, count: 0, data: 0 };
        this.elems.input.forEach(function (elem, i) {
            elem.setBinding("source", recipe.input ? (recipe.input[i] || empty) : empty);
        });
        this.elems.output.forEach(function (elem, i) {
            elem.setBinding("source", recipe.output ? (recipe.output[i] || empty) : empty);
        });
        this.elems.inputLiq.forEach(function (elem, i) {
            if (recipe.inputLiq && recipe.inputLiq[i]) {
                elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq[i].liquid, elem.elementRect.width(), elem.elementRect.height()));
                elem.setBinding("value", recipe.inputLiq[i].amount / _this.tankLimit);
            }
            else {
                elem.setBinding("value", 0);
            }
        });
        this.elems.outputLiq.forEach(function (elem, i) {
            if (recipe.outputLiq && recipe.outputLiq[i]) {
                elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.outputLiq[i].liquid, elem.elementRect.width(), elem.elementRect.height()));
                elem.setBinding("value", recipe.outputLiq[i].amount / _this.tankLimit);
            }
            else {
                elem.setBinding("value", 0);
            }
        });
    };
    return RecipeType;
}());
var RecipeTypeRegistry = /** @class */ (function () {
    function RecipeTypeRegistry() {
    }
    RecipeTypeRegistry.register = function (key, recipeType) {
        this.types[key] = recipeType;
    };
    RecipeTypeRegistry.get = function (key) {
        return this.types[key];
    };
    RecipeTypeRegistry.isExist = function (key) {
        return key in this.types;
    };
    RecipeTypeRegistry.delete = function (key) {
        delete this.types[key];
    };
    RecipeTypeRegistry.getAllKeys = function () {
        return Object.keys(this.types);
    };
    RecipeTypeRegistry.getLength = function () {
        return this.getAllKeys().length;
    };
    RecipeTypeRegistry.getActiveType = function (id, data, isUsage) {
        var array = [];
        for (var key in this.types) {
            try {
                this.types[key].hasAnyRecipe(id, data, isUsage) && array.push(key);
            }
            catch (e) {
                alert('[RV] RecipeType "' + key + '" has been deleted.\n' + e);
                delete this.types[key];
            }
        }
        return array;
    };
    RecipeTypeRegistry.getActiveTypeByLiquid = function (liquid, isUsage) {
        var array = [];
        for (var key in this.types) {
            try {
                this.types[key].hasAnyRecipeByLiquid(liquid, isUsage) && array.push(key);
            }
            catch (e) {
                alert('[RV] RecipeType "' + key + '" has been deleted.\n' + e);
                delete this.types[key];
            }
        }
        return array;
    };
    RecipeTypeRegistry.openRecipePage = function (recipeKey) {
        SubUI.openListView(typeof recipeKey === "string" ? [recipeKey] : recipeKey);
    };
    RecipeTypeRegistry.getLiquidByTex = function (texture) {
        for (var key in LiquidRegistry.liquids) {
            if (LiquidRegistry.liquids[key].uiTextures.some(function (tex) {
                return tex === texture;
            })) {
                return key;
            }
        }
        return "";
    };
    RecipeTypeRegistry.types = {};
    return RecipeTypeRegistry;
}());
var OldRecipeType = /** @class */ (function (_super) {
    __extends(OldRecipeType, _super);
    function OldRecipeType(obj) {
        var _this = _super.call(this, obj.title || "", obj.contents.icon, {
            params: obj.contents.params,
            drawing: obj.contents.drawing,
            elements: obj.contents.elements,
        }) || this;
        _this.recipeList = obj.recipeList || undefined;
        _this.funcs = {
            getList: obj.getList,
            getAllList: obj.getAllList,
            onOpen: obj.onOpen
        };
        return _this;
    }
    OldRecipeType.prototype.getAllList = function () {
        if (this.recipeList) {
            return this.recipeList;
        }
        if (this.funcs.getAllList) {
            return this.funcs.getAllList();
        }
        return [];
    };
    OldRecipeType.prototype.getList = function (id, data, isUsage) {
        if (this.funcs.getList) {
            return this.funcs.getList(id, data, isUsage);
        }
        return _super.prototype.getList.call(this, id, data, isUsage);
    };
    OldRecipeType.prototype.onOpen = function (elements, recipe) {
        this.funcs.onOpen && this.funcs.onOpen(elements, recipe);
    };
    return OldRecipeType;
}(RecipeType));
var OldVersion = /** @class */ (function () {
    function OldVersion() {
    }
    OldVersion.registerRecipeType = function (key, obj) {
        RecipeTypeRegistry.register(key, new OldRecipeType(obj));
    };
    OldVersion.getIOFromTEWorkbench = function (recipe, cols) {
        var array = [];
        var item;
        switch (recipe.type) {
            case "grid":
                for (var i = 0; i < recipe.recipe.length; i++) {
                    for (var j = 0; j < recipe.recipe[i].length; j++) {
                        item = recipe.ingridients[recipe.recipe[i][j]];
                        if (item) {
                            array[i * cols + j] = { id: item.id, count: 1, data: item.data || 0 };
                        }
                    }
                }
                break;
            case "line":
                for (var i = 0; i < recipe.recipe.length; i++) {
                    item = recipe.ingridients[recipe.recipe[i]];
                    if (item) {
                        array[i] = { id: item.id, count: 1, data: item.data || 0 };
                    }
                }
                break;
            case "not_shape":
                for (var key in recipe.ingridients) {
                    item = recipe.ingridients[key];
                    for (var i = 0; i < item.count; i++) {
                        array.push({ id: item.id, count: 1, data: item.data || 0 });
                    }
                }
                break;
        }
        return { input: array, output: [recipe.result] };
    };
    OldVersion.registerTEWorkbenchRecipeType = function (sid, contents, recipes) {
        var _this = this;
        var tile = TileEntity.getPrototype(BlockID[sid]);
        var cols = tile.Columns || tile.columns || tile.Cols || tile.cols || tile.Slots || tile.slots;
        var rows = tile.Rows || tile.rows;
        contents.icon = BlockID[sid];
        this.registerRecipeType("TE_" + sid, {
            title: "",
            contents: contents,
            getList: function (id, data, isUsage) {
                var list = [];
                if (isUsage) {
                    var key = "";
                    for (var i = 0; i < recipes.length; i++) {
                        for (key in recipes[i].ingridients) {
                            if (recipes[i].ingridients[key].id === id && (data === -1 || !recipes[i].ingridients[key].data || (recipes[i].ingridients[key].data || 0) === data)) {
                                list.push(_this.getIOFromTEWorkbench(recipes[i], cols));
                                break;
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < recipes.length; i++) {
                        recipes[i].result.id === id && (data === -1 || recipes[i].result.data === data) && list.push(_this.getIOFromTEWorkbench(recipes[i], cols));
                    }
                }
                return list;
            }
        });
    };
    OldVersion.getName = function (id, data) {
        return ItemList.getName(id, data);
    };
    OldVersion.addList = function (id, data, type) {
        ItemList.addToList(id, data, type);
    };
    ;
    OldVersion.addListByData = function (id, data, type) {
        ItemList.addToListByData(id, data, type);
    };
    OldVersion.openRecipePage = function (key, container) {
        RecipeTypeRegistry.openRecipePage(key);
    };
    OldVersion.putButtonOnNativeGui = function (screen, key) {
        RButton.putOnNativeGui(screen, key);
    };
    OldVersion.removeDuplicate = removeDuplicateFilterFunc;
    return OldVersion;
}());
var StartButton = new UI.Window({
    location: { x: 0, y: 0, width: 64, height: 64 },
    elements: {
        button: {
            type: "button",
            x: 0, y: 0, scale: 62.5,
            bitmap: "default_button_up", bitmap2: "default_button_down",
            clicker: {
                onClick: function () {
                    MainUI.openWindow();
                },
                onLongClick: function () {
                    var list = [];
                    var inv;
                    for (var i = 0; i <= 36; i++) {
                        inv = Player.getInventorySlot(i);
                        inv.id && list.push({ id: inv.id, data: inv.data, name: ItemList.getName(inv.id, inv.data), type: ItemList.getItemType(inv.id) });
                    }
                    MainUI.openWindow(list.filter(removeDuplicateFilterFunc));
                }
            }
        },
        text: {
            type: "text",
            x: 300, y: 120, z: 1,
            text: "R",
            font: { color: Color.WHITE, size: 600, shadow: 0.5 }
        }
    }
});
StartButton.setAsGameOverlay(true);
var InventoryScreen = {
    inventory_screen: true,
    inventory_screen_pocket: true,
    survival_inventory_screen: true,
    creative_inventory_screen: true
};
Callback.addCallback("NativeGuiChanged", function (screen) {
    InventoryScreen[screen] ? StartButton.open() : StartButton.close();
});
var MainUI = /** @class */ (function () {
    function MainUI() {
    }
    MainUI.switchWindow = function (liquidMode, force) {
        if (!force && this.liquidMode === liquidMode) {
            return;
        }
        this.liquidMode = liquidMode;
        this.page = 0;
        this.window.addWindowInstance("list", liquidMode ? this.listWindow.liquid : this.listWindow.item);
        UiFuncs.moveOverlayOnTop(this.window);
        this.updateWindow();
    };
    MainUI.changeSortMode = function (notChange) {
        var elements = this.window.getElements();
        notChange || this.currentSortMode++;
        this.currentSortMode %= this.sortMode.length;
        var mode = this.sortMode[this.currentSortMode];
        elements.get("textSort").setBinding("text", mode.text);
        this.list.sort(this.sortFunc[mode.type]);
        mode.reverse && this.list.reverse();
        this.page = 0;
    };
    MainUI.updateWindow = function () {
        var elements = this.window.getElements();
        var maxPage = this.liquidMode ? (this.liqList.length / this.tankCount | 0) + 1 : (this.list.length / this.slotCount | 0) + 1;
        this.page = this.page < 0 ? maxPage - 1 : this.page >= maxPage ? 0 : this.page;
        elements.get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);
        if (this.liquidMode) {
            elements = this.listWindow.liquid.getElements();
            var elem = void 0;
            var liquid = void 0;
            for (var i = 0; i < this.tankCount; i++) {
                elem = elements.get("tank" + i);
                liquid = this.liqList[this.tankCount * this.page + i];
                if (liquid) {
                    elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(liquid, elem.elementRect.width(), elem.elementRect.height()));
                    elem.setBinding("value", 1);
                }
                else {
                    elem.setBinding("texture", "");
                    elem.setBinding("value", 0);
                }
            }
        }
        else {
            elements = this.listWindow.item.getElements();
            var item = void 0;
            for (var i = 0; i < this.slotCount; i++) {
                item = this.list[this.slotCount * this.page + i];
                elements.get("slot" + i).setBinding("source", item ? { id: item.id, count: 1, data: item.data } : { id: 0, count: 0, data: 0 });
            }
        }
    };
    MainUI.openWindow = function (list) {
        if (list === void 0) { list = ItemList.get(); }
        this.list = list;
        this.liqList = Object.keys(LiquidRegistry.liquids);
        this.window.open();
        this.changeSortMode(true);
        this.switchWindow(false, true);
    };
    var _a;
    _a = MainUI;
    MainUI.page = 0;
    MainUI.list = [];
    MainUI.liquidMode = false;
    MainUI.liqList = [];
    MainUI.currentSortMode = 0;
    MainUI.sortMode = [
        { text: "Sort by ID (ASC)", type: "id", reverse: false },
        { text: "Sort by ID (DESC)", type: "id", reverse: true },
        { text: "Sort by Name (ASC)", type: "name", reverse: false },
        { text: "Sort by Name (DESC)", type: "name", reverse: true }
    ];
    MainUI.sortFunc = {
        id: function (a, b) {
            if (a.type === "block" && b.type === "item") {
                return -1;
            }
            if (a.type === "item" && b.type === "block") {
                return 1;
            }
            return Block.convertItemToBlockId(a.id) - Block.convertItemToBlockId(b.id) || a.data - b.data;
        },
        name: function (a, b) {
            return a.name > b.name ? 1 : -1;
        }
    };
    MainUI.slotCountX = 12;
    MainUI.slotCountY = (function () {
        var slotSize = 960 / _a.slotCountX;
        var slotCountY = 0;
        for (var y = 68; y <= ScreenHeight - 80 - slotSize; y += slotSize) {
            slotCountY++;
        }
        return slotCountY;
    })();
    MainUI.slotCount = _a.slotCountX * _a.slotCountY;
    MainUI.tankCount = 8;
    MainUI.listWindow = (function () {
        var width = 960;
        var height = _a.slotCountY * (960 / _a.slotCountX);
        var location = {
            x: 20,
            y: 68,
            width: width,
            height: height,
        };
        var slotSize = 1000 / _a.slotCountX;
        var elemSlot = {};
        for (var i = 0; i < _a.slotCount; i++) {
            elemSlot["slot" + i] = {
                type: "slot",
                x: (i % _a.slotCountX) * slotSize,
                y: (i / _a.slotCountX | 0) * slotSize,
                size: slotSize,
                visual: true,
                clicker: UiFuncs.slotClicker,
                onTouchEvent: UiFuncs.onTouchSlot
            };
        }
        var bgColor = UI.FrameTextureSource.get("classic_frame_slot").getCentralColor();
        var winSlot = new UI.Window({
            location: location,
            params: { slot: "_default_slot_empty" },
            drawing: [
                { type: "background", color: bgColor }
            ],
            elements: elemSlot
        });
        var drawTank = [{ type: "background", color: bgColor }];
        var elemTank = {};
        for (var i = 0; i < _a.tankCount; i++) {
            drawTank.push({
                type: "frame",
                x: 30 + i * 120,
                y: 50,
                width: 100,
                height: height - 100,
                bitmap: "default_container_frame",
                scale: 3
            });
            elemTank["tank" + i] = {
                type: "scale",
                x: 33 + i * 120,
                y: 53,
                width: 94,
                height: height - 106,
                bitmap: "_liquid_water_texture_0",
                value: 1,
                clicker: UiFuncs.tankClicker,
                onTouchEvent: UiFuncs.onTouchTank
            };
        }
        var winTank = new UI.Window({
            location: location,
            drawing: drawTank,
            elements: elemTank
        });
        return { item: winSlot, liquid: winTank };
    })();
    MainUI.window = (function () {
        var window = new UI.WindowGroup();
        var elements = {
            buttonClose: {
                type: "closeButton",
                x: 1000 - 45 - 9, y: 9, scale: 3,
                bitmap: "classic_close_button", bitmap2: "classic_close_button_down"
            },
            buttonSearch: {
                type: "button",
                x: 20, y: 16, scale: 0.8,
                bitmap: "mod_browser_search_field",
                clicker: {
                    onClick: function () {
                        runOnUiThread(function () {
                            var editText = new android.widget.EditText(Context);
                            editText.setHint("in this space");
                            new android.app.AlertDialog.Builder(Context)
                                .setTitle("Please type the keywords")
                                .setView(editText)
                                .setPositiveButton("Search", new android.content.DialogInterface.OnClickListener({
                                onClick: function () {
                                    var elements = _a.window.getElements();
                                    var keyword = editText.getText() + "";
                                    var regexp = new RegExp(keyword, "i");
                                    elements.get("textSearch").setBinding("text", keyword.length ? keyword : "Search");
                                    _a.list = ItemList.get().filter(function (item) { return item.name.match(regexp); });
                                    _a.liqList = Object.keys(LiquidRegistry.liquids).filter(function (liquid) { return LiquidRegistry.getLiquidName(liquid).match(regexp); });
                                    _a.page = 0;
                                    _a.updateWindow();
                                }
                            })).show();
                        });
                    }
                }
            },
            textSearch: {
                type: "text",
                x: 30, y: 26, z: 1,
                font: { color: Color.WHITE, size: 20 },
                text: "Search"
            },
            buttonSort: {
                type: "button",
                x: 450, y: 16, scale: 0.8,
                bitmap: "mod_browser_button", bitmap2: "mod_browser_button_down",
                clicker: { onClick: function () {
                        _a.changeSortMode();
                        _a.updateWindow();
                    } }
            },
            textSort: {
                type: "text",
                x: 465, y: 26, z: 1,
                text: "",
                font: { color: Color.WHITE, size: 16, shadow: 0.5 }
            },
            switchMode: { type: "switch", x: 753, y: 20, scale: 2, onNewState: function (state) {
                    World.isWorldLoaded() && _a.switchWindow(!!state);
                } }
        };
        var slotSize = 960 / _a.slotCountX;
        elements.buttonPrev = {
            type: "button",
            x: 20, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
            clicker: {
                onClick: function () {
                    _a.page--;
                    _a.updateWindow();
                }
            }
        };
        elements.buttonNext = {
            type: "button",
            x: 884, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
            clicker: {
                onClick: function () {
                    _a.page++;
                    _a.updateWindow();
                }
            }
        };
        elements.textPage = { type: "text", x: 490, y: ScreenHeight - 80, font: { size: 40, align: UI.Font.ALIGN_CENTER } };
        window.addWindow("controller", {
            location: { x: 0, y: 0, width: 1000, height: ScreenHeight },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: ScreenHeight, bitmap: "classic_frame_bg_light", scale: 3 },
                { type: "frame", x: 20 - 3, y: 68 - 3, width: 960 + 6, height: _a.slotCountY * slotSize + 6, bitmap: "classic_frame_slot", scale: 3 },
                { type: "text", x: 700, y: 43, text: "Item", font: { size: 20 } },
                { type: "text", x: 820, y: 43, text: "Liquid", font: { size: 20 } }
            ],
            elements: elements
        });
        window.addWindowInstance("list", _a.listWindow.item);
        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setBlockingBackground(true);
        window.setContainer(new UI.Container());
        window.getWindow("controller").setEventListener({
            onOpen: function () {
                StartButton.close();
            },
            onClose: function () {
                StartButton.open();
            }
        });
        return window;
    })();
    return MainUI;
}());
var ViewMode = {
    ITEM: 0,
    LIQUID: 1,
    LIST: 2
};
var isItemView = function (a) { return a && a.mode === ViewMode.ITEM; };
var isLiquidView = function (a) { return a && a.mode === ViewMode.LIQUID; };
var isListView = function (a) { return a && a.mode === ViewMode.LIST; };
var SubUI = /** @class */ (function () {
    function SubUI() {
    }
    SubUI.setupWindow = function () {
        var _this = this;
        var recipeTypeLength = RecipeTypeRegistry.getLength();
        var elements = {};
        for (var i = 0; i < recipeTypeLength; i++) {
            elements["icon" + i] = {
                type: "slot",
                x: 0, y: i * 1000, size: 1000,
                visual: true,
                clicker: {
                    onClick: function (container, tile, elem) {
                        elem.source.id && _this.changeWindow(elem.y / 1000 | 0);
                    },
                    onLongClick: function (container, tile, elem) {
                        var view = _this.getView();
                        var key = view.tray[elem.y / 1000 | 0];
                        _this.openListView([key]);
                    }
                },
                /*
                onTouchEvent: (elem, event) => {
                    const view = this.getView();
                    const key = view.tray[elem.y / 1000 | 0];
                    RecipeType.onTouch.popup(RecipeTypeRegistry.isExist(key) ? RecipeTypeRegistry.get(key).getName() : "", elem, event);
                }
                */
            };
            elements["description" + i] = {
                type: "text",
                x: 500, y: i * 1000 + 600, z: 1,
                font: { size: 160, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER }
            };
        }
        elements.cursor = { type: "image", x: 0, y: 0, z: 1, bitmap: "_selection", scale: 27.78 };
        this.window.addWindow("tray", {
            location: {
                x: 150, y: 10,
                width: 60, height: 460,
                scrollY: recipeTypeLength * 60
            },
            params: { slot: "_default_slot_empty" },
            drawing: [{ type: "background", color: Color.parseColor("#474343") }],
            elements: elements
        });
        this.window.moveOnTop("overlay");
    };
    SubUI.getView = function () {
        return this.recent[this.recent.length - 1];
    };
    SubUI.openItemView = function (id, data, isUsage) {
        var currentView = this.getView();
        if (id === 0 || isItemView(currentView) && currentView.id === id && currentView.data === data && currentView.isUsage === isUsage) {
            return false;
        }
        var array = RecipeTypeRegistry.getActiveType(id, data, isUsage);
        if (array.length === 0) {
            return true;
        }
        var view = { mode: ViewMode.ITEM, id: id, data: data, isUsage: isUsage, tray: array };
        this.recent.push(view);
        this.page = 0;
        this.updateWindow();
        this.window.open();
        return false;
    };
    SubUI.openLiquidView = function (liquid, isUsage) {
        var currentView = this.getView();
        if (liquid === "" || isLiquidView(currentView) && currentView.liquid === liquid && currentView.isUsage === isUsage) {
            return false;
        }
        var array = RecipeTypeRegistry.getActiveTypeByLiquid(liquid, isUsage);
        if (array.length === 0) {
            return true;
        }
        var view = { mode: ViewMode.LIQUID, liquid: liquid, isUsage: isUsage, tray: array };
        this.recent.push(view);
        this.page = 0;
        this.updateWindow();
        this.window.open();
        return false;
    };
    SubUI.openListView = function (recipes) {
        var tray = recipes.filter(function (recipe) { return RecipeTypeRegistry.isExist(recipe) && RecipeTypeRegistry.get(recipe).getAllList().length > 0; });
        if (tray.length === 0) {
            return;
        }
        var view = { mode: ViewMode.LIST, tray: tray };
        this.recent.push(view);
        this.page = 0;
        this.updateWindow();
        this.window.open();
    };
    SubUI.setTitle = function () {
        var view = this.getView();
        var elements = this.window.getWindow("controller").getElements();
        var title = isItemView(view) ? ItemList.getName(view.id, view.data) :
            isLiquidView(view) ? LiquidRegistry.getLiquidName(view.liquid) :
                isListView(view) ? RecipeTypeRegistry.get(this.select).getName() : "";
        elements.get("textRecipe").setBinding("text", !isListView(view) && !view.isUsage ? title : "");
        elements.get("textUsage").setBinding("text", !isListView(view) && view.isUsage ? title : "");
        elements.get("textAll").setBinding("text", isListView(view) ? title : "");
    };
    SubUI.updateWindow = function () {
        try {
            var elements = this.window.getWindow("tray").getElements();
            var view = this.getView();
            var length = RecipeTypeRegistry.getLength();
            var recipeType = void 0;
            var icon = void 0;
            var description = void 0;
            for (var i = 0; i < length; i++) {
                icon = elements.get("icon" + i);
                description = elements.get("description" + i);
                if (view.tray[i]) {
                    recipeType = RecipeTypeRegistry.get(view.tray[i]);
                    icon.setBinding("source", recipeType.getIcon());
                    description.setBinding("text", recipeType.getDescription());
                }
                else {
                    icon.setBinding("source", { id: 0, count: 0, data: 0 });
                    description.setBinding("text", "");
                }
            }
            this.changeWindow(0);
        }
        catch (e) {
            alert("up: " + e);
        }
    };
    SubUI.changeWindow = function (index) {
        var trayWindow = this.window.getWindow("tray");
        var view = this.getView();
        this.select = view.tray[index];
        trayWindow.getElements().get("cursor").setPosition(0, index * 1000);
        //trayWindow.getLocation().setScroll(0, view.tray.length * 60);
        var recipeType = RecipeTypeRegistry.get(this.select);
        this.window.addWindowInstance("custom", recipeType.getWindow());
        UiFuncs.moveOverlayOnTop(this.window);
        try {
            this.list =
                isItemView(view) ? recipeType.getList(view.id, view.data, view.isUsage) :
                    isLiquidView(view) ? recipeType.getListByLiquid(view.liquid, view.isUsage) :
                        isListView(view) ? recipeType.getAllList() : [];
        }
        catch (e) {
            RecipeTypeRegistry.delete(this.select);
            alert('[RV] RecipeType "' + this.select + '" has been deleted.\n' + e);
        }
        this.setTitle();
        this.turnPage(0, true);
    };
    SubUI.turnPage = function (page, force) {
        if (!force && this.page === page) {
            return;
        }
        var recipeType = RecipeTypeRegistry.get(this.select);
        var elements = this.window.getWindow("controller").getElements();
        this.page = page < 0 ? this.list.length : page >= this.list.length ? 0 : page;
        elements.get("scrollPage").setBinding("raw-value", java.lang.Float.valueOf(this.page / (this.list.length - 1)));
        elements.get("textPage").setBinding("text", (this.page + 1) + " / " + this.list.length);
        recipeType.showRecipe(this.list[this.page]);
    };
    var _a;
    _a = SubUI;
    SubUI.page = 0;
    SubUI.list = [];
    SubUI.select = "";
    SubUI.recent = [];
    SubUI.window = (function () {
        var window = new UI.WindowGroup();
        window.addWindow("controller", {
            location: { x: 140, y: 0, width: 720, height: 480 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: 666.7, bitmap: "default_frame_bg_light", scale: 4 }
            ],
            elements: {
                textRecipe: { type: "text", x: 280, y: 20, font: { size: 40, color: Color.WHITE, shadow: 0.5 } },
                textUsage: { type: "text", x: 280, y: 20, font: { size: 40, color: Color.GREEN, shadow: 0.5 } },
                textAll: { type: "text", x: 280, y: 20, font: { size: 40, color: Color.YELLOW, shadow: 0.5 }, clicker: {
                        onClick: function (container, tile, elem) {
                            _a.openListView(RecipeTypeRegistry.getAllKeys());
                        }
                    },
                    onTouchEvent: function (elem, event) {
                        UiFuncs.popupTips("Show All Recipes", elem, event);
                    } },
                buttonBack: {
                    type: "button",
                    x: 120, y: 15, scale: 3,
                    bitmap: "_craft_button_up", bitmap2: "_craft_button_down",
                    clicker: {
                        onClick: function () {
                            _a.recent.pop();
                            if (_a.recent.length > 0) {
                                _a.updateWindow();
                                return;
                            }
                            _a.window.close();
                        },
                        onLongClick: function () {
                            _a.recent.length = 0;
                            _a.window.close();
                        }
                    }
                },
                textBack: { type: "text", x: 150, y: 25, z: 1, text: "Back", font: { color: Color.WHITE, size: 30, shadow: 0.5 } },
                buttonPrev: {
                    type: "button",
                    x: 250 - 48 * 2.5, y: 590, scale: 2.5,
                    bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
                    clicker: {
                        onClick: function () {
                            _a.turnPage(_a.page - 1);
                        },
                        onLongClick: function () {
                            _a.turnPage(0);
                        }
                    }
                },
                buttonNext: {
                    type: "button",
                    x: 850, y: 590, scale: 2.5,
                    bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
                    clicker: {
                        onClick: function () {
                            _a.turnPage(_a.page + 1);
                        },
                        onLongClick: function () {
                            _a.turnPage(_a.list.length - 1);
                        }
                    }
                },
                scrollPage: {
                    type: "scroll",
                    x: 350, y: 595, length: 400,
                    onTouchEvent: function (elem, event) {
                        var len = _a.list.length - 1;
                        var page = Math.round(event.localX * len);
                        _a.turnPage(page);
                        event.localX = page / len;
                    }
                },
                textPage: { type: "text", x: 575, y: 535, font: { size: 40, align: UI.Font.ALIGN_CENTER } }
            }
        });
        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setContainer(new UI.Container());
        window.setBlockingBackground(true);
        return window;
    })();
    return SubUI;
}());
var RButton = /** @class */ (function () {
    function RButton() {
    }
    RButton.putOnNativeGui = function (screenName, recipeKey) {
        this.data[screenName] = typeof recipeKey === "string" ? [recipeKey] : recipeKey;
    };
    RButton.onNativeGuiChanged = function (screen) {
        this.currentScreen = screen;
        screen in this.data ? this.window.open() : this.window.close();
    };
    RButton.data = {};
    RButton.window = (function () {
        var window = new UI.Window({
            location: { x: 1000 - 128, y: ScreenHeight - 96, width: 64, height: 64 },
            elements: {
                button: {
                    type: "button",
                    x: 0, y: 0, scale: 62.5,
                    bitmap: "default_button_up", bitmap2: "default_button_down",
                    clicker: {
                        onClick: function () {
                            var recipes = RButton.data[RButton.currentScreen];
                            recipes && RecipeTypeRegistry.openRecipePage(recipes);
                        }
                    }
                },
                text: {
                    type: "text",
                    x: 300, y: 120, z: 1,
                    text: "R",
                    font: { color: Color.WHITE, size: 600, shadow: 0.5 }
                }
            }
        });
        window.setAsGameOverlay(true);
        return window;
    })();
    return RButton;
}());
Callback.addCallback("NativeGuiChanged", function (screen) {
    RButton.onNativeGuiChanged(screen);
});
var WorkbenchRecipe = /** @class */ (function (_super) {
    __extends(WorkbenchRecipe, _super);
    function WorkbenchRecipe() {
        return _super.call(this, "Crafting", VanillaBlockID.crafting_table, {
            drawing: [
                { type: "bitmap", x: 530, y: 185, scale: 2, bitmap: "_workbench_bar" }
            ],
            elements: {
                input0: { x: 200, y: 100, size: 100 },
                input1: { x: 300, y: 100, size: 100 },
                input2: { x: 400, y: 100, size: 100 },
                input3: { x: 200, y: 200, size: 100 },
                input4: { x: 300, y: 200, size: 100 },
                input5: { x: 400, y: 200, size: 100 },
                input6: { x: 200, y: 300, size: 100 },
                input7: { x: 300, y: 300, size: 100 },
                input8: { x: 400, y: 300, size: 100 },
                output0: { x: 680, y: 190, size: 120 }
            }
        }) || this;
    }
    WorkbenchRecipe.prototype.convertToJSArray = function (set) {
        var list = [];
        var iterator = set.iterator();
        var entry;
        var field;
        var input;
        var i = 0;
        while (iterator.hasNext()) {
            entry = iterator.next();
            field = entry.getSortedEntries();
            input = [];
            for (i = 0; i < 9; i++) {
                if (!field[i]) {
                    break;
                }
                input[i] = { id: field[i].id, count: 1, data: field[i].data };
            }
            list.push({ input: input, output: [entry.getResult()] });
        }
        return list;
    };
    WorkbenchRecipe.prototype.getAllList = function () {
        var recipes = new java.util.HashSet();
        ItemList.get().forEach(function (item) {
            recipes.addAll(Recipes.getWorkbenchRecipesByResult(item.id, -1, -1));
        });
        return this.convertToJSArray(recipes);
    };
    WorkbenchRecipe.prototype.getList = function (id, data, isUsage) {
        var data2 = Item.getMaxDamage(id) ? -1 : data;
        return this.convertToJSArray(isUsage ? Recipes.getWorkbenchRecipesByIngredient(id, data2) : Recipes.getWorkbenchRecipesByResult(id, -1, data2));
    };
    return WorkbenchRecipe;
}(RecipeType));
RecipeTypeRegistry.register("workbench", new WorkbenchRecipe());
var FurnaceRecipe = /** @class */ (function (_super) {
    __extends(FurnaceRecipe, _super);
    function FurnaceRecipe() {
        return _super.call(this, "Smelting", VanillaBlockID.furnace, {
            drawing: [
                { type: "bitmap", x: 440, y: 185, scale: 2, bitmap: "_workbench_bar" }
            ],
            elements: {
                input0: { x: 280, y: 190, size: 120 },
                output0: { x: 600, y: 190, size: 120 }
            }
        }) || this;
    }
    FurnaceRecipe.prototype.getAllList = function () {
        var list = [];
        var recipe = Recipes.getFurnaceRecipesByResult();
        var iterator = recipe.iterator();
        var entry;
        while (iterator.hasNext()) {
            entry = iterator.next();
            list.push({
                input: [{ id: entry.inId, count: 1, data: entry.inData }],
                output: [entry.getResult()]
            });
        }
        return list;
    };
    return FurnaceRecipe;
}(RecipeType));
var FurnaceFuelRecipe = /** @class */ (function (_super) {
    __extends(FurnaceFuelRecipe, _super);
    function FurnaceFuelRecipe() {
        var _this = _super.call(this, "Furnace Fuel", VanillaBlockID.furnace, {
            drawing: [
                { type: "bitmap", x: 290, y: 140, scale: 8, bitmap: "furnace_burn" }
            ],
            elements: {
                input0: { x: 280, y: 260, size: 120 },
                text: { type: "text", x: 450, y: 220, multiline: true, font: { size: 40, color: Color.WHITE, shadow: 0.5 } }
            }
        }) || this;
        _this.setDescription("Fuel");
        return _this;
    }
    FurnaceFuelRecipe.prototype.getAllList = function () {
        return ItemList.get().filter(function (item) { return Recipes.getFuelBurnDuration(item.id, item.data) > 0; }).map(function (item) { return ({ input: [{ id: item.id, count: 1, data: item.data }] }); });
    };
    FurnaceFuelRecipe.prototype.getList = function (id, data, isUsage) {
        return isUsage && Recipes.getFuelBurnDuration(id, data) > 0 ? [{ input: [{ id: id, count: 1, data: data }] }] : [];
    };
    FurnaceFuelRecipe.prototype.onOpen = function (elements, recipe) {
        var item = recipe.input[0];
        var time = Recipes.getFuelBurnDuration(item.id, item.data);
        elements.get("text").setBinding("text", time + " tick\n(Smelts  " + ((time / 20 | 0) / 10) + "  items)");
    };
    return FurnaceFuelRecipe;
}(RecipeType));
RecipeTypeRegistry.register("furnace", new FurnaceRecipe());
RecipeTypeRegistry.register("fuel", new FurnaceFuelRecipe());
RButton.putOnNativeGui("furnace_screen", ["furnace", "fuel"]);
var LikeFurnaceRecipe = /** @class */ (function (_super) {
    __extends(LikeFurnaceRecipe, _super);
    function LikeFurnaceRecipe(name, icon) {
        var _this = _super.call(this, name, icon, {
            drawing: [
                { type: "bitmap", x: 440, y: 185, scale: 2, bitmap: "_workbench_bar" }
            ],
            elements: {
                input0: { x: 280, y: 190, size: 120 },
                output0: { x: 600, y: 190, size: 120 }
            }
        }) || this;
        _this.recipeList = [];
        return _this;
    }
    LikeFurnaceRecipe.prototype.registerRecipe = function (input, output) {
        var inputItem = BehaviorTools.convertToItem(input);
        var outputItem = BehaviorTools.convertToItem(output);
        inputItem && outputItem && this.recipeList.push({
            input: [{ id: inputItem.id, count: 1, data: inputItem.data }],
            output: [{ id: outputItem.id, count: 1, data: outputItem.data }]
        });
    };
    LikeFurnaceRecipe.prototype.getAllList = function () {
        return this.recipeList;
    };
    return LikeFurnaceRecipe;
}(RecipeType));
var BlastFurnaceRecipe = new LikeFurnaceRecipe("Blast Furnece", VanillaBlockID.blast_furnace);
var SmokerRecipe = new LikeFurnaceRecipe("Smoker", VanillaBlockID.smoker);
var CampfireRecipe = new LikeFurnaceRecipe("Campfire", VanillaBlockID.campfire);
RecipeTypeRegistry.register("blast_furnace", BlastFurnaceRecipe);
RecipeTypeRegistry.register("smoker", SmokerRecipe);
RecipeTypeRegistry.register("campfire", CampfireRecipe);
RButton.putOnNativeGui("blast_furnace_screen", ["blast_furnace", "fuel"]);
RButton.putOnNativeGui("smoker_screen", ["smoker", "fuel"]);
var BrewingRecipe = /** @class */ (function (_super) {
    __extends(BrewingRecipe, _super);
    function BrewingRecipe() {
        var _this = this;
        var font = { size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER };
        _this = _super.call(this, "Potion Brewing", VanillaBlockID.brewing_stand, {
            params: { slot: "classic_slot" },
            drawing: [
                { type: "bitmap", x: 68, y: 60, scale: 4, bitmap: "brewing_stand_back" },
                { type: "text", x: 244 + 64, y: 440, text: "Source", font: font },
                { type: "text", x: 628 + 64, y: 440, text: "Result", font: font }
            ],
            elements: {
                input0: { x: 68, y: 60, size: 128 },
                input1: { x: 436, y: 68, size: 128 },
                input2: { x: 244, y: 276, size: 128 },
                output0: { x: 628, y: 276, size: 128 }
            }
        }) || this;
        return _this;
    }
    BrewingRecipe.registerRecipe = function (input, reagent, output) {
        var inputItem = BehaviorTools.convertToItem(input);
        var reagentItem = BehaviorTools.convertToItem(reagent);
        var outputItem = BehaviorTools.convertToItem(output);
        inputItem && reagentItem && outputItem && this.recipeList.push({
            input: [
                { id: VanillaItemID.blaze_powder, count: 1, data: 0 },
                { id: reagentItem.id, count: 1, data: reagentItem.data },
                { id: inputItem.id, count: 1, data: inputItem.data },
            ],
            output: [
                { id: outputItem.id, count: 1, data: outputItem.data }
            ]
        });
    };
    BrewingRecipe.prototype.getAllList = function () {
        return BrewingRecipe.recipeListOld;
        //return isLegacy ? BrewingRecipe.recipeListOld : BrewingRecipe.recipeList;
    };
    BrewingRecipe.recipeList = [];
    BrewingRecipe.recipeListOld = (function () {
        var recipes = [];
        var id = {
            normal: VanillaItemID.potion,
            splash: VanillaItemID.splash_potion,
            lingering: VanillaItemID.lingering_potion
        };
        var corrupt = {
            night_vision: "invisibility",
            swiftness: "slowness",
            leaping: "slowness",
            healing: "harming",
            poison: "harming",
            regeneration: "weakness",
            strength: "weakness"
        };
        var meta = {
            water: { basic: 0 },
            mundane: { basic: 1, long: 2 },
            thick: { basic: 3 },
            awkward: { basic: 4 },
            night_vision: { basic: 5, long: 6 },
            invisibility: { basic: 7, long: 8 },
            leaping: { basic: 9, long: 10, strong: 11 },
            fire_resistance: { basic: 12, long: 13 },
            swiftness: { basic: 14, long: 15, strong: 16 },
            slowness: { basic: 17, long: 18 },
            water_breathing: { basic: 19, long: 20 },
            healing: { basic: 21, strong: 22 },
            harming: { basic: 23, strong: 24 },
            poison: { basic: 25, long: 26, strong: 27 },
            regeneration: { basic: 28, long: 29, strong: 30 },
            strength: { basic: 31, long: 32, strong: 33 },
            weakness: { basic: 34, long: 35 },
            decay: { basic: 36 },
            turtle_master: { basic: 37, long: 38, strong: 39 },
            slow_falling: { basic: 40, long: 41 }
        };
        var add = function (sourceID, potionType1, potionMeta1, potionType2, potionMeta2) {
            recipes.push({
                input: [
                    { id: VanillaItemID.blaze_powder, count: 1, data: 0 },
                    { id: sourceID, count: 1, data: 0 },
                    { id: id[potionType1], count: 1, data: potionMeta1 }
                ],
                output: [
                    { id: id[potionType2], count: 1, data: potionMeta2 }
                ]
            });
        };
        var addEachBottle = function (sourceID, potionMeta1, potionMeta2) {
            add(sourceID, "normal", potionMeta1, "normal", potionMeta2);
            add(sourceID, "splash", potionMeta1, "splash", potionMeta2);
            add(sourceID, "lingering", potionMeta1, "lingering", potionMeta2);
        };
        var addEffect = function (sourceID, baseType, resultType) {
            addEachBottle(sourceID, meta[baseType].basic, meta[resultType].basic);
        };
        addEffect(VanillaItemID.spider_eye, "water", "mundane");
        addEffect(VanillaItemID.ghast_tear, "water", "mundane");
        addEffect(VanillaItemID.rabbit_foot, "water", "mundane");
        addEffect(VanillaItemID.blaze_powder, "water", "mundane");
        addEffect(VanillaItemID.speckled_melon, "water", "mundane");
        addEffect(VanillaItemID.sugar, "water", "mundane");
        addEffect(VanillaItemID.magma_cream, "water", "mundane");
        addEffect(VanillaItemID.redstone, "water", "mundane");
        addEffect(VanillaItemID.glowstone_dust, "water", "thick");
        addEffect(VanillaBlockID.nether_wart, "water", "awkward");
        addEffect(VanillaItemID.golden_carrot, "awkward", "night_vision");
        addEffect(VanillaItemID.rabbit_foot, "awkward", "leaping");
        addEffect(VanillaItemID.magma_cream, "awkward", "fire_resistance");
        addEffect(VanillaItemID.sugar, "awkward", "swiftness");
        addEffect(VanillaItemID.pufferfish, "awkward", "water_breathing");
        addEffect(VanillaItemID.speckled_melon, "awkward", "healing");
        addEffect(VanillaItemID.spider_eye, "awkward", "poison");
        addEffect(VanillaItemID.ghast_tear, "awkward", "regeneration");
        addEffect(VanillaItemID.blaze_powder, "awkward", "strength");
        addEffect(VanillaItemID.fermented_spider_eye, "water", "weakness");
        addEffect(VanillaItemID.turtle_helmet, "awkward", "turtle_master");
        addEffect(VanillaItemID.phantom_membrane, "awkward", "slow_falling");
        var type;
        for (var effect in meta) {
            meta[effect].long && addEachBottle(VanillaItemID.redstone, meta[effect].basic, meta[effect].long);
            meta[effect].strong && addEachBottle(VanillaItemID.glowstone_dust, meta[effect].basic, meta[effect].strong);
            for (type in meta[effect]) {
                add(VanillaItemID.gunpowder, "normal", meta[effect][type], "splash", meta[effect][type]);
                add(VanillaItemID.dragon_breath, "splash", meta[effect][type], "lingering", meta[effect][type]);
            }
        }
        for (var effect in corrupt) {
            for (type in meta[effect]) {
                meta[corrupt[effect]][type] && addEachBottle(VanillaItemID.fermented_spider_eye, meta[effect][type], meta[corrupt[effect]][type]);
            }
        }
        return recipes;
    })();
    return BrewingRecipe;
}(RecipeType));
RecipeTypeRegistry.register("brewing", new BrewingRecipe());
RButton.putOnNativeGui("brewing_stand_screen", "brewing");
var StonecutterRecipe = /** @class */ (function (_super) {
    __extends(StonecutterRecipe, _super);
    function StonecutterRecipe() {
        return _super.call(this, "Stonecutter", VanillaBlockID.stonecutter_block, {
            drawing: [
                { type: "bitmap", x: 455, y: 130, scale: 6, bitmap: "bar_stonecutter" }
            ],
            elements: {
                input0: { x: 440, y: 0, size: 120 },
                output0: { x: 260, y: 270, size: 120 },
                output1: { x: 380, y: 270, size: 120 },
                output2: { x: 500, y: 270, size: 120 },
                output3: { x: 620, y: 270, size: 120 },
                output4: { x: 260, y: 390, size: 120 },
                output5: { x: 380, y: 390, size: 120 },
                output6: { x: 500, y: 390, size: 120 },
                output7: { x: 620, y: 390, size: 120 }
            }
        }) || this;
    }
    StonecutterRecipe.registerRecipe = function (input, output) {
        var inputItem = {
            id: BehaviorTools.getNumericID(input.item),
            count: input.count || 1,
            data: input.data || 0
        };
        var outputItem = {
            id: BehaviorTools.getNumericID(output.item),
            count: output.count || 1,
            data: output.data || 0
        };
        var find = this.recipeList.find(function (recipe) {
            var item = recipe.input[0];
            return item.id === inputItem.id && item.count === inputItem.count && item.data === inputItem.data;
        });
        find ? find.output.push(outputItem) : this.recipeList.push({ input: [inputItem], output: [outputItem] });
    };
    StonecutterRecipe.prototype.getAllList = function () {
        return StonecutterRecipe.recipeList;
    };
    StonecutterRecipe.recipeList = [];
    return StonecutterRecipe;
}(RecipeType));
RecipeTypeRegistry.register("stonecutter", new StonecutterRecipe());
RButton.putOnNativeGui("stonecutter_screen", "stonecutter");
var TradingRecipe = /** @class */ (function (_super) {
    __extends(TradingRecipe, _super);
    function TradingRecipe() {
        var _this = _super.call(this, "Villager Trading", VanillaItemID.emerald, {
            drawing: [
                { type: "bitmap", x: 506, y: 199, scale: 6, bitmap: "bar_trading" }
            ],
            elements: {
                input0: { x: 250, y: 190, size: 120 },
                input1: { x: 370, y: 190, size: 120 },
                output0: { x: 630, y: 190, size: 120 },
                textCount0: { type: "text", x: 310, y: 310, font: { size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER } },
                textCount1: { type: "text", x: 430, y: 310, font: { size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER } },
                textInfo: { type: "text", x: 500, y: 80, font: { size: 40, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER } },
                textEnch: { type: "text", x: 690, y: 310, font: { size: 30, color: Color.GREEN, shadow: 0.5, align: UI.Font.ALIGN_CENTER } }
            }
        }) || this;
        _this.setDescription("Trade");
        return _this;
    }
    TradingRecipe.convertToJobName = function (fileName) {
        var suffix = "_trades.json";
        return fileName.endsWith(suffix) ? fileName.slice(0, -suffix.length).split("_").map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); }).join(" ") : fileName;
    };
    TradingRecipe.prototype.getAllList = function () {
        return TradingRecipe.allTrade;
    };
    TradingRecipe.prototype.onOpen = function (elements, recipe) {
        elements.get("textInfo").setBinding("text", "Level " + recipe.info.tier + " - " + recipe.info.job);
        elements.get("textCount0").setBinding("text", recipe.quantity[0] ? recipe.quantity[0].min + "-" + recipe.quantity[0].max : "");
        elements.get("textCount1").setBinding("text", recipe.quantity[1] ? recipe.quantity[1].min + "-" + recipe.quantity[1].max : "");
        elements.get("textEnch").setBinding("text", recipe.isEnchanted ? "Enchanted" : "");
    };
    TradingRecipe.setup = function () {
        var _this = this;
        FileTools.GetListOfFiles(__packdir__ + "assets/behavior_packs/vanilla/trading/", ".json").forEach(function (file) {
            try {
                var json = BehaviorTools.readJson(file.getAbsolutePath());
                var jobName = _this.convertToJobName(file.getName());
                var i = void 0;
                var j = void 0;
                var trade = void 0;
                var input = void 0;
                var input2 = void 0;
                var amount = void 0;
                var amount2 = void 0;
                var output = void 0;
                for (i = 0; i < json.tiers.length; i++) {
                    for (j = 0; j < json.tiers[i].trades.length; j++) {
                        trade = json.tiers[i].trades[j];
                        input = BehaviorTools.convertToItem(trade.wants[0].item);
                        amount = trade.wants[0].quantity;
                        if (trade.wants[1]) {
                            input2 = BehaviorTools.convertToItem(trade.wants[1].item);
                            amount2 = trade.wants[1].quantity;
                        }
                        else {
                            input2 = amount2 = null;
                        }
                        output = BehaviorTools.convertToItem(trade.gives[0].item);
                        input && output && _this.allTrade.push({
                            input: [
                                { id: input.id, count: amount && typeof amount === "number" ? amount : 1, data: input.data },
                                input2 ? { id: input2.id, count: amount2 && typeof amount2 === "number" ? amount2 : 1, data: input2.data } : { id: 0, count: 0, data: 0 }
                            ],
                            output: [
                                { id: output.id, count: 1, data: output.data }
                            ],
                            quantity: [
                                typeof amount === "number" ? null : amount,
                                typeof amount2 === "number" ? null : amount2
                            ],
                            isEnchanted: trade.gives[0].functions && trade.gives[0].functions.some(function (func) { return func.function === "enchant_with_levels"; }),
                            info: { tier: i + 1, job: jobName }
                        });
                    }
                }
            }
            catch (e) {
                alert("[RV]: TradeJson\n" + e);
            }
        });
    };
    TradingRecipe.allTrade = [];
    return TradingRecipe;
}(RecipeType));
RecipeTypeRegistry.register("trading", new TradingRecipe());
RButton.putOnNativeGui("trade_screen", "trading");
Callback.addCallback("PostLoaded", function () {
    var x = __config__.getNumber("ButtonPosition.x").intValue();
    var y = __config__.getNumber("ButtonPosition.y").intValue();
    StartButton.getLocation().set(x < 0 ? 1000 - (-x) : x, y < 0 ? ScreenHeight - (-y) : y, 64, 64);
    Threading.initThread("rv_readJson", function () {
        var time = Debug.sysTime();
        alert("[RV]: Start loading vanilla recipe Json");
        ItemList.addVanillaItems();
        TradingRecipe.setup();
        if (isLegacy) {
            BehaviorTools.readListOfJson(__packdir__ + "assets/definitions/recipe/").forEach(function (json) {
                if (json.type === "furnace_recipe") {
                    for (var i = 0; i < json.tags.length; i++) {
                        switch (json.tags[i]) {
                            case "blast_furnace":
                                BlastFurnaceRecipe.registerRecipe(json.input, json.output);
                                break;
                            case "smoker":
                                SmokerRecipe.registerRecipe(json.input, json.output);
                                break;
                            case "campfire":
                                CampfireRecipe.registerRecipe(json.input, json.output);
                                break;
                        }
                    }
                }
                else if (json.type === "crafting_shapeless") {
                    json.tags.some(function (tag) { return tag === "stonecutter"; }) && StonecutterRecipe.registerRecipe(json.ingredients[0], json.result);
                }
            });
        }
        else {
            BehaviorTools.readListOfJson(__packdir__ + "assets/behavior_packs/vanilla/recipes/").forEach(function (json) {
                if (json["minecraft:recipe_furnace"]) {
                    var recipe = json["minecraft:recipe_furnace"];
                    for (var i = 0; i < recipe.tags.length; i++) {
                        switch (recipe.tags[i]) {
                            case "blast_furnace":
                                BlastFurnaceRecipe.registerRecipe(recipe.input, recipe.output);
                                break;
                            case "smoker":
                                SmokerRecipe.registerRecipe(recipe.input, recipe.output);
                                break;
                            case "campfire":
                                CampfireRecipe.registerRecipe(recipe.input, recipe.output);
                                break;
                        }
                    }
                }
                /*
                else if(json["minecraft:recipe_brewing_mix"]){
                    const recipe = json["minecraft:recipe_brewing_mix"];
                    recipe.tags.some(tag => tag === "brewing_stand") && BrewingRecipe.registerRecipe(recipe.input, recipe.reagent, recipe.output);
                }
                */
                else if (json["minecraft:recipe_shapeless"]) {
                    var recipe = json["minecraft:recipe_shapeless"];
                    recipe.tags.some(function (tag) { return tag === "stonecutter"; }) && StonecutterRecipe.registerRecipe(recipe.ingredients[0], recipe.result);
                }
            });
        }
        alert("[RV]: Finish! (" + (Debug.sysTime() - time) + " ms)");
    });
});
Callback.addCallback("LevelLoaded", function () {
    Threading.initThread("rv_setup", function () {
        var time = Debug.sysTime();
        ItemList.addModItems();
        ItemList.setup();
        SubUI.setupWindow();
        Game.message("Recipe Viewer is ready (" + (Debug.sysTime() - time) + " ms)");
    });
});
ModAPI.registerAPI("RecipeViewer", {
    Core: OldVersion,
    ItemList: ItemList,
    RecipeType: RecipeType,
    RecipeTypeRegistry: RecipeTypeRegistry
});
