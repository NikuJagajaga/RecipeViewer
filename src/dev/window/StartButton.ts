const StartButton = new UI.Window({
    location: {x: 0, y: 0, width: 64, height: 64},
    elements: {
        button: {
            type: "button",
            x: 0, y: 0, scale: 62.5,
            bitmap: "default_button_up", bitmap2: "default_button_down",
            clicker: {
                onClick: () => {
                    MainUI.openWindow();
                },
                onLongClick: () => {
                    const list: ItemInfo[] = [];
                    let inv: ItemInstance;
                    for(let i = 0; i <= 36; i++){
                        inv = Player.getInventorySlot(i);
                        inv.id && list.push({id: inv.id, data: inv.data, name: ItemList.getName(inv.id, inv.data), type: ItemList.getItemType(inv.id)});
                    }
                    MainUI.openWindow(list.filter(removeDuplicateFilterFunc));
                }
            }
        },
        text: {
            type: "text",
            x: 300, y: 120, z: 1,
            text: "R",
            font: {color: Color.WHITE, size: 600, shadow: 0.5}
        }
    }
});

StartButton.setAsGameOverlay(true);


Callback.addCallback("PostLoaded", () => {
    const x = Cfg.buttonX;
    const y = Cfg.buttonY;
    StartButton.getLocation().set(x < 0 ? 1000 - (-x): x, y < 0 ? ScreenHeight - (-y): y, 64, 64);
});


const InventoryScreen = {
    inventory_screen: true,
    inventory_screen_pocket: true,
    survival_inventory_screen: true,
    creative_inventory_screen: true
} as const;

Callback.addCallback("NativeGuiChanged", (screen: string) => {
    InventoryScreen[screen] ? StartButton.open() : StartButton.close();
});