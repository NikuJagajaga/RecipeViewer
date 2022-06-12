class NextGenUI {

    static page = 0;
    static list: ItemInfo[] = [];

    private static slotCountX = 12;
    private static slotCountY = 16;

    static window: UI.WindowGroup = (() => {

        const windowGroup = new UI.WindowGroup();

        windowGroup.addWindow("controller", {
            location: {x: 0, y: 0, width: 1000, height: ScreenHeight},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: ScreenHeight, bitmap: "classic_frame_bg_light", scale: 2},
                {type: "frame", x: 20 - 2, y: 60 - 2, width: 960 + 4, height: ScreenHeight - 60 - 20 + 4, bitmap: "default_frame_slot_dark", scale: 2}
            ],
            elements: {}
        });

        const itemElem: UI.UIElementSet = {};

        const slotSize = 1000 / this.slotCountX;

        //1280 -> 2076

        for(let i = 0; i < this.slotCountX * this.slotCountY; i++){
            itemElem["slot" + i] = {
                type: "slot",
                x: (i % this.slotCountX) * slotSize,
                y: (i / this.slotCountX | 0) * slotSize,
                size: slotSize,
                visual: true,
                clicker: {
                    onClick: (container, tile, elem) => {
                        const layout = elem.window.layout
                        alert("height: " + layout.getHeight() + " = " + layout.getLayoutParams().height + "\nscrollY: " + layout.getScrollY());

                    }
                }
            };
        }

        const itemWindow = new UI.Window({
            location: {x: 20, y: 60, width: 960, height: ScreenHeight - 60 - 20, scrollY: 960 / this.slotCountX * this.slotCountY},
            drawing: [
                {type: "background", color: UI.FrameTextureSource.get("default_frame_slot_dark").getCentralColor()}
            ],
            elements: itemElem
        });

        windowGroup.addWindowInstance("list", itemWindow);
        windowGroup.setCloseOnBackPressed(true);

        return windowGroup;

    })();

    static refreshSlot(): void {
        const elements = this.window.getElements();
        let item: ItemInfo;
        for(let i = 0; i < this.slotCountX * this.slotCountY; i++){
            item = this.list[(this.slotCountX * this.slotCountY / 2) * this.page + i];
            elements.get("slot" + i).setBinding("source", item ? {id: item.id, count: 1, data: item.data} : {id: 0, count: 0, data: 0});
        }
    }

    static openWindow(): void {
        this.list = ItemList.get();
        this.page = 0;
        this.window.open();
        //this.refreshSlot();
    }

}


Callback.addCallback("tick", () => {

    const MAX = 2076;

    if(NextGenUI.window.isOpened()){

        const layout = NextGenUI.window.getWindow("list").layout;
        const scrollY = layout.getScrollY();

        if(scrollY <= 0 && NextGenUI.page > 0){
            NextGenUI.page--;
            layout.setScrollY(MAX / 2);
            NextGenUI.refreshSlot();
        }

        if(scrollY >= MAX && NextGenUI.page < 8){
            NextGenUI.page++;
            layout.setScrollY(MAX / 2);
            NextGenUI.refreshSlot();
        }

    }

});