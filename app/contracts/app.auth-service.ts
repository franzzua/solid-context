import {ISession} from "solidocity";

export abstract class IAppAuthService {
    public abstract async GetSession(): Promise<ISession>;
}