import {Injectable} from "@hypertype/core";
import * as auth from "solid-auth-client";


@Injectable()
export class AppAuthService {

    constructor() {

    }

    public async GetSession(): Promise<any> {

        let popupUri = 'https://fransua.solid.community/common/popup.html';
        return (await auth.currentSession())
            ?? await auth.login(`https://fransua.solid.community`,{
            clientName: 'My Example',
        });
    }

}
