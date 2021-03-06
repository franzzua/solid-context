import {init} from "@hypertype/ui";
import {BrowserContainer} from "@hypertype/infr-browser";
import {ApplicationBuilder} from "@hypertype/app";
import {UIContainer} from "../ui/container";
import {Container} from "@hypertype/core";
import {AppContainer, IApplication} from "@app";
import {DomainContainer} from "@domain";
import {InfrContainer} from "@infr/container";

const app =ApplicationBuilder
    .withInfrustructure(DomainContainer)
    .withInfrustructure(AppContainer)
    .withInfrustructure(BrowserContainer)
    .withInfrustructure(InfrContainer)
    .withUI(UIContainer)
    .withRouter({
    routes: [
        {name: 'base', path: '/', forwardTo: 'tree'},
        {name: 'trip', path: '/trip'},
        {name: 'tree', path: '/context', }
    ],
    options: null
}).build();

init(app.get<Container>(Container));
