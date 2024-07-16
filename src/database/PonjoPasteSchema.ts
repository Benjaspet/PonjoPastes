import { Schema, Connection } from "mongoose";

export interface Paste {
    id: string;
    title?: string | "Untitled";
    content: string;
    codeblock: boolean;
}

export const PonjoPasteSchema: Schema = new Schema(
    {
        id: String,
        title: {
            type: String,
            default: "Untitled"
        },
        content: String,
        codeblock: {
            type: Boolean,
            default: false
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export const getPasteModel = (connection: Connection) => {
    return connection.models.pastes || connection.model("pastes", PonjoPasteSchema);
};
