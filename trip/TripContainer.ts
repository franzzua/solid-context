import {Container} from "@hypertype/core";
import {TripPageComponent} from "./ui/trip-page/trip-page.component";
import {AzureContainer} from "./services";

export const TripContainer = Container.withProviders(
    TripPageComponent,
);

TripContainer.provide(AzureContainer);