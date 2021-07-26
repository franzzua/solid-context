export class WorkerEntry {

    private get clients(){
        return (self as any).clients.matchAll({includeUncontrolled: true, type: 'window'});
    }

    constructor(private service: {
        State$: { subscribe(cb: Function): Function; },
        Actions: any
    }) {

        this.service.State$.subscribe(s => {
            this.postMessage('state', s);
        });
        self.addEventListener('install', async x => {
            console.log('install', x)
            console.log(await this.clients);
        })

        self.addEventListener('activate', async x => {
            console.log('activate', x)
            console.log(await this.clients);
        })
        self.addEventListener('message', async (msg) => {
            try {
                const data = msg.data as { id, method, args: any[] };
                const invoke = async () => {
                    const response = await this.service.Actions[data.method](...data.args);
                    await this.postMessage('response', response, data.id);
                }
                this.invokeQueue$.push(invoke);
                this.dequeue();
            } catch (e) {
                console.error(e);
            }
        })
    }

    private invokeQueue$: (() => Promise<void>)[] = [];
    private isInvoking = false;

    private async dequeue(){
        if (this.isInvoking)
            return;
        this.isInvoking = true;
        while (this.invokeQueue$.length) {
            let invoke = this.invokeQueue$.shift();
            await invoke();
        }
        this.isInvoking = false;
    }

    private async postMessage(type: 'state' | 'response', payload: any, id?) {
        if ('clients' in self) {
            const clients = await this.clients;
            for (const c of clients) {
                console.log(c);
                c.postMessage({
                    type, payload, id
                })
            }
        }
        if ('postMessage' in self) {
            (self as any).postMessage({
                type, payload, id
            });
        }
    }

}