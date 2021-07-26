import {Container} from "@hypertype/core";
import {SolidDataService} from "./impl/solid-data.service";
import {IDataActions, RootDbo} from "@domain";
import {IDataAdapter} from "@infr/proxies/IDataAdapter";


const service = new SolidDataService();

export const InfrContainer = Container.withProviders(
    {
        provide: IDataAdapter, useValue: {
            State$: service.State$,
            Actions: service
        } as IDataAdapter<IDataActions, RootDbo>
    }
);
