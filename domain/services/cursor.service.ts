import {Injectable} from "@hypertype/core";
import {ContextTree} from "../model/contextTree";

@Injectable()
export class CursorService {

    constructor(private tree: ContextTree) {
    }

}