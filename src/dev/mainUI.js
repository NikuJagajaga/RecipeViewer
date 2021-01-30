const MainUI = {

    list: [],
    slotCount: 0,
    page: 0,

    window: null,
    elements: null,

    setupWindow: function(){

        const elements = {
            close: {
                type: "closeButton",
                x: 946, y: 0, scale: 3,
                bitmap: "close_button_up", bitmap2: "close_button_down"
            },
            buttonSearch: {
                type: "button",
                x: 20, y: 20, scale: 0.8,
                bitmap: "mod_browser_search_field",
                clicker: {onClick: function(){
                    Context.runOnUiThread(new java.lang.Runnable({
                        run: function(){
                            try{
                                const editText = new android.widget.EditText(Context);
                                editText.setHint("in this space");
                                new android.app.AlertDialog.Builder(Context)
                                    .setTitle("Please type the keywords")
                                    .setView(editText)
                                    .setPositiveButton("Search", new android.content.DialogInterface.OnClickListener({
                                        onClick: function(){
                                            const keyword = editText.getText() + "";
                                            MainUI.elements.get("textSearch").onBindingUpdated("text", keyword.length ? keyword : "Search");
                                            MainUI.list = RecipeViewer.list.filter(function(item){
                                                return item.name.match(new RegExp(keyword, "i"));
                                            });
                                            MainUI.page = 0;
                                            MainUI.refresh();
                                        }
                                    })).show();
                            }
                            catch(e){
                                alert(e);
                            }
                        }
                    }));
                }}
            },
            textSearch: {
                type: "text",
                x: 30, y: 30, z: 1,
                font: {color: Color.WHITE, size: 20},
                text: "Search"
            },
            buttonSort: {
                type: "button",
                x: 450, y: 20, scale: 0.8,
                bitmap: "mod_browser_button", bitmap2: "mod_browser_button_down",
                clicker: {onClick: function(){
                    MainUI.changeSortMode();
                }}
            },
            textSort: {
                type: "text",
                x: 465, y: 30, z: 1,
                text: "",
                font: {color: Color.WHITE, size: 16, shadow: 0.5}
            }
        };

        let x = y = i = 0;
        for(y = 68; y <= ScreenHeight - 120; y += 60){
        for(x = 20; x <= 920; x += 60){
            elements["button" + i] = {
                type: "button",
                x: x, y: y, scale: 3.75,
                bitmap: "default_button_up", bitmap2: "default_button_down",
            };
            elements["slot" + i] = {
                type: "slot",
                x: x, y: y, z: 1,
                visual: true, needClean: true,
                clicker: RecipeViewer.clicker
            };
            i++;
        }
        }

        this.slotCount = i;

        elements.buttonPrev = {
            type: "button",
            x: 20, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p",
            clicker: {onClick: function(){
                MainUI.page--;
                MainUI.refresh();
            }}
        };

        elements.buttonNext = {
            type: "button",
            x: 884, y: ScreenHeight - 60, scale: 2,
            bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p",
            clicker: {onClick: function(){
                MainUI.page++;
                MainUI.refresh();
            }}
        };

        elements.textPage = {type: "text", x: 490, y: ScreenHeight - 80, font: {size: 40, align: 1}};

        this.window = new UI.Window({
            location: {
                padding: {
                    left: __config__.getNumber("Padding.left"),
                    right: __config__.getNumber("Padding.right")
                }
            },
            params: {slot: "_default_slot_empty"},
            drawing: [
                //{type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: ScreenWidth, height: ScreenHeight, bitmap: "default_frame_bg_light", scale: 2}
            ],
            elements: elements
        });

        this.window.setBlockingBackground(true);
        this.window.setAsGameOverlay(true);
        this.elements = this.window.getElements();
        this.window.setEventListener({
            onOpen:function(){
                RecipeViewer.startWindow.close();
            },
            onClose:function(){
                RecipeViewer.startWindow.open();
            }
        });
    },

    currentMode: 0,
    sortMode: [
        {text: "Sort by ID (ASC)", type: "id", reverse: false},
        {text: "Sort by ID (DESC)", type: "id", reverse: true},
        {text: "Sort by Name (ASC)", type: "name", reverse: false},
        {text: "Sort by Name (DESC)", type: "name", reverse: true}
    ],

    sortFunc: {
        id: function(a, b){
            if(a.type === "block" && b.type === "item"){
                return -1;
            }
            if(a.type === "item" && b.type === "block"){
                return 1;
            }
            return a.id - b.id || a.data - b.data;
        },
        name: function(a, b){
            return a.name > b.name ? 1 : -1;
        }
    },

    changeSortMode: function(notChange){
        notChange || this.currentMode++;
        this.currentMode &= 3;
        const mode = this.sortMode[this.currentMode];
        this.window.getElements().get("textSort").onBindingUpdated("text", mode.text);
        this.list.sort(this.sortFunc[mode.type]);
        mode.reverse && this.list.reverse();
        this.page = 0;
        this.refresh();
    },

    refresh: function(){
        const maxPage = (this.list.length / this.slotCount | 0) + 1;
        this.page = this.page < 0 ? maxPage - 1 : this.page >= maxPage ? 0 : this.page;
        this.elements.get("textPage").onBindingUpdated("text", (this.page + 1) + " / " + maxPage);
        let item;
        for(let i = 0; i < this.slotCount; i++){
            item = this.list[this.slotCount * this.page + i];
            this.elements.get("slot" + i).onBindingUpdated("source", item ? {id: item.id, count: 1, data: item.data} : {id: 0, count: 0, data: 0});
        }
    },

    openWindow: function(list){
        this.list = list;
        this.page = 0;
        this.changeSortMode(true);
        this.window.open();
    }

};