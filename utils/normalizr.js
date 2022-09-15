import { normalize, schema } from 'normalizr';

export const authorSchema = new schema.Entity('authors',{},{ idAttribute: 'email'})
export const messageSchema = new schema.Entity('messages',{author:authorSchema});



export const normalizeMessages = (data) => {
    const normalizedData = normalize(data, [messageSchema])
    return normalizedData;
}

