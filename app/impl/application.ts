import {Injectable} from "@hypertype/core";
import {IAppAuthService, IApplication} from "@app";
import {ContextTree, IDataActions, RootDbo} from "@domain";
import {IDataAdapter} from "@infr/proxies/IDataAdapter";

@Injectable()
export class Application extends IApplication{

    constructor(private appAuthService: IAppAuthService,
                private tree: ContextTree,
                private dataService: IDataAdapter<IDataActions, RootDbo>) {
        super();
    }

    public async Start(){
        this.dataService.State$.subscribe(
            data => this.tree.Load(data)
        )
        const session = await this.appAuthService.GetSession();
        await this.dataService.Actions.Init(session);
    }
}