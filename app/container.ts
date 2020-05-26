import {Container} from "@hypertype/core";
import {AppAuthService} from "./impl/app.auth-service";
import { Application } from "./impl/application";
import {IAppAuthService, IApplication} from "./contracts";

export const AppContainer = Container.withProviders(
    {provide: IAppAuthService, useClass: AppAuthService},
    {provide: IApplication, useClass: Application},
);
