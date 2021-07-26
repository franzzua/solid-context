import {Observable} from "@hypertype/core";

export abstract class Stream {
    public State$: Observable<any>;

    public abstract Invoke(method: PropertyKey, args: any[]): Promise<any>;
}

export enum WorkerType {
    WebWorker = 'web',
   // SharedWorker = 'shared',
    ServiceWorker = 'service'
}

export const WorkerFactory: {
    [key in WorkerType]: (path: string) => Promise<Worker | ServiceWorker>;
} = {
    [WorkerType.WebWorker]: async path => new self.Worker(path),
    //[WorkerType.SharedWorker]: async path => new self.SharedWorker(path),
    [WorkerType.ServiceWorker]: async path => {
        let registration = await navigator.serviceWorker.getRegistration(path)
        if (registration){
            await registration.update();
            await registration.unregister();
            registration = null;
        }
        if (!registration) {
            registration = await navigator.serviceWorker.register(path, {
                scope: '/_worker'
            });
        }
        if (registration.active){
            return registration.active;
        }
        return await new Promise<ServiceWorker>(resolve =>
            registration.addEventListener('updatefound', () => {
                if (registration.active){
                    resolve(registration.active);
                }
            }))
    },

}

