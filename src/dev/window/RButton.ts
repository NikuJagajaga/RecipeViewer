class RButton {

    private static currentScreen: string;
    private static data: {[screen: string]: string} = {};

    private static window: UI.Window = (() => {

        const window = new UI.Window({
            location: {x: ScreenWidth - 128, y: ScreenHeight - 96, width: 64, height: 64},
            elements: {
                button: {
                    type: "button",
                    x: 0, y: 0, scale: 62.5,
                    bitmap: "default_button_up", bitmap2: "default_button_down",
                    clicker: {
                        onClick: () => {
                            const key = RButton.data[RButton.currentScreen];
                            key && RecipeTypeRegistry.openRecipePage(key);
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

        window.setAsGameOverlay(true);

        return window;

    })();

    static putOnNativeGui(screenName: string, recipeTypeKey: string): void {
        const recipeType = RecipeTypeRegistry.get(recipeTypeKey);
        if(recipeType){
            this.data[screenName] = recipeTypeKey;
        }
    }

    static onNativeGuiChanged(screen: string): void {
        this.currentScreen = screen;
        screen in this.data ? this.window.open() : this.window.close();
    }

}


Callback.addCallback("NativeGuiChanged", (screen: string) => {
    RButton.onNativeGuiChanged(screen);
});