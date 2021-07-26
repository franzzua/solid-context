// @ts-ignore
self["window"] = self;
// @ts-ignore
self["global"] = self;

import {WorkerEntry} from "@infr/proxies/workerEntry";
import {SolidDataService} from "@infr/impl/solid-data.service";



const dataService = new SolidDataService();
const workerEntry = new WorkerEntry({
    State$: dataService.State$,
    Actions: dataService
});