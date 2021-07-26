import * as h from "@hypertype/core";
import {Component, HyperComponent} from "@hypertype/ui";
import {IEvents, IState, Template} from "./trip-page.template";
import {TripContextTree} from "../../model/TripContext";
import {Suggestion, SuggestService} from "../../services";
import {Fn, Injectable, utc} from "@hypertype/core";
import {EntityService} from "../../services";

@Injectable(true)
@Component({
    name: 'trip-page',
    template: Template,
    style: require('./trip-page.style.less')
})
export class TripPageComponent extends HyperComponent<IState, IEvents>{

    private tripTree = new TripContextTree();

    constructor(private entitySeatch: EntityService,
                private suggestService: SuggestService) {
        super();
        const dbo = localStorage.getItem('model')
            ? JSON.parse(localStorage.getItem('model'))
            : {
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
            }
        this.tripTree.Load(dbo);
        this.tripTree.State$.subscribe(x => {
            localStorage.setItem("model", JSON.stringify(x.ToDbo()));
        })
    }

    private Entity$ = this.Events$.pipe(
        h.filter(x => x.type == "search"),
        h.switchMap(async x => {
            const lastSuggestion = await this.Suggestions$.pipe(h.first()).toPromise();
            const suggestion = lastSuggestion.find(y => y.displayText.toLowerCase() == x.args.toLowerCase());
            return suggestion;
        }),
        h.filter(Fn.Ib),
        h.switchMap(async (x: Suggestion) => {
            const entity = await this.entitySeatch.Search(x.query);
            return entity;
        }),
        h.startWith(null),
    )

    private Suggestions$ = this.Events$.pipe(
        h.filter(x => x.type == "search"),
        h.debounceTime(300),
        h.switchMap(async x => {
            const lastSuggestion = await this.Suggestions$.pipe(h.first()).toPromise();
            if (lastSuggestion.some(y => y.displayText.toLowerCase() == x.args.toLowerCase())){
                return [];
            }
            return await this.suggestService.GetSuggestions(x.args)
        }),
        h.startWith([]),
        h.shareReplay(1)
    )

    public State$ =  h.combineLatest([
        this.tripTree.State$,
        this.Suggestions$,
        this.Entity$
    ])

    public Actions$ = h.merge(
        this.tripTree.Keyboard.Actions$
    );
}
