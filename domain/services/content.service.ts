import {ContextTree} from "../model/contextTree";
import {Injectable} from "@hypertype/core";
import {Context} from "../model/context";
import {IDataAdapter} from "@infr/proxies/IDataAdapter";
import {IDataActions, RootDbo} from "@domain/contracts";

@Injectable()
export class ContentService {
    constructor(private tree: ContextTree,
                private dataAdapter: IDataAdapter<IDataActions, RootDbo>) {

    }

    public async SetContent(context: Context, content: string){
        context.SetText(content);
        await this.dataAdapter.Actions.ChangeContent(context.Id, content);
    }


    public async GetContent(context: Context){

    }
}