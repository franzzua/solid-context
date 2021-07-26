import {Container} from "@hypertype/core";
import {ContentService, CursorService, HierarchyService} from "./services";
import {ContextTree} from "./model/contextTree";

const tree = new ContextTree();

export const DomainContainer = Container.withProviders(
    CursorService,
    HierarchyService,
    ContentService,
    {provide: ContextTree, useValue: tree},
);


