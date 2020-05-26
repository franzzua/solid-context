import {Container} from "@hypertype/core";
import {ContextComponent} from "./context/context.component";
import {TreeComponent} from "./tree/tree.component";
import {RootComponent} from "./app-root/root.component";
import {KeyboardHandler} from "./handlers/keyboard.handler";

export const UIContainer = Container.withProviders(
    // WhiteboardComponent,
    ContextComponent,
    TreeComponent,
    RootComponent,
    KeyboardHandler
);
