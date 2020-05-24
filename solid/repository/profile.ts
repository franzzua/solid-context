import {Document} from "./document";
import { foaf, vcard, ldp, schema } from "rdf-namespaces";
import {Entity} from "./entity";
import {entity, entityField, field, document} from "./decorators";
import {Reference} from "tripledoc";

@entity(foaf.PersonalProfileDocument)
export class Card extends Entity {
    @field(foaf.maker, {type: "ref"})
    public Maker: Reference;

    @field(foaf.primaryTopic, {type: "ref"})
    public PrimaryTopic: Reference;
}

@entity(schema.Person)
export class Person extends Entity{
    @field(vcard.fn)
    public FullName: string;

    @field('http://www.w3.org/2006/vcard/ns#organization-name')
    public Organizaion: string;

    @field(vcard.role)
    public Role: string;

    @field(ldp.inbox, {type: "ref"})
    public Invox: Reference;

}

@document()
export class Profile extends Document {

    @entityField(Card)
    public Card: Card;

    @entityField(Person)
    public Me: Person;
}
