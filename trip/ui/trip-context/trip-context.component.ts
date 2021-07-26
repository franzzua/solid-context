import {Component, HyperComponent} from "@hypertype/ui";
import {IEvents, IState, Template} from "./trip-context.template";
import { TripContext } from "../../model/TripContext";
import {Injectable, Observable} from "@hypertype/core";

@Injectable()
@Component({
    name: 'trip-context',
    template: Template,
    style: require('./trip-context.style.less')
})
export class TripContextComponent extends HyperComponent<IState, IEvents>{

    private context: Observable<TripContext>
}
    