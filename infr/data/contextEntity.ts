import {Entity, entity, field, ValuesSet} from "solidocity";
import {Schema} from "./schema";
import {ContextDbo} from "@domain";

@entity(Schema.Context)
export class ContextEntity extends Entity {

    @field(Schema.content)
    public Content: string;

    @field(Schema.date, {type: "Date"})
    public Time: Date;

    @field(Schema.children, {type: "ref", isArray: true, isOrdered: true})
    public Children: ValuesSet<string>;

    toDTO(): ContextDbo {
        return {
            Children: [...this.Children.Items],
            Content: [{
                Text: this.Content
            }],
            Id: this.Id,
            Time: this.Time?.toISOString()
        }
    }


    public fromDTO(dto: ContextDbo) {
        this.Time = new Date(dto.Time);
        this.Children.Push(...dto.Children);
        this.Content = dto.Content[0].Text;
    }
}