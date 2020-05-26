import {RelationType, UserDbo} from "../dbo/context.dbo";
import {Context} from "./context";

export class User {

    constructor(dbo: UserDbo) {
        this.Data = dbo;
    }

    Data: UserDbo;
    Contexts: Map<Context, RelationType> = new Map<Context, RelationType>();

}