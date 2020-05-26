import {Document, document, entityField, EntitySet} from "solidocity";
import {ContextEntity} from "./contextEntity";

@document()
export class ContextDocument extends Document {



    @entityField(ContextEntity, {isArray: true})
    public Contexts: EntitySet<ContextEntity>;
}