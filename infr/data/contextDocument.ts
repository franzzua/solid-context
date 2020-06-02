import {
    collection,
    Document,
    document,
    entitySet,
    EntitySet,
    Collection,
    DocumentSet,
    documentSet,
    ISession
} from "solidocity";
import {ContextEntity} from "./contextEntity";
import {Injectable} from "@hypertype/core";

@document()
export class ContextDocument extends Document {

    constructor(uri) {
        super(uri);
    }

    @entitySet(ContextEntity, {isArray: true})
    public Contexts: EntitySet<ContextEntity>;
}

@collection()
@Injectable()
export class ContextCollection extends Collection{

    constructor(session: ISession) {
        super(`${new URL(session.webId).origin}/context`);
    }

    @documentSet(ContextDocument)
    public ContextDocuments: DocumentSet<ContextDocument>;
}