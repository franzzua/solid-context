import {Container} from "@hypertype/core";
import {SolidDataService} from "./impl/solid-data.service";
import {IDataActions, RootDbo} from "@domain";
import {WorkerStream} from "@infr/proxies/workerStream";
import {WorkerType} from "@infr/proxies/stream";
import {ServiceProxy} from "@infr/proxies/service-proxy";
import {IDataAdapter} from "@infr/proxies/IDataAdapter";

const stream = new WorkerStream("/worker.js", WorkerType.WebWorker);
const proxy = new ServiceProxy<RootDbo, IDataActions>(stream);

export const InfrContainer = Container.withProviders(
    {provide: IDataAdapter, useValue: proxy}
);
