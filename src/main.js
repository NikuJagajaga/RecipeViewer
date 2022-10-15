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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
IMPORT("BehaviorJsonReader");
var Color = android.graphics.Color;
var ScreenHeight = UI.getScreenHeight();
var isLegacy = getMCPEVersion().array[1] === 11;
var Math_clamp = function (value, min, max) { return Math.min(Math.max(value, min), max); };
var removeDuplicateFilterFunc = function (item1, index, array) { return array.findIndex(function (item2) { return item1.id === item2.id && item1.data === item2.data && item1.type === item2.type; }) === index; };
var unifyMinMax = function (val) {
    if (typeof val === "object") {
        return { min: val.min | 0, max: val.max | 0 };
    }
    return { min: val | 0, max: val | 0 };
};
var MinMaxtoString = function (mm) { return mm.min === mm.max ? mm.min + "" : mm.min + "-" + mm.max; };
var isBlockID = function (id) {
    var info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("block");
};
var isItemID = function (id) {
    var info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("item");
};
var getNumericID = function (key) { return BehaviorJsonReader.getNumericID(String(key)); };
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
var joinThread = function (threadName, startMsg, doneMsg) {
    var thread = Threading.getThread(threadName);
    if (thread) {
        startMsg && alert(startMsg);
        thread.join();
        doneMsg && alert(doneMsg);
    }
};
var Cfg = {
    set: function (name, value) {
        __config__.getValue(name).set(value);
    },
    loadIcon: __config__.getBool("loadIcon"),
    buttonX: __config__.getNumber("ButtonPosition.x").intValue(),
    buttonY: __config__.getNumber("ButtonPosition.y").intValue(),
    slotCountX: __config__.getNumber("slotCountX").intValue(),
    preventMistap: __config__.getBool("preventMistap"),
    $workbench: __config__.getBool("availableRecipes.workbench"),
    $furnace: __config__.getBool("availableRecipes.furnace"),
    $fuel: __config__.getBool("availableRecipes.fuel"),
    $blast_furnace: __config__.getBool("availableRecipes.blast_furnace"),
    $smoker: __config__.getBool("availableRecipes.smoker"),
    $campfire: __config__.getBool("availableRecipes.campfire"),
    $brewing: __config__.getBool("availableRecipes.brewing"),
    $stonecutter: __config__.getBool("availableRecipes.stonecutter"),
    $smithing: __config__.getBool("availableRecipes.smithing"),
    $trading: __config__.getBool("availableRecipes.trading"),
    $liquid_filling: __config__.getBool("availableRecipes.liquid_filling")
};
var ItemIconSource = WRAP_JAVA("com.zhekasmirnov.innercore.api.mod.ui.icon.ItemIconSource").instance;
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
        /*
        const find = this.list.find(item => item.id === id && item.data === data);
        if(find && find.name){
            return find.name;
        }
        */
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
    ItemList.cacheIcons = function () {
        this.list.forEach(function (item) {
            ItemIconSource.getScaledIcon(item.id, item.data, 16);
        });
    };
    ItemList.list = [];
    return ItemList;
}());
var McFontPaint = (function () {
    var paint = new android.graphics.Paint();
    paint.setTypeface(WRAP_JAVA("com.zhekasmirnov.innercore.utils.FileTools").getMcTypeface());
    paint.setTextSize(16);
    return paint;
})();
var UiFuncs;
(function (UiFuncs) {
    UiFuncs.slotClicker = {
        onClick: function (container, tile, elem) {
            var source = elem.getBinding("source");
            if (!Cfg.preventMistap || !isDuringPopup(elem)) {
                SubUI.openItemView(source.id, source.data, false) && UiFuncs.show404Anim(elem);
            }
        },
        onLongClick: function (container, tile, elem) {
            var source = elem.getBinding("source");
            if (!Cfg.preventMistap || !isDuringPopup(elem)) {
                SubUI.openItemView(source.id, source.data, true) && UiFuncs.show404Anim(elem);
            }
        }
    };
    UiFuncs.tankClicker = {
        onClick: function (container, tile, elem) {
            if (!Cfg.preventMistap || !isDuringPopup(elem)) {
                SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), false) && UiFuncs.show404Anim(elem);
            }
        },
        onLongClick: function (container, tile, elem) {
            if (!Cfg.preventMistap || !isDuringPopup(elem)) {
                SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), true) && UiFuncs.show404Anim(elem);
            }
        }
    };
    UiFuncs.genOverlayWindow = function () {
        var window = new UI.Window({
            location: { x: 0, y: 0, width: 1000, height: ScreenHeight },
            drawing: [{ type: "background", color: Color.TRANSPARENT }],
            elements: {
                selectionFrame: {
                    type: "image",
                    x: -1000,
                    y: -1000,
                    width: 64,
                    height: 64,
                    scale: 1,
                    bitmap: "_selection"
                },
                popupFrame: {
                    type: "image",
                    x: -1000,
                    y: -1000,
                    width: 64,
                    height: 64,
                    scale: 1,
                    bitmap: "workbench_frame3"
                },
                popupText: {
                    type: "text",
                    x: -1000,
                    y: -1000,
                    z: 1,
                    font: { color: Color.WHITE, size: 16, shadow: 0.5 },
                    multiline: true
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
    UiFuncs.getElementName = function (elem) {
        var iterator = elem.window.getContentProvider().elementMap.entrySet().iterator();
        var entry;
        while (iterator.hasNext()) {
            entry = iterator.next();
            if (elem.equals(entry.getValue())) {
                return entry.getKey() + "";
            }
        }
        return "";
    };
    var getWindowGroup = function (elem) {
        var win = elem.window.getParentWindow();
        if ("addWindow" in win) {
            return win;
        }
        return win.getParentWindow(); //adjacent
    };
    var FrameTex = UI.FrameTextureSource.get("workbench_frame3");
    var FrameTexCentralColor = FrameTex.getCentralColor();
    var createRect = function (w, h) {
        var bitmap = new android.graphics.Bitmap.createBitmap(w | 0, h | 0, android.graphics.Bitmap.Config.ARGB_8888);
        var canvas = new android.graphics.Canvas(bitmap);
        canvas.drawARGB(127, 255, 255, 255);
        return bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
    };
    UiFuncs.popupTips = function (str, elem, event) {
        var location = elem.window.getLocation();
        var elements = getWindowGroup(elem).getElements();
        var selection = elements.get("selectionFrame");
        var text = elements.get("popupText");
        var frame = elements.get("popupFrame");
        var MOVEtoLONG_CLICK = event.type == "LONG_CLICK" && frame.x !== -1000 && frame.y !== -1000;
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;
        if (str && (event.type == "MOVE" || MOVEtoLONG_CLICK)) {
            x = location.x + location.windowToGlobal(elem.x) | 0;
            y = location.y + location.windowToGlobal(elem.y) | 0;
            w = location.windowToGlobal(elem.elementRect.width()) | 0;
            h = location.windowToGlobal(elem.elementRect.height()) | 0;
            if (selection.elementRect.width() !== w || selection.elementRect.height() !== h) {
                selection.texture = new UI.Texture(createRect(w, h));
                selection.setSize(w, h);
            }
            selection.setPosition(x, y);
            var split = str.split("\n");
            w = Math.max.apply(Math, split.map(function (s) { return McFontPaint.measureText(s); })) + 20;
            h = split.length * 18 + 16;
            x = location.x + location.windowToGlobal(event.x);
            y = location.y + location.windowToGlobal(event.y) - h - 50;
            if (y < -10) {
                y = location.y + location.windowToGlobal(event.y) + 70;
            }
            if (frame.elementRect.width() !== w || frame.elementRect.height() !== h) {
                frame.texture = new UI.Texture(FrameTex.expandAndScale(w, h, 1, FrameTexCentralColor));
                frame.setSize(w, h);
            }
            frame.setPosition(Math_clamp(x - w / 2, 0, 1000 - w), y);
            text.setPosition(Math_clamp(x - w / 2, 0, 1000 - w) + 10, y + 7);
            text.setBinding("text", str);
            if (!Threading.getThread("rv_popupTips")) {
                Threading.initThread("rv_popupTips", function () {
                    while (elem.isTouched) {
                        java.lang.Thread.sleep(200);
                    }
                    selection.setPosition(-1000, -1000);
                    frame.setPosition(-1000, -1000);
                    text.setPosition(-1000, -1000);
                });
            }
        }
        else {
            selection.setPosition(-1000, -1000);
            frame.setPosition(-1000, -1000);
            text.setPosition(-1000, -1000);
        }
    };
    var isDuringPopup = function (elem) {
        var frame = getWindowGroup(elem).getElements().get("popupFrame");
        return frame.x !== -1000 && frame.y !== -1000;
    };
    UiFuncs.onTouchSlot = function (elem, event) {
        //elem.isDarken = event.type != "UP";
        UiFuncs.popupTips(elem.source.id !== 0 ? ItemList.getName(elem.source.id, elem.source.data) : "", elem, event);
    };
    UiFuncs.onTouchTank = function (elem, event) {
        var liquid = RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + "");
        UiFuncs.popupTips(LiquidRegistry.isExists(liquid) ? LiquidRegistry.getLiquidName(liquid) : "", elem, event);
    };
    UiFuncs.show404Anim = function (elem) {
        var window = getWindowGroup(elem);
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
var RecipeType = /** @class */ (function () {
    function RecipeType(name, icon, content) {
        var _this = this;
        this.name = name;
        this.icon = typeof icon === "number" ? { id: icon, count: 1, data: 0 } : __assign(__assign({}, icon), { count: 1 });
        content.params = content.params || {};
        content.params.slot = content.params.slot || "_default_slot_light";
        content.drawing = content.drawing || [];
        content.drawing.some(function (elem) { return elem.type === "background"; }) || content.drawing.unshift({ type: "background", color: Color.TRANSPARENT });
        var that = this;
        var templateSlot = {
            type: "slot",
            visual: true,
            clicker: UiFuncs.slotClicker,
            onTouchEvent: function (elem, event) {
                var name = elem.source.id !== 0 ? ItemList.getName(elem.source.id, elem.source.data) : "";
                UiFuncs.popupTips(that.slotTooltip(name, elem.source, elem.getBinding("rv_tips")), elem, event);
            }
        };
        var templateTank = {
            type: "scale",
            direction: 1,
            clicker: UiFuncs.tankClicker,
            onTouchEvent: function (elem, event) {
                var liquid = RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + "");
                var amount = elem.getBinding("value") * _this.tankLimit;
                var name = LiquidRegistry.isExists(liquid) ? LiquidRegistry.getLiquidName(liquid) : "";
                UiFuncs.popupTips(that.tankTooltip(name, { liquid: liquid, amount: amount }, elem.getBinding("rv_tips")), elem, event);
            }
        };
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
        this.inputSlotSize = inputSlotSize;
        this.outputSlotSize = outputSlotSize;
        this.inputTankSize = inputTankSize;
        this.outputTankSize = outputTankSize;
        var locCtrler = new UI.WindowLocation({ x: (1000 - ScreenHeight * 1.5) / 2, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight });
        this.window = new UI.Window();
        this.window.setContent({
            location: {
                x: locCtrler.x + locCtrler.windowToGlobal(120),
                y: locCtrler.y + locCtrler.windowToGlobal(75),
                width: locCtrler.windowToGlobal(860),
                height: ScreenHeight - locCtrler.windowToGlobal(75 + 75)
            },
            params: content.params,
            drawing: content.drawing,
            //@ts-ignore
            elements: content.elements
        });
        this.windows = [this.window];
    }
    RecipeType.prototype.setGridView = function (row, col, border /*Color*/) {
        var content = this.window.getContent();
        var locCtrler = new UI.WindowLocation({ x: (1000 - ScreenHeight * 1.5) / 2, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight });
        var x = locCtrler.x + locCtrler.windowToGlobal(120);
        var y = locCtrler.y + locCtrler.windowToGlobal(75);
        var w = locCtrler.windowToGlobal(860);
        var h = (ScreenHeight - locCtrler.windowToGlobal(75 + 75));
        var window;
        this.windows.length = 0;
        for (var c = 0; c < col; c++) {
            for (var r = 0; r < row; r++) {
                window = (c === 0 && r === 0) ? this.window : new UI.Window(__assign({}, content));
                window.getLocation().set(x + w / col * c, y + h / row * r, w / col, h / row);
                this.windows.push(window);
            }
        }
        for (var i = 1; i < this.windows.length; i++) {
            this.window.addAdjacentWindow(this.windows[i]);
            this.windows[i].setParentWindow(this.window);
        }
        if (border) {
            var color = typeof border === "boolean" ? Color.rgb(80, 70, 80) : border;
            var location = new UI.WindowLocation({ x: x, y: y, width: w, height: h });
            var lines = [];
            var pos = 0;
            for (var r = 1; r < row; r++) {
                pos = location.getWindowHeight() / row * r;
                lines.push({ type: "line", x1: 0, x2: 1000, y1: pos, y2: pos, color: color, width: 6 });
            }
            for (var c = 1; c < col; c++) {
                pos = 1000 / col * c;
                lines.push({ type: "line", x1: pos, x2: pos, y1: 0, y2: location.getWindowHeight(), color: color, width: 6 });
            }
            window = new UI.Window({
                location: location.asScriptable(),
                drawing: __spreadArray([
                    { type: "background", color: Color.TRANSPARENT }
                ], lines, true),
                elements: {}
            });
            window.setTouchable(false);
            this.window.addAdjacentWindow(window);
        }
        return this;
    };
    /*
        setParentWindow(window: UI.WindowGroup): void {
            for(let i = 0; i < this.windows.length; i++){
                this.windows[i].setParentWindow(window);
            }
        }
    */
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
    RecipeType.prototype.getRecipeCountPerPage = function () {
        return this.windows.length;
    };
    RecipeType.prototype.getList = function (id, data, isUsage) {
        var list = this.getAllList();
        var callback = function (item) { return item.id === id && (data === -1 || item.data === -1 || item.data === data); };
        return isUsage ?
            list.filter(function (recipe) { return recipe.input ? recipe.input.some(callback) : false; }) :
            list.filter(function (recipe) { return recipe.output ? recipe.output.some(callback) : false; });
    };
    RecipeType.prototype.getListByLiquid = function (liquid, isUsage) {
        var list = this.getAllList();
        var callback = function (liq) { return liq.liquid === liquid; };
        return isUsage ?
            list.filter(function (recipe) { return recipe.inputLiq ? recipe.inputLiq.some(callback) : false; }) :
            list.filter(function (recipe) { return recipe.outputLiq ? recipe.outputLiq.some(callback) : false; });
    };
    RecipeType.prototype.hasAnyRecipe = function (id, data, isUsage) {
        var list = this.getAllList();
        if (list.length === 0) {
            return this.getList(id, data, isUsage).length > 0;
        }
        var callback = function (item) { return item && item.id === id && (data === -1 || item.data === -1 || item.data === data); };
        return isUsage ?
            list.some(function (recipe) { return recipe.input ? recipe.input.some(callback) : false; }) :
            list.some(function (recipe) { return recipe.output ? recipe.output.some(callback) : false; });
    };
    RecipeType.prototype.hasAnyRecipeByLiquid = function (liquid, isUsage) {
        var list = this.getAllList();
        if (list.length === 0) {
            return this.getListByLiquid(liquid, isUsage).length > 0;
        }
        var callback = function (liq) { return liq && liq.liquid === liquid; };
        return isUsage ?
            list.some(function (recipe) { return recipe.inputLiq ? recipe.inputLiq.some(callback) : false; }) :
            list.some(function (recipe) { return recipe.outputLiq ? recipe.outputLiq.some(callback) : false; });
    };
    RecipeType.prototype.onOpen = function (elements, recipe) {
    };
    RecipeType.prototype.showRecipe = function (recipes) {
        var empty = { id: 0, count: 0, data: 0 };
        var recsPerPage = this.getRecipeCountPerPage();
        var recipe;
        var elements;
        var elem;
        for (var i = 0; i < recsPerPage; i++) {
            recipe = recipes[i] || {};
            elements = this.windows[i].getElements();
            recipes[i] && this.onOpen(elements, recipe);
            for (var j = 0; j < this.inputSlotSize; j++) {
                elem = elements.get("input" + j);
                if (recipe.input && recipe.input[j]) {
                    elem.setBinding("source", { id: recipe.input[j].id, count: recipe.input[j].count, data: recipe.input[j].data });
                    recipe.input[j].tips && elem.setBinding("rv_tips", recipe.input[j].tips);
                }
                else {
                    elem.setBinding("source", empty);
                    elem.setBinding("rv_tips", null);
                }
            }
            for (var j = 0; j < this.outputSlotSize; j++) {
                elem = elements.get("output" + j);
                if (recipe.output && recipe.output[j]) {
                    elem.setBinding("source", { id: recipe.output[j].id, count: recipe.output[j].count, data: recipe.output[j].data });
                    recipe.output[j].tips && elem.setBinding("rv_tips", recipe.output[j].tips);
                }
                else {
                    elem.setBinding("source", empty);
                    elem.setBinding("rv_tips", null);
                }
            }
            for (var j = 0; j < this.inputTankSize; j++) {
                elem = elements.get("inputLiq" + j);
                if (recipe.inputLiq && recipe.inputLiq[j]) {
                    elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq[j].liquid, elem.elementRect.width(), elem.elementRect.height()));
                    elem.setBinding("value", recipe.inputLiq[j].amount / this.tankLimit);
                    recipe.inputLiq[j].tips && elem.setBinding("rv_tips", recipe.inputLiq[j].tips);
                }
                else {
                    elem.setBinding("texture", "_default_slot_empty");
                    elem.setBinding("value", 0);
                    elem.setBinding("rv_tips", null);
                }
            }
            for (var j = 0; j < this.outputTankSize; j++) {
                elem = elements.get("outputLiq" + j);
                if (recipe.outputLiq && recipe.outputLiq[j]) {
                    elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.outputLiq[j].liquid, elem.elementRect.width(), elem.elementRect.height()));
                    elem.setBinding("value", recipe.outputLiq[j].amount / this.tankLimit);
                    recipe.outputLiq[j].tips && elem.setBinding("rv_tips", recipe.outputLiq[j].tips);
                }
                else {
                    elem.setBinding("texture", "_default_slot_empty");
                    elem.setBinding("value", 0);
                    elem.setBinding("rv_tips", null);
                }
            }
        }
    };
    RecipeType.prototype.slotTooltip = function (name, item, tips) {
        return name;
    };
    RecipeType.prototype.tankTooltip = function (name, liquid, tips) {
        return name;
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
    RecipeTypeRegistry.openRecipePageByItem = function (id, data, isUsage) {
        return SubUI.openItemView(id, data, isUsage);
    };
    RecipeTypeRegistry.openRecipePageByLiquid = function (liquid, isUsage) {
        return SubUI.openLiquidView(liquid, isUsage);
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
Callback.addCallback("PostLoaded", function () {
    var x = Cfg.buttonX;
    var y = Cfg.buttonY;
    StartButton.getLocation().set(x < 0 ? 1000 - (-x) : x, y < 0 ? ScreenHeight - (-y) : y, 64, 64);
});
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
    MainUI.calcSlotCountY = function () {
        var slotSize = this.INNER_WIDTH / this.slotCountX;
        var count = 0;
        while (68 + slotSize * count <= ScreenHeight - 70) {
            count++;
        }
        return count - 1;
    };
    MainUI.setSlotCount = function (x) {
        var x2 = Math.min(Math.max(x, this.slotCountXLimit.min), this.slotCountXLimit.max);
        if (this.slotCountX === x2) {
            return false;
        }
        this.slotCountX = x2;
        this.slotCountY = this.calcSlotCountY();
        this.slotCount = this.slotCountX * this.slotCountY;
        Cfg.set("slotCountX", x2);
        return true;
    };
    MainUI.changeSlotXCount = function (val) {
        if (!this.liquidMode) {
            if (this.setSlotCount(this.slotCountX + val)) {
                this.refreshSlotsWindow();
                this.switchWindow(false, true);
            }
        }
    };
    MainUI.refreshSlotsWindow = function () {
        var height = this.slotCountY * (this.INNER_WIDTH / this.slotCountX);
        var location = { x: 20, y: 68, width: this.INNER_WIDTH, height: height };
        var slotSize = 1000 / this.slotCountX;
        var elemSlot = {};
        for (var i = 0; i < this.slotCount; i++) {
            elemSlot["slot" + i] = {
                type: "slot",
                x: (i % this.slotCountX) * slotSize,
                y: (i / this.slotCountX | 0) * slotSize,
                size: slotSize,
                visual: true,
                clicker: UiFuncs.slotClicker,
                onTouchEvent: UiFuncs.onTouchSlot
            };
        }
        this.slotsWindow = new UI.Window({
            location: location,
            params: { slot: "_default_slot_empty" },
            drawing: [
                { type: "background", color: UI.FrameTextureSource.get("classic_frame_slot").getCentralColor() }
            ],
            elements: elemSlot
        });
    };
    MainUI.setCloseOnBackPressed = function (val) {
        this.window.setCloseOnBackPressed(val);
    };
    MainUI.isOpened = function () {
        return this.window.isOpened();
    };
    MainUI.switchWindow = function (liquidMode, force) {
        if (!force && this.liquidMode === liquidMode) {
            return;
        }
        this.liquidMode = liquidMode;
        this.page = 0;
        this.window.addWindowInstance("list", liquidMode ? this.tanksWindow : this.slotsWindow);
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
        var _this = this;
        var threadName = "rv_MainUI_updateWindow";
        this.whileDisplaying = false;
        joinThread(threadName);
        var maxPage = Math.ceil(this.liquidMode ? this.liqList.length / this.tankCount : this.list.length / this.slotCount);
        this.page = this.page < 0 ? maxPage - 1 : this.page >= maxPage ? 0 : this.page;
        this.window.getElements().get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);
        if (this.liquidMode) {
            Threading.initThread(threadName, function () {
                var elems = _this.tanksWindow.getElements();
                var elem;
                var liquid;
                _this.whileDisplaying = true;
                for (var i = 0; i < _this.tankCount && _this.whileDisplaying; i++) {
                    elem = elems.get("tank" + i);
                    liquid = _this.liqList[_this.tankCount * _this.page + i];
                    if (liquid) {
                        elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(liquid, elem.elementRect.width(), elem.elementRect.height()));
                        elem.setBinding("value", 1);
                    }
                    else {
                        elem.setBinding("texture", "_default_slot_empty");
                        elem.setBinding("value", 0);
                    }
                }
            });
        }
        else {
            Threading.initThread(threadName, function () {
                var elems = _this.slotsWindow.getElements();
                var empty = { id: 0, count: 0, data: 0 };
                var item;
                _this.whileDisplaying = true;
                java.lang.Thread.sleep(20);
                for (var i = 0; i < _this.slotCount && _this.whileDisplaying; i++) {
                    item = _this.list[_this.slotCount * _this.page + i];
                    elems.get("slot" + i).setBinding("source", item ? { id: item.id, count: 1, data: item.data } : empty);
                }
            });
        }
    };
    MainUI.openWindow = function (list) {
        if (list === void 0) { list = ItemList.get(); }
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
        this.list = list;
        this.liqList = Object.keys(LiquidRegistry.liquids);
        this.window.open();
        this.changeSortMode(true);
        this.switchWindow(false, true);
    };
    var _a;
    _a = MainUI;
    MainUI.INNER_WIDTH = 960;
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
    MainUI.slotCountXLimit = { min: 8, max: 24 };
    MainUI.slotCountX = 0;
    MainUI.slotCountY = _a.calcSlotCountY();
    MainUI.slotCount = _a.slotCountX * _a.slotCountY;
    MainUI.tankCount = 8;
    MainUI.tanksWindow = (function () {
        var height = ScreenHeight - 68 - 70;
        var location = { x: 20, y: 68, width: _a.INNER_WIDTH, height: height };
        var drawTank = [{ type: "background", color: UI.FrameTextureSource.get("classic_frame_slot").getCentralColor() }];
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
                bitmap: "_default_slot_empty",
                value: 1,
                clicker: UiFuncs.tankClicker,
                onTouchEvent: UiFuncs.onTouchTank
            };
        }
        return new UI.Window({
            location: location,
            drawing: drawTank,
            elements: elemTank
        });
    })();
    MainUI.window = (function () {
        var window = new UI.WindowGroup();
        var slotSize = 960 / _a.slotCountX;
        var controller = window.addWindow("controller", {
            location: { x: 0, y: 0, width: 1000, height: ScreenHeight },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: ScreenHeight, bitmap: "classic_frame_bg_light", scale: 3 },
                { type: "frame", x: 20 - 3, y: 68 - 3, width: 960 + 6, height: ScreenHeight - 68 - 70 + 6, bitmap: "classic_frame_slot", scale: 3 },
                { type: "frame", x: 20, y: ScreenHeight - 60, width: 230, height: 50, bitmap: "classic_frame_bg_light", scale: 1 },
                { type: "text", x: 40, y: ScreenHeight - 27, text: "Item", font: { size: 20 } },
                { type: "text", x: 160, y: ScreenHeight - 27, text: "Liquid", font: { size: 20 } }
            ],
            elements: {
                buttonClose: {
                    type: "closeButton",
                    x: 1000 - 45 - 9, y: 9, scale: 3,
                    bitmap: "classic_close_button", bitmap2: "classic_close_button_down"
                },
                buttonSearch: {
                    type: "button",
                    x: 20, y: 15, scale: 0.8,
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
                    x: 30, y: 25, z: 1,
                    font: { color: Color.WHITE, size: 20 },
                    text: "Search"
                },
                buttonSort: {
                    type: "button",
                    x: 450, y: 15, scale: 0.8,
                    bitmap: "mod_browser_button", bitmap2: "mod_browser_button_down",
                    clicker: { onClick: function (con, tile, elem) {
                            _a.changeSortMode();
                            _a.updateWindow();
                        } }
                },
                textSort: {
                    type: "text",
                    x: 465, y: 25, z: 1,
                    text: "",
                    font: { color: Color.WHITE, size: 16, shadow: 0.5 }
                },
                buttonPlus: { type: "button", x: 800, y: 25, bitmap: "rv.button_plus", bitmap2: "rv.button_plus_pressed", scale: 2, clicker: {
                        onClick: function () {
                            _a.changeSlotXCount(-1);
                        }
                    } },
                buttonMinus: { type: "button", x: 850, y: 25, bitmap: "rv.button_minus", bitmap2: "rv.button_minus_pressed", scale: 2, clicker: {
                        onClick: function () {
                            _a.changeSlotXCount(1);
                        }
                    } },
                switchMode: { type: "switch", x: 93, y: ScreenHeight - 50, scale: 2, onNewState: function (state, container, elem) {
                        World.isWorldLoaded() && _a.switchWindow(!!state);
                        //elem.texture = new UI.Texture(UI.TextureSource.get("default_switch" + (state ? "on" : "off")));
                    } },
                buttonPrev: {
                    type: "button",
                    x: 520, y: ScreenHeight - 60, scale: 2,
                    bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
                    clicker: {
                        onClick: function () {
                            _a.page--;
                            _a.updateWindow();
                        }
                    }
                },
                buttonNext: {
                    type: "button",
                    x: 1000 - 48 * 2 - 20, y: ScreenHeight - 60, scale: 2,
                    bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
                    clicker: {
                        onClick: function () {
                            _a.page++;
                            _a.updateWindow();
                        }
                    }
                },
                textPage: { type: "text", x: 750, y: ScreenHeight - 75, font: { size: 40, align: UI.Font.ALIGN_CENTER } }
            }
        });
        _a.setSlotCount(Cfg.slotCountX);
        _a.refreshSlotsWindow();
        window.addWindowInstance("list", _a.slotsWindow);
        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setContainer(new UI.Container());
        window.setBlockingBackground(true);
        window.setCloseOnBackPressed(true);
        controller.setEventListener({
            onOpen: function () {
                StartButton.close();
            },
            onClose: function () {
                StartButton.open();
            }
        });
        return window;
    })();
    MainUI.whileDisplaying = false;
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
    SubUI.isOpened = function () {
        return this.window.isOpened();
    };
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
                        var index = parseInt(UiFuncs.getElementName(elem).slice(("icon").length));
                        elem.source.id && _this.changeWindow(index);
                    },
                    onLongClick: function (container, tile, elem) {
                        var index = parseInt(UiFuncs.getElementName(elem).slice(("icon").length));
                        var view = _this.getView();
                        _this.openListView([view.tray[index]]);
                    }
                }
            };
            elements["description" + i] = {
                type: "text",
                x: 500, y: i * 1000 + 600, z: 1,
                font: { size: 160, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER }
            };
        }
        elements.cursor = { type: "image", x: 0, y: 0, z: 1, bitmap: "_selection", scale: 27.78 };
        var location = this.window.getWindow("controller").getLocation();
        this.window.addWindow("tray", {
            location: {
                x: location.x + location.windowToGlobal(20),
                y: location.y + location.windowToGlobal(20),
                width: location.windowToGlobal(80),
                height: location.getWindowHeight() - location.windowToGlobal(40),
                padding: { top: location.windowToGlobal(20), bottom: location.windowToGlobal(20) },
                scrollY: recipeTypeLength * location.windowToGlobal(80)
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
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
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
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
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
        joinThread("rv_LevelLoaded", "[RV]: Waiting for preparations");
        var currentView = this.getView();
        var tray = recipes.filter(function (recipe) { return RecipeTypeRegistry.isExist(recipe) && RecipeTypeRegistry.get(recipe).getAllList().length > 0; });
        if (tray.length === 0 || isListView(currentView) && __spreadArray([], currentView.tray, true).sort().join(",") === __spreadArray([], tray, true).sort().join(",")) {
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
            alert("SubUI.UpdateWindow\n" + e);
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
        var recsPerPage = recipeType.getRecipeCountPerPage();
        var elements = this.window.getWindow("controller").getElements();
        var maxPage = Math.ceil(this.list.length / recsPerPage);
        this.page = page < 0 ? maxPage - 1 : page >= maxPage ? 0 : page;
        elements.get("scrollPage").setBinding("raw-value", java.lang.Float.valueOf(this.page / (maxPage - 1)));
        elements.get("textPage").setBinding("text", (this.page + 1) + " / " + maxPage);
        elements.get("textPage").setPosition(300 + (this.page < maxPage / 2 ? 400 : 100), 590);
        recipeType.showRecipe(this.list.slice(this.page * recsPerPage, this.page * recsPerPage + recsPerPage));
    };
    var _a;
    _a = SubUI;
    SubUI.page = 0;
    SubUI.list = [];
    SubUI.select = "";
    SubUI.recent = [];
    SubUI.window = (function () {
        var window = new UI.WindowGroup();
        var controller = window.addWindow("controller", {
            location: { x: (1000 - ScreenHeight * 1.5) / 2, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: 1000 / 1.5, bitmap: "default_frame_bg_light", scale: 4 },
                { type: "frame", x: 300, y: 590, width: 500, height: 60, bitmap: "default_scroll_bg", scale: 4 } //scroll background
            ],
            elements: {
                textRecipe: { type: "text", x: 280, y: 18, font: { size: 40, color: Color.WHITE, shadow: 0.5 } },
                textUsage: { type: "text", x: 280, y: 18, font: { size: 40, color: Color.GREEN, shadow: 0.5 } },
                textAll: { type: "text", x: 280, y: 18, font: { size: 40, color: Color.YELLOW, shadow: 0.5 },
                    clicker: {
                        onClick: function (container, tile, elem) {
                            _a.openListView(RecipeTypeRegistry.getAllKeys());
                        }
                    },
                    onTouchEvent: function (elem, event) {
                        UiFuncs.popupTips("Show All Recipes", elem, event);
                    }
                },
                buttonBack: {
                    type: "button",
                    x: 120, y: 20, scale: 0.8,
                    bitmap: "mod_browser_back", bitmap2: "mod_browser_back_down",
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
                            _a.window.close();
                        }
                    }
                },
                buttonPrev: {
                    type: "button",
                    x: 250 - 48 * 2.5, y: 590, scale: 2.5,
                    bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
                    clicker: {
                        onClick: function () {
                            _a.turnPage(_a.page - 1);
                        },
                        onLongClick: function (container, tile, elem) {
                            _a.turnPage(0);
                        }
                    },
                    /*
                    onTouchEvent(elem, event){
                        const that = this;
                        Threading.initThread("rv_holdButton", () => {
                            java.lang.Thread.sleep(500);
                            while(elem.isTouched){
                                that.turnPage(that.page - 1);
                                java.lang.Thread.sleep(200);
                            }
                            alert("Touch Finish!");
                        });
                    }
                    */
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
                    x: 300, y: 590, z: 1,
                    length: 500 - 60 * 10 / 16, width: 60,
                    bitmapBg: "_default_slot_empty",
                    bitmapBgHover: "_default_slot_empty",
                    onTouchEvent: function (elem, event) {
                        var recipeType = RecipeTypeRegistry.get(_a.select);
                        var recsPerPage = recipeType.getRecipeCountPerPage();
                        var maxPage = Math.ceil(_a.list.length / recsPerPage) - 1;
                        var page = Math.round(event.localX * maxPage);
                        _a.turnPage(page);
                        event.localX = page / maxPage;
                    }
                },
                textPage: { type: "text", x: 300 + 400, y: 590, font: { size: 32, align: UI.Font.ALIGN_CENTER } }
            }
        });
        window.addWindowInstance("overlay", UiFuncs.genOverlayWindow());
        window.setContainer(new UI.Container());
        window.setBlockingBackground(true);
        window.setCloseOnBackPressed(true);
        controller.setEventListener({
            onOpen: function () {
                MainUI.isOpened() && MainUI.setCloseOnBackPressed(false);
            },
            onClose: function () {
                _a.recent.length = 0;
                MainUI.isOpened() && MainUI.setCloseOnBackPressed(true);
            }
        });
        return window;
    })();
    return SubUI;
}());
var RButton = /** @class */ (function () {
    function RButton() {
    }
    RButton.putOnNativeGui = function (screenName, recipeKey) {
        var recipes = (typeof recipeKey === "string" ? [recipeKey] : recipeKey).filter(function (key) { return RecipeTypeRegistry.isExist(key); });
        if (recipes.length > 0) {
            this.data[screenName] = recipes;
        }
    };
    RButton.onNativeGuiChanged = function (screen) {
        this.currentScreen = screen;
        screen in this.data ? this.window.open() : this.window.close();
    };
    RButton.data = {};
    RButton.window = (function () {
        var window = new UI.Window({
            location: { x: 1000 - 200, y: ScreenHeight - 80, width: 64, height: 64 },
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
                output0: { x: 680, y: 190, size: 120 },
                shapelessIcon: { type: "image", x: 740, y: 130, scale: 1.5, bitmap: "rv.shapeless_icon" }
            }
        }) || this;
    }
    WorkbenchRecipe.prototype.convertToJSArray = function (set) {
        var list = [];
        var masks = {};
        var iterator = set.iterator();
        var entry;
        var mask;
        var field;
        var input;
        var i = 0;
        while (iterator.hasNext()) {
            entry = iterator.next();
            mask = entry.getRecipeMask();
            if (mask in masks) {
                continue;
            }
            masks[mask] = true;
            field = entry.getSortedEntries();
            input = [];
            for (i = 0; i < 9; i++) {
                if (!field[i]) {
                    break;
                }
                input[i] = { id: field[i].id, count: 1, data: field[i].data };
            }
            list.push({ input: input, output: [entry.getResult()], isShapeless: mask.startsWith("$$") });
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
    WorkbenchRecipe.prototype.hasAnyRecipe = function (id, data, isUsage) {
        return this.getList(id, Item.getMaxDamage(id) ? -1 : data, isUsage).length > 0;
    };
    WorkbenchRecipe.prototype.onOpen = function (elements, recipe) {
        elements.get("shapelessIcon").setPosition(740, recipe.isShapeless ? 130 : 1000);
    };
    return WorkbenchRecipe;
}(RecipeType));
var FurnaceRecipe = /** @class */ (function (_super) {
    __extends(FurnaceRecipe, _super);
    function FurnaceRecipe() {
        var _this = this;
        var top = 40;
        _this = _super.call(this, "Smelting", VanillaBlockID.furnace, {
            drawing: [
                { type: "bitmap", x: 500 - 66, y: 15 + top, scale: 6, bitmap: "rv.arrow_right" }
            ],
            elements: {
                input0: { x: 500 - 66 - 180, y: top, size: 120 },
                output0: { x: 500 + 66 + 60, y: top, size: 120 }
            }
        }) || this;
        _this.setGridView(3, 1, true);
        return _this;
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
                { type: "bitmap", x: 500 - 104, y: 300 - 240, scale: 16, bitmap: "rv.furnace_burn" }
            ],
            elements: {
                input0: { x: 500 - 120, y: 300, size: 240 },
                text: { type: "text", x: 500, y: 600, multiline: true, font: { size: 80, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER } }
            }
        }) || this;
        _this.setGridView(2, 3, true);
        _this.setDescription("Fuel");
        return _this;
    }
    FurnaceFuelRecipe.prototype.getAllList = function () {
        return ItemList.get()
            .filter(function (item) { return Recipes.getFuelBurnDuration(item.id, item.data) > 0; })
            .sort(function (a, b) { return Recipes.getFuelBurnDuration(b.id, b.data) - Recipes.getFuelBurnDuration(a.id, a.data); })
            .map(function (item) { return ({ input: [{ id: item.id, count: 1, data: item.data }] }); });
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
var LikeFurnaceRecipe = /** @class */ (function (_super) {
    __extends(LikeFurnaceRecipe, _super);
    function LikeFurnaceRecipe(name, icon) {
        var _this = this;
        var top = 40;
        _this = _super.call(this, name, icon, {
            drawing: [
                { type: "bitmap", x: 500 - 66, y: 15 + top, scale: 6, bitmap: "rv.arrow_right" }
            ],
            elements: {
                input0: { x: 500 - 66 - 180, y: top, size: 120 },
                output0: { x: 500 + 66 + 60, y: top, size: 120 }
            }
        }) || this;
        _this.setGridView(3, 1, true);
        _this.recipeList = [];
        return _this;
    }
    LikeFurnaceRecipe.prototype.registerRecipe = function (input, output) {
        this.recipeList.push({
            input: [{ id: input.id, count: 1, data: input.data }],
            output: [{ id: output.id, count: 1, data: output.data }]
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
var BrewingRecipe = /** @class */ (function (_super) {
    __extends(BrewingRecipe, _super);
    function BrewingRecipe() {
        var font = { size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER };
        return _super.call(this, "Potion Brewing", VanillaBlockID.brewing_stand, {
            params: { slot: "classic_slot" },
            drawing: [
                { type: "bitmap", x: 68, y: 60, scale: 4, bitmap: "rv.brewing_stand_back" },
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
    }
    BrewingRecipe.prototype.getAllList = function () {
        return BrewingRecipe.recipeListOld;
        //return isLegacy ? BrewingRecipe.recipeListOld : BrewingRecipe.recipeList;
    };
    BrewingRecipe.recipeList = [];
    /*
        static registerRecipe(input: string, reagent: string, output: string): void {
            const inputItem = BehaviorTools.convertToItem(input);
            const reagentItem = BehaviorTools.convertToItem(reagent);
            const outputItem = BehaviorTools.convertToItem(output);
            inputItem && reagentItem && outputItem && this.recipeList.push({
                input: [
                    {id: VanillaItemID.blaze_powder, count: 1, data: 0},
                    {id: reagentItem.id, count: 1, data: reagentItem.data},
                    {id: inputItem.id, count: 1, data: inputItem.data},
                ],
                output: [
                    {id: outputItem.id, count: 1, data: outputItem.data}
                ]
            });
        }
    */
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
var StonecutterRecipe = /** @class */ (function (_super) {
    __extends(StonecutterRecipe, _super);
    function StonecutterRecipe() {
        var _this = _super.call(this, "Stonecutter", VanillaBlockID.stonecutter_block, {
            drawing: [
                { type: "bitmap", x: 320, y: 520 + 400, scale: 24, bitmap: "rv.arrow_down" }
            ],
            elements: {
                input0: { x: 260, y: 400, size: 480 },
                output0: { x: 260, y: 1088 + 400, size: 480 }
            }
        }) || this;
        _this.setGridView(1, 4, true);
        return _this;
    }
    StonecutterRecipe.registerRecipe = function (input, output) {
        /*
        const find = this.recipeList.find(function(recipe){
            const item = recipe.input[0];
            return item.id === input.id && item.count === input.count && item.data === input.data;
        });
        find ? find.output.push(output) : this.recipeList.push({input: [input], output: [output]});
        */
        this.recipeList.push({ input: [input], output: [output] });
    };
    StonecutterRecipe.prototype.getAllList = function () {
        return StonecutterRecipe.recipeList;
    };
    StonecutterRecipe.recipeList = [];
    return StonecutterRecipe;
}(RecipeType));
var SmithingRecipe = /** @class */ (function (_super) {
    __extends(SmithingRecipe, _super);
    function SmithingRecipe() {
        var _this = this;
        var top = 100;
        _this = _super.call(this, "Smithing", VanillaBlockID.smithing_table, {
            drawing: [
                { type: "bitmap", x: 281, y: 21 + top, scale: 6, bitmap: "rv.plus" },
                { type: "bitmap", x: 614, y: 15 + top, scale: 6, bitmap: "rv.arrow_right" }
            ],
            elements: {
                input0: { x: 80, y: top, size: 120 },
                input1: { x: 440, y: top, size: 120 },
                output0: { x: 800, y: top, size: 120 }
            }
        }) || this;
        _this.setGridView(2, 1, true);
        return _this;
    }
    SmithingRecipe.overrideList = function (recipeList) {
        this.recipeList = recipeList;
    };
    SmithingRecipe.prototype.getAllList = function () {
        return SmithingRecipe.recipeList;
    };
    SmithingRecipe.recipeList = [
        { input: [{ id: VanillaItemID.diamond_sword, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 727, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_shovel, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 726, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_pickaxe, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 804, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_axe, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 835, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_hoe, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 880, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_helmet, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 764, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_chestplate, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 834, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_leggings, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 725, count: 1, data: -1 }] },
        { input: [{ id: VanillaItemID.diamond_boots, count: 1, data: -1 }, { id: 728, count: 1, data: -1 }], output: [{ id: 813, count: 1, data: -1 }] }
    ];
    return SmithingRecipe;
}(RecipeType));
var TradingRecipe = /** @class */ (function (_super) {
    __extends(TradingRecipe, _super);
    function TradingRecipe() {
        var _this = _super.call(this, "Villager Trading", VanillaItemID.emerald, {
            drawing: [
                { type: "bitmap", x: 506, y: 199, scale: 6, bitmap: "rv.bar_trading" }
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
        elements.get("textInfo").setBinding("text", "Level ".concat(recipe.info.tier, " - ").concat(recipe.info.job));
        elements.get("textCount0").setBinding("text", recipe.quantity[0] ? MinMaxtoString(recipe.quantity[0]) : "");
        elements.get("textCount1").setBinding("text", recipe.quantity[1] ? MinMaxtoString(recipe.quantity[1]) : "");
        elements.get("textEnch").setBinding("text", recipe.isEnchanted ? "Enchanted" : "");
    };
    TradingRecipe.setup = function () {
        var _this = this;
        FileTools.GetListOfFiles(__packdir__ + "assets/behavior_packs/vanilla/trading/", ".json").forEach(function (file) {
            try {
                var json = BehaviorJsonReader.readJson(file.getAbsolutePath());
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
                        input = BehaviorJsonReader.convertToItem(trade.wants[0].item);
                        amount = trade.wants[0].quantity;
                        if (trade.wants[1]) {
                            input2 = BehaviorJsonReader.convertToItem(trade.wants[1].item);
                            amount2 = trade.wants[1].quantity;
                        }
                        else {
                            input2 = amount2 = null;
                        }
                        output = BehaviorJsonReader.convertToItem(trade.gives[0].item);
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
var LiquidFillingRecipe = /** @class */ (function (_super) {
    __extends(LiquidFillingRecipe, _super);
    function LiquidFillingRecipe() {
        var _this = this;
        var top = 50;
        var size = 300;
        _this = _super.call(this, "Liquid Filling", VanillaItemID.bucket, {
            drawing: [
                { type: "frame", x: 500 - size / 2, y: size * 2 + top, width: size, height: size, scale: 12, bitmap: "default_container_frame" },
                { type: "bitmap", x: 500 - 90, y: size + 18 + top, scale: 12, bitmap: "rv.arrow_down" }
            ],
            elements: {
                input0: { x: 500 - size / 2, y: top, size: size },
                output0: { x: 500 - size / 2, y: size * 3.75 + top, size: size },
                inputLiq0: { x: 500 - size / 2 + 12, y: size * 2 + 12 + top, width: size - 24, height: size - 24 }
            }
        }) || this;
        _this.setGridView(1, 3, true);
        _this.setTankLimit(1000);
        return _this;
    }
    LiquidFillingRecipe.prototype.getAllList = function () {
        var list = [];
        var empty;
        var full;
        for (var key in LiquidRegistry.EmptyByFull) {
            empty = LiquidRegistry.EmptyByFull[key];
            full = key.split(":");
            list.push({
                input: [{ id: empty.id, count: 1, data: empty.data }],
                output: [{ id: +full[0], count: 1, data: +full[1] }],
                inputLiq: [{ liquid: empty.liquid, amount: 1000 }]
            });
        }
        return list;
    };
    return LiquidFillingRecipe;
}(RecipeType));
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
(function () {
    if (Cfg.$workbench) {
        RecipeTypeRegistry.register("workbench", new WorkbenchRecipe());
    }
    if (Cfg.$furnace) {
        RecipeTypeRegistry.register("furnace", new FurnaceRecipe());
    }
    if (Cfg.$fuel) {
        RecipeTypeRegistry.register("fuel", new FurnaceFuelRecipe());
    }
    if (Cfg.$blast_furnace) {
        RecipeTypeRegistry.register("blast_furnace", BlastFurnaceRecipe);
    }
    if (Cfg.$smoker) {
        RecipeTypeRegistry.register("smoker", SmokerRecipe);
    }
    if (Cfg.$campfire) {
        RecipeTypeRegistry.register("campfire", CampfireRecipe);
    }
    if (Cfg.$brewing) {
        RecipeTypeRegistry.register("brewing", new BrewingRecipe());
    }
    if (Cfg.$stonecutter) {
        RecipeTypeRegistry.register("stonecutter", new StonecutterRecipe());
    }
    if (Cfg.$smithing && !isLegacy) {
        RecipeTypeRegistry.register("smithing", new SmithingRecipe());
    }
    if (Cfg.$trading) {
        RecipeTypeRegistry.register("trading", new TradingRecipe());
    }
    if (Cfg.$liquid_filling) {
        RecipeTypeRegistry.register("liquid_filling", new LiquidFillingRecipe());
    }
    RButton.putOnNativeGui("innercore_generic_crafting_screen", "workbench");
    RButton.putOnNativeGui("furnace_screen", ["furnace", "fuel"]);
    RButton.putOnNativeGui("blast_furnace_screen", ["blast_furnace", "fuel"]);
    RButton.putOnNativeGui("smoker_screen", ["smoker", "fuel"]);
    RButton.putOnNativeGui("brewing_stand_screen", "brewing");
    RButton.putOnNativeGui("stonecutter_screen", "stonecutter");
    RButton.putOnNativeGui("smithing_table_screen", "smithing");
    RButton.putOnNativeGui("trade_screen", "trading");
})();
ModAPI.addAPICallback("KernelExtension", function (api) {
    if (typeof api.getKEXVersionCode !== "function" || api.getKEXVersionCode() < 300) {
        return;
    }
    getNumericID = function (key) { return api.AddonUtils.getNumericIdFromIdentifier(String(key).slice(("minecraft:").length)); };
    SmithingRecipe.overrideList(Recipes.getAllSmithingTableRecipes().map(function (recipe) { return ({
        input: [
            { id: recipe.baseID, count: 1, data: -1 },
            { id: recipe.additionID, count: 1, data: -1 }
        ],
        output: [{ id: recipe.resultID, count: 1, data: -1 }]
    }); }));
    /*
    
        const addMobDropRecipe = (name: string, tableName: string): void => {
            api.LootModule.createLootTableModifier(tableName).addJSPostModifyCallback(json => {
                MobDropRecipe.registerRecipe(name, json)
            });
            api.LootModule.forceLoad(tableName);
        }
    
        addMobDropRecipe("Zombie", "entities/zombie");
        addMobDropRecipe("Skeleton", "entities/skeleton");
        addMobDropRecipe("Spider", "entities/spider");
        addMobDropRecipe("Creeper", "entities/creeper");
    
    */
});
Callback.addCallback("PostLoaded", function () {
    ItemList.addVanillaItems();
    TradingRecipe.setup();
    if (isLegacy) {
        Threading.initThread("rv_PostLoaded", function () {
            BehaviorJsonReader.readListOfJson(__packdir__ + "assets/definitions/recipe/").forEach(function (json) {
                if (json.type === "furnace_recipe") {
                    var furnaceIn = BehaviorJsonReader.convertToItem(json.input);
                    var furnaceOut = BehaviorJsonReader.convertToItem(json.output);
                    if (furnaceIn && furnaceOut) {
                        for (var i = 0; i < json.tags.length; i++) {
                            switch (json.tags[i]) {
                                case "blast_furnace":
                                    BlastFurnaceRecipe.registerRecipe(furnaceIn, furnaceOut);
                                    break;
                                case "smoker":
                                    SmokerRecipe.registerRecipe(furnaceIn, furnaceOut);
                                    break;
                                case "campfire":
                                    CampfireRecipe.registerRecipe(furnaceIn, furnaceOut);
                                    break;
                            }
                        }
                    }
                }
                else if (json.type === "crafting_shapeless") {
                    if (json.tags.some(function (tag) { return tag === "stonecutter"; })) {
                        var stonecutterIn = { id: getNumericID(json.ingredients[0].item), count: json.ingredients[0].count || 1, data: json.ingredients[0].data || 0 };
                        var stonecutterOut = { id: getNumericID(json.result.item), count: json.result.count || 1, data: json.result.data || 0 };
                        StonecutterRecipe.registerRecipe(stonecutterIn, stonecutterOut);
                    }
                }
            });
        });
    }
    else {
        Threading.initThread("rv_PostLoaded", function () {
            BehaviorJsonReader.readListOfJson(__packdir__ + "assets/behavior_packs/vanilla/recipes/").forEach(function (json) {
                if (json["minecraft:recipe_furnace"]) {
                    var recipe = json["minecraft:recipe_furnace"];
                    var furnaceIn = BehaviorJsonReader.convertToItem(recipe.input);
                    var furnaceOut = BehaviorJsonReader.convertToItem(recipe.output);
                    if (furnaceIn && furnaceOut) {
                        for (var i = 0; i < recipe.tags.length; i++) {
                            switch (recipe.tags[i]) {
                                case "blast_furnace":
                                    BlastFurnaceRecipe.registerRecipe(furnaceIn, furnaceOut);
                                    break;
                                case "smoker":
                                    SmokerRecipe.registerRecipe(furnaceIn, furnaceOut);
                                    break;
                                case "campfire":
                                    CampfireRecipe.registerRecipe(furnaceIn, furnaceOut);
                                    break;
                            }
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
                    var stonecutterIn = { id: getNumericID(recipe.ingredients[0].item), count: recipe.ingredients[0].count || 1, data: recipe.ingredients[0].data || 0 };
                    var stonecutterOut = { id: getNumericID(recipe.result.item), count: recipe.result.count || 1, data: recipe.result.data || 0 };
                    recipe.tags.some(function (tag) { return tag === "stonecutter"; }) && StonecutterRecipe.registerRecipe(stonecutterIn, stonecutterOut);
                }
            });
        });
    }
});
Callback.addCallback("LevelLoaded", function () {
    joinThread("rv_PostLoaded", "[RV]: Loading vanilla recipe Jsons", "[RV]: Finish!");
    Threading.initThread("rv_LevelLoaded", function () {
        ItemList.addModItems();
        ItemList.setup();
        Cfg.loadIcon && ItemList.cacheIcons();
        SubUI.setupWindow();
    });
});
ModAPI.registerAPI("RecipeViewer", {
    Core: OldVersion,
    ItemList: ItemList,
    RecipeType: RecipeType,
    RecipeTypeRegistry: RecipeTypeRegistry
});
