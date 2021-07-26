import {Container} from "@hypertype/core";
import {SuggestService} from "./suggest.service";
import {EntityRecognitionService} from "./entity-recognition.service";
import {EntityService} from "./entity.service";

export * from "./suggest.service";
export * from "./entity-recognition.service";
export * from "./entity.service";

export const AzureContainer = Container.withProviders(
    SuggestService,
    EntityRecognitionService,
    EntityService,
)