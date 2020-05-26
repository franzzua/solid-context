import {RelationType, RootDbo} from "./context.dbo";
import {utc} from "@hypertype/core";

const InititalData: () => RootDbo = () => ({
    Root: '1',
    Contexts: [
        {
            Id: '1',
            Children: [],
            Time: utc().toISO(),
            Content: [{
                Text: '...',
            }]
        }
    ],
    Users: [],
    Relations: [],
    UserState: {
        ContextsState: {}
    }

});

const DefaultDataTest1: () => RootDbo = () => ({
    Root: '1',
    Contexts: [
        {
            Id: '1',
            Children: ['inbox', '1.1', '1.2'],
            Time: utc().toISO(),
            Content: [{
                Text: '1 Контекст',
            }]
        },
        {
            Id: '1.2.1',
            Children: [],
            Time: utc().toISO(),
            Content: [{
                Text: '1.2.1 Сущности',
            }]
        },
        {
            Id: 'inbox',
            Children: [],
            Time: utc().toISO(),
            Content: [{
                Text: 'Inbox',
            }]
        },
        {
            Id: '1.2',
            Children: ['1.2.1', '1.2.2'],
            Time: utc().toISO(),
            Content: [{
                Text: '1.2 Проектировани',
            }]
        },
        {
            Id: '1.1',
            Children: ['1.2'],
            Time: utc().toISO(),
            Content: [{
                Text: '1.1 Пример использования',
            }]
        },
        {
            Id: '1.2.2',
            Children: [],
            Time: utc().toISO(),
            Content: [{
                Text: '1.2.2 Поведение',
            }]
        }
    ],
    Users: [{
        Id: 's',
        Name: 'Степа',
        Email: 'styopa@contextify.app'
    }, {
        Id: 'f',
        Name: 'Фра',
        Email: 'fra@contextify.app'
    }, {
        Id: 'a',
        Name: 'Анна',
        Email: 'anna@contextify.app'
    }, {
        Id: 'b',
        Name: 'Боб',
        Email: 'bob@contextify.app'
    }],
    Relations: [{
        UserId: 'b',
        ContextId: '1',
        Type: RelationType.Owner
    }, {
        UserId: 's',
        ContextId: '1.1',
        Type: RelationType.Owner
    }, {
        UserId: 'f',
        ContextId: '1.2',
        Type: RelationType.Owner
    }],
    UserState: {
        ContextsState: {
            '1.2': {
                Collapsed: false
            }
        }
    }
});

export const DefaultData = DefaultDataTest1;