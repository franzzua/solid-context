import {Injectable} from "@hypertype/core";
import * as auth from "solid-auth-client";


@Injectable()
export class AppAuthService {

    constructor() {

    }

    public async GetSession(): Promise<any> {

        let popupUri = 'https://inrupt.net/login';
        return (await auth.currentSession())
            ?? await auth.login(`https://inrupt.net`,{
            clientName: 'My Example',
        });
    }

}
