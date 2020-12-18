import {Injectable} from "@hypertype/core";
import {ApiService} from "@hypertype/infr";
import {azureHeader} from "./helpers/azure.header";

@Injectable()
export class EntityRecognitionService {

    constructor(private api: ApiService) {

    }

    private key = `e50d6f1dfafe4d7884bb61faa15b6459`;
    private endpoint = 'https://tripulya.cognitiveservices.azure.com/text/analytics/v3.0/entities/recognition/general/'


    public async Recognize(text: string): Promise<EntityRecognition[]> {
        const result = await this.api.post<{
            documents: {
                id;
                warnings;
                entities: EntityRecognition[]
            }[]
        }>(`${this.endpoint}`, {
            "documents": [
                {
                    "id": "1",
                    "text": text
                }
            ]
        }, {
            headers: azureHeader(this.key)
        }).toPromise();
        return result.documents[0].entities;
    }


}

export type EntityRecognition = {
    text;
    category;
    subcategory;
    offset;
    length;
}