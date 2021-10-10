namespace UiFuncs {

    export const slotClicker: UI.UIClickEvent = {
        onClick: (container, tile, elem) => {
            SubUI.openItemView(elem.source.id, elem.source.data, false) && show404Anim(elem);
        },
        onLongClick: (container, tile, elem) => {
            SubUI.openItemView(elem.source.id, elem.source.data, true) && show404Anim(elem);
        }
    };

    export const tankClicker: UI.UIClickEvent = {
        onClick: (container, tile, elem) => {
            SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), false) && show404Anim(elem);
        },
        onLongClick: (container, tile, elem) => {
            SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), true) && show404Anim(elem);
        }
    };

    export const genOverlayWindow = (): UI.Window => {
        const window = new UI.Window({
            location: {x: 0, y: 0, width: 1000, height: ScreenHeight},
            drawing: [{type: "background", color: Color.TRANSPARENT}],
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
                    font: {color: Color.WHITE, size: 24, shadow: 0.5, align: UI.Font.ALIGN_CENTER}
                },
                notFound: {
                    type: "text",
                    x: -1000,
                    y: -1000,
                    text: "404",
                    font: {color: Color.RED, size: 32, shadow: 0.5, align: UI.Font.ALIGN_CENTER}
                }
            }
        });
        window.setTouchable(false);
        window.setAsGameOverlay(true);
        window.setEventListener({
            onOpen: win => {
                const elems = win.getElements();
                elems.get("popupText").setPosition(-1000, -1000);
                elems.get("popupFrame").setPosition(-1000, -1000);
                elems.get("notFound").setPosition(-1000, -1000);
            }
        });
        return window;
    }

    export const moveOverlayOnTop = (winGroup: UI.WindowGroup): void => {
        if(!winGroup.isOpened()){
            winGroup.moveOnTop("overlay");
            return;
        }
        const ovl = winGroup.getWindow("overlay");
        ovl.setParentWindow(null);
        ovl.close();
        ovl.setParentWindow(winGroup);
        ovl.open();
    }

    export const popupTips = (str: string, elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}): void => {
        const elements = elem.window.getParentWindow().getElements();
        const text = elements.get("popupText");
        const frame = elements.get("popupFrame");
        if(str && event.type == "MOVE"){
            const frameTex = UI.FrameTextureSource.get("workbench_frame3");
            const width = McFontPaint.measureText(str) + 30;
            const location = elem.window.getLocation();
            const x = location.x + location.windowToGlobal(event.x);
            const y = location.y + location.windowToGlobal(event.y);
            frame.setSize(width, 48);
            frame.setBinding("texture", frameTex.expandAndScale(width, 48, 3, frameTex.getCentralColor()));
            frame.setPosition(Math_clamp(x - width / 2, 0, 1000 - width), Math.max(y - 100, 0));
            text.setPosition(Math_clamp(x, width / 2, 1000 - width / 2), Math.max(y - 100, 0) - 3);
            text.setBinding("text", str);
        }
        else{
            frame.setPosition(-1000, -1000);
            text.setPosition(-1000, -1000);
        }
    }

    export const onTouchSlot = (elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}): void => {
        popupTips(elem.source.id !== 0 ? ItemList.getName(elem.source.id, elem.source.data) : "", elem, event);
    }

    export const onTouchTank = (elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}): void => {
        const liquid = RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + "");
        popupTips(LiquidRegistry.isExists(liquid) ? LiquidRegistry.getLiquidName(liquid) : "", elem, event);
    }

    export const show404Anim = (elem: UI.Element) => {
        const window = elem.window.getParentWindow();
        const text = window.getElements().get("notFound");
        const location = elem.window.getLocation();
        const x = location.x + location.windowToGlobal(elem.elementRect.centerX());
        const y = location.y + location.windowToGlobal(elem.elementRect.centerY()) - 32;
        Threading.initThread("rv_404Anim", () => {
            let step = 0;
            while(window.isOpened() && step <= 3){
                step & 1 ? text.setPosition(-1000, -1000) : text.setPosition(x, y);
                step++;
                java.lang.Thread.sleep(200);
            }
        });
    }

}