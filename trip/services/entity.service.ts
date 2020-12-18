import {azureHeader} from "./helpers/azure.header";
import {ApiService} from "@hypertype/infr";
import {Injectable} from "@hypertype/core";

@Injectable()
export class EntityService{

    private key = `45da6b800cb04a05bfa66f15e219beee`;
    private endpoint = 'https://tripulya-search.cognitiveservices.azure.com/bing/v7.0/entities'

    constructor(private api: ApiService) {

    }


    public async Search(text: string): Promise<Entity> {
        const result = await this.api.get<{
            entities: {
                value: Entity[]
            };
            queryContext;
            rankingResponse;
        }>(`${this.endpoint}?q=${text}&mkt=ru-RU`, {
            headers: azureHeader(this.key)
        }).toPromise();
        return result.entities.value[0];
    }

}

export type Entity = {
    bingId;
    description;
    name;
    webSearchUrl;
    image: {
        height;
        width;
        hostPageUrl;
        name;
        thumbnailUrl;
        sourceHeight;
        sourceWidth;
    };
    entityPresentationInfo: {
        entityScenario;
        entityTypeDisplayHint;
        entityTypeHints: ('Country')[];
    }

}