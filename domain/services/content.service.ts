import {ContextTree} from "../model/contextTree";
import {Injectable} from "@hypertype/core";

@Injectable()
export class ContentService {
    constructor(private tree: ContextTree) {

    }

}