namespace UiFuncs {

    const Bitmap = android.graphics.Bitmap;
    const Canvas = android.graphics.Canvas;
    const tooltipsFont = new UI.Font({color: Color.WHITE, size: 16, shadow: 0.5});


    const hlBmp = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
    const hlCvs = new Canvas(hlBmp);
    hlCvs.drawARGB(127, 255, 255, 255);

    UI.TextureSource.put("rv.highlight_rect", hlBmp);


    export const slotClicker: UI.UIClickEvent = {
        onClick: (container, tile, elem) => {
            const source = elem.getBinding("source");
            if(!Cfg.preventMistap || !isDuringPopup(elem)){
                SubUI.openItemView(source.id, source.data, false) && show404Anim(elem);
            }
        },
        onLongClick: (container, tile, elem) => {
            const source = elem.getBinding("source");
            if(!Cfg.preventMistap || !isDuringPopup(elem)){
                SubUI.openItemView(source.id, source.data, true) && show404Anim(elem);
            }
        }
    };

    export const tankClicker: UI.UIClickEvent = {
        onClick: (container, tile, elem) => {
            if(!Cfg.preventMistap || !isDuringPopup(elem)){
                SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), false) && show404Anim(elem);
            }
        },
        onLongClick: (container, tile, elem) => {
            if(!Cfg.preventMistap || !isDuringPopup(elem)){
                SubUI.openLiquidView(RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + ""), true) && show404Anim(elem);
            }
        }
    };

    export const genOverlayWindow = (): UI.Window => {
        const window = new UI.Window({
            location: {x: 0, y: 0, width: 1000, height: ScreenHeight},
            elements: {
                highlightRect: {
                    type: "image",
                    x: -1000,
                    y: -1000,
                    width: 64,
                    height: 64,
                    scale: 1,
                    bitmap: "rv.highlight_rect"
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
                    font: tooltipsFont.asScriptable(),
                    multiline: true
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
        window.setBackgroundColor(Color.TRANSPARENT);
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

    export const getElementName = (elem: UI.Element): string => {
        const iterator = elem.window.getContentProvider().elementMap.entrySet().iterator();
        let entry: java.util.Map.Entry<string, UI.Element>;
        while(iterator.hasNext()){
            entry = iterator.next();
            if(elem.equals(entry.getValue())){
                return entry.getKey() + "";
            }
        }
        return "";
    }

    const getWindowGroup = (elem: UI.Element): UI.IWindow => {
        const win = elem.window.getParentWindow() as UI.Window;
        if("addWindow" in win){
            return win;
        }
        return win.getParentWindow();//adjacent
    }

    const FrameTex = UI.FrameTextureSource.get("workbench_frame3");
    const FrameTexCentralColor = FrameTex.getCentralColor();

    export const popupTips = (str: string, elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}): void => {
        const location = elem.window.getLocation();
        const elements = getWindowGroup(elem).getElements();
        const highlight = elements.get("highlightRect");
        const text = elements.get("popupText");
        const frame = elements.get("popupFrame");
        const MOVEtoLONG_CLICK = event.type == "LONG_CLICK" && frame.x !== -1000 && frame.y !== -1000;
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        if(str && (event.type == "MOVE" || MOVEtoLONG_CLICK)){

            x = location.x + location.windowToGlobal(elem.x) | 0;
            y = location.y + location.windowToGlobal(elem.y) | 0;
            w = location.windowToGlobal(elem.elementRect.width()) | 0;
            h = location.windowToGlobal(elem.elementRect.height()) | 0;
            if(highlight.elementRect.width() !== w || highlight.elementRect.height() !== h){
                highlight.texture?.resizeAll(w, h);
                highlight.setSize(w, h);
            }
            highlight.setPosition(x, y);

            const split = str.split("\n");
            w = Math.max(...split.map(s => tooltipsFont.getTextWidth(s, 1))) + 20;
            h = split.length * 18 + 16;
            x = location.x + location.windowToGlobal(event.x);
            y = location.y + location.windowToGlobal(event.y) - h - 50;
            if(y < -10){
                y = location.y + location.windowToGlobal(event.y) + 70;
            }
            if(frame.elementRect.width() !== w || frame.elementRect.height() !== h){
                frame.texture?.release();
                frame.texture = new UI.Texture(FrameTex.expandAndScale(w, h, 1, FrameTexCentralColor));
                frame.setSize(w, h);
            }
            frame.setPosition(Math_clamp(x - w / 2, 0, 1000 - w), y);
            text.setPosition(Math_clamp(x - w / 2, 0, 1000 - w) + 10, y + 7);
            text.setBinding("text", str);

            if(!Threading.getThread("rv_popupTips")){
                Threading.initThread("rv_popupTips", () => {
                    while(elem.isTouched){
                        java.lang.Thread.sleep(200);
                    }
                    highlight.setPosition(-1000, -1000);
                    frame.setPosition(-1000, -1000);
                    text.setPosition(-1000, -1000);
                });
            }

        }
        else{
            highlight.setPosition(-1000, -1000);
            frame.setPosition(-1000, -1000);
            text.setPosition(-1000, -1000);
        }
    }

    const isDuringPopup = (elem: UI.Element): boolean => {
        const frame = getWindowGroup(elem).getElements().get("popupFrame");
        return frame.x !== -1000 && frame.y !== -1000;
    }

    export const onTouchSlot = (elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}): void => {
        let str = "";
        if(elem.source.id !== 0){
            str = ItemList.getName(elem.source.id, elem.source.data);
            if(Cfg.showId){
                str += elem.source.data === -1 ? `\n(#${elem.source.id})` : `\n(#${elem.source.id}/${elem.source.data})`;
            }
        }
        popupTips(str, elem, event);
    }

    export const onTouchTank = (elem: UI.Element, event: {x: number, y: number, localX: number, localY: number, type: TouchEventType}): void => {
        const liquid = RecipeTypeRegistry.getLiquidByTex(elem.getBinding("texture") + "");
        popupTips(LiquidRegistry.isExists(liquid) ? LiquidRegistry.getLiquidName(liquid) : "", elem, event);
    }

    export const show404Anim = (elem: UI.Element) => {
        const window = getWindowGroup(elem);
        const text = window.getElements().get("notFound");
        const location = elem.window.getLocation();
        const x = location.x + location.windowToGlobal(elem.elementRect.centerX());
        const y = location.y + location.windowToGlobal(elem.elementRect.centerY()) - 32;
        Threading.initThread("rv_404Anim", () => {
            let step = 0;
            while(window.isOpened() && step <= 3){
                step & 1 ? text.setPosition(-1000, -1000) : text.setPosition(x, y);
                step++;
                java.lang.Thread.sleep(100);
            }
        });
    }

}
