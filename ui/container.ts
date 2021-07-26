import {Container} from "@hypertype/core";
import {ContextComponent} from "./context/context.component";
import {TreeComponent} from "./tree/tree.component";
import {RootComponent} from "../entry/app-root/root.component";
import {KeyboardHandler} from "./handlers/keyboard.handler";
import {TextContentComponent} from "./context/text-content.component";
import {TripContainer} from "../trip/TripContainer";

export const UIContainer = Container.withProviders(
    // WhiteboardComponent,
    ContextComponent,
    TreeComponent,
    RootComponent,
    TextContentComponent,
    KeyboardHandler
);

UIContainer.provide(TripContainer);