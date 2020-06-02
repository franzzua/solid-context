import {Injectable} from "@hypertype/core";
import {IAppAuthService, IApplication} from "@app";
import {ContextTree, IDataAdapter} from "@domain";

@Injectable()
export class Application extends IApplication{

    constructor(private appAuthService: IAppAuthService,
                private tree: ContextTree,
                private dataService: IDataAdapter) {
        super();
    }

    public async Start(){
        await this.appAuthService.GetSession();
        await this.dataService.Init();
        this.dataService.Changes$.subscribe(
            async change => {
                const data = await this.dataService.Load();
                this.tree.Load(data);
            }
        )
    }
}