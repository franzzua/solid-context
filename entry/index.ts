import {init} from "@hypertype/ui";
import {ContextContainer} from "./container";
import {ApplicationBuilder} from "@hypertype/app";
import {UIContainer} from "../ui/container";
import {Container} from "@hypertype/core";
import {AppContainer, IApplication} from "@app";
import {DomainContainer} from "@domain";
import {InfrContainer} from "@infr";

const app =ApplicationBuilder
    .withInfrustructure(DomainContainer)
    .withInfrustructure(AppContainer)
    .withInfrustructure(InfrContainer)
    .withUI(UIContainer)
    .withRouter({
    routes: [
        {name: 'base', path: '/', forwardTo: 'tree'},
        {name: 'tree', path: '/tree', }
    ],
    options: null
}).build();

init(app.get<Container>(Container));
app.get<IApplication>(IApplication).Start();