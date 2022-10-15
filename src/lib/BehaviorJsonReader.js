LIBRARY({
    name: "BehaviorJsonReader",
    version: 2,
    shared: true,
    api: "CoreEngine"
});
var BehaviorJsonReader;
(function (BehaviorJsonReader) {
    var jsonCache = {};
    var clearCache = function () {
        for (var path in jsonCache) {
            delete jsonCache[path];
        }
    };
    Callback.addCallback("LevelLoaded", function () { return clearCache(); });
    Callback.addCallback("LevelLeft", function () { return clearCache(); });
    BehaviorJsonReader.readJson = function (path) {
        if (path in jsonCache) {
            return jsonCache[path] || null;
        }
        var reader = new java.io.BufferedReader(new java.io.FileReader(path));
        var lines = [];
        var str;
        var i;
        while (str = reader.readLine()) {
            i = str.indexOf("//");
            lines.push(i === -1 ? str : str.slice(0, i));
        }
        reader.close();
        try {
            var json = JSON.parse(lines.join("\n")) || null;
            if (json) {
                jsonCache[path] = json;
                return json;
            }
        }
        catch (e) {
        }
        return null;
    };
    var getAllJsonPath = function (path) {
        var dir = new java.io.File(path);
        var files = dir.listFiles();
        var paths = [];
        for (var i = 0; i < files.length; i++) {
            if (!files[i].isDirectory() && files[i].getName().endsWith(".json")) {
                paths.push(files[i].getAbsolutePath());
            }
        }
        return paths;
    };
    BehaviorJsonReader.readListOfJson = function (path) {
        var paths = getAllJsonPath(path);
        var list = [];
        var json;
        for (var i = 0; i < paths.length; i++) {
            json = BehaviorJsonReader.readJson(paths[i]);
            json && list.push(json);
        }
        return list;
    };
    BehaviorJsonReader.forEachJson = function (path, callback, threads) {
        if (threads === void 0) { threads = 1; }
        var paths = getAllJsonPath(path);
        var max = Math.ceil(paths.length / threads);
        for (var i = 0; i < threads; i++) {
            Threading.initThread("processJson_" + i, function () {
                var split = paths.splice(0, max);
                var json;
                for (var j = 0; j < split.length; j++) {
                    json = BehaviorJsonReader.readJson(split[j]);
                    json && callback(json);
                }
            });
        }
        var thread;
        for (var i = 0; i < threads; i++) {
            thread = Threading.getThread("processJson_" + i);
            thread && thread.join();
        }
    };
    BehaviorJsonReader.getNumericID = function (key) {
        if (!key.startsWith("minecraft:")) {
            return 0;
        }
        var key2 = key.slice(("minecraft:").length);
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
    BehaviorJsonReader.convertToItem = function (str) {
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
    /*
    private static potionMeta = {

    } as const;

    static convertToItemForPotion(str: string): Tile {
        const suffix = "minecraft:potion_type:";
        if(str.startsWith(suffix)){

        }

        const split = str.split(":");
        if(split.length >= 2 && split[0] === "minecraft"){
            const key = split[1].toLowerCase();
            const id: number = VanillaBlockID[key] || VanillaItemID[key];
            const data: number = this.potionMeta[split[2]];
            if(id){
                return {id: id, data: +split[2] || -1};
            }
        }
        return null;
    }
    */
})(BehaviorJsonReader || (BehaviorJsonReader = {}));
EXPORT("BehaviorJsonReader", BehaviorJsonReader);
