import {Container} from "@hypertype/core";
import {TripPageComponent} from "./ui/trip-page/trip-page.component";

export const TripContainer  = Container.withProviders(
    TripPageComponent
)