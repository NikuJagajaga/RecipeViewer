class RButton {

    private static currentScreen: string;
    private static data: {[screen: string]: string[]} = {};

    private static window: UI.Window = (() => {

        const window = new UI.Window({
            location: {x: 1000 - 200, y: ScreenHeight - 80, width: 64, height: 64},
            elements: {
                button: {
                    type: "button",
                    x: 0, y: 0, scale: 62.5,
                    bitmap: "default_button_up", bitmap2: "default_button_down",
                    clicker: {
                        onClick: () => {
                            const recipes = RButton.data[RButton.currentScreen];
                            recipes && RecipeTypeRegistry.openRecipePage(recipes);
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

    static putOnNativeGui(screenName: string, recipeKey: string | string[]): void {
        const recipes = (typeof recipeKey === "string" ? [recipeKey] : recipeKey).filter(key => RecipeTypeRegistry.isExist(key));
        if(recipes.length > 0){
            this.data[screenName] = recipes;
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