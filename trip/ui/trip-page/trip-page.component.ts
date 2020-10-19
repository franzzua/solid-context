import * as h from "@hypertype/core";
import {Component, HyperComponent} from "@hypertype/ui";
import {IEvents, IState, Template} from "./trip-page.template";
import {TripContextTree} from "../../model/TripContext";
import {utc} from "@hypertype/core";

@Component({
    name: 'trip-page',
    template: Template,
    style: require('./trip-page.style.less')
})
export class TripPageComponent extends HyperComponent<IState, IEvents>{

    private tripTree = new TripContextTree();

    constructor() {
        super();
        this.tripTree.Load({
            Contexts: [{
                Id: 'root',
                Children: [],
                Content: [{
                    Text: 'Start new Trip!'
                }],
                Time: utc().toISO()
            }],
            Relations: [],
            Root: 'root',
            Users: [],
            UserState: {
                ContextsState: {

                }
            }
        })
    }


    public State$ = this.tripTree.State$;

}
    