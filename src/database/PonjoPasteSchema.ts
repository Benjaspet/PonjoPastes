import { Schema, Connection } from "mongoose";

export interface Paste {
    id: string;
    title?: string | "Untitled";
    content: string;
    codeblock: boolean;
    views: number;
    likes: number;
    createdAt: Date;
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
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export const getPasteModel = (connection: Connection) => {
    return connection.models.pastes || connection.model("pastes", PonjoPasteSchema);
};
