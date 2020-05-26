import {Container} from "@hypertype/core";
import {InfrContainer} from "@infr";
import {AppContainer} from "@app";
import {UIContainer} from "../ui/container";
import {init} from "@hypertype/ui"

export const ContextContainer = Container.withProviders(
    ...AppContainer.getProviders(),
    ...InfrContainer.getProviders(),
);

