import {Injectable} from "@hypertype/core";
import {ISession, useAuth} from "solidocity";
import * as auth from "solid-auth-client";

const clientAuth = useAuth(auth);

@Injectable()
export class AppAuthService {

    constructor() {

    }

    public async GetSession(): Promise<ISession> {
        return (await clientAuth.currentSession())
            ?? await clientAuth.login('https://fransua.inrupt.net',{
            clientName: 'My Example',
        });
    }

}
