import {ContextTree} from "../model/contextTree";
import {Injectable} from "@hypertype/core";
import {Context} from "../model/context";
import {IDataAdapter} from "../contracts";

@Injectable()
export class ContentService {
    constructor(private tree: ContextTree,
                private dataAdapter: IDataAdapter) {

    }

    public async SetContent(context: Context, content: string){
        context.SetText(content);
        await this.dataAdapter.ChangeContent(context.Id, content);
    }


    public async GetContent(context: Context){

    }
}