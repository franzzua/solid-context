import {Container} from "@hypertype/core";
import {SolidDataService} from "./impl/solid-data.service";
import {IDataAdapter} from "@domain";

export const InfrContainer = Container.withProviders(
    {provide: IDataAdapter, useClass: SolidDataService}
);
