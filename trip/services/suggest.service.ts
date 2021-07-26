import {Injectable} from "@hypertype/core";
import {ApiService} from "@hypertype/infr";
import {azureHeader} from "./helpers/azure.header";

@Injectable()
export class SuggestService{
    private endpoint = `https://tripulya-search.cognitiveservices.azure.com/bing/v7.0/Suggestions`;
    private key = `45da6b800cb04a05bfa66f15e219beee`;

    constructor(private api: ApiService) {

    }


    public async GetSuggestions(query): Promise<Suggestion[]> {
        const result = await this.api.get<{
            suggestionGroups: {
                name: 'Web',
                searchSuggestions: Suggestion[]
            }[]
        }>(`${this.endpoint}?q=${query}`, {
            headers: azureHeader(this.key)
        }).toPromise();
        return result.suggestionGroups[0].searchSuggestions;
    }
}

export type Suggestion = {
    displayText;
    query;
    searchKind;
    url;
}