import mongoose, { Connection } from "mongoose";
import config from "../../config.json";
import { logger } from "../Logger";
import { getPasteModel, Paste } from "./PonjoPasteSchema";
import PasteNotFoundException from "../exception/PasteNotFoundException";

export default class Database {
    private connection: Connection | null = null;

    public async connect(): Promise<void> {
        this.connection = mongoose.createConnection(config.mongo_uri);
        await new Promise<void>((resolve, reject) => {
            this.connection?.once('connected', resolve);
            this.connection?.once('error', reject);
        });
        logger.info("Database connected successfully.");
    }

    private async ensureConnectionReady(): Promise<void> {
        if (!this.connection || this.connection.readyState !== 1) {
            await new Promise((resolve, reject) => {
                this.connection?.once("open", resolve);
                this.connection?.once("error", reject);
            });
        }
    }

    public async createPaste(paste: Paste): Promise<Paste> {
        await this.ensureConnectionReady();
        const PonjoPasteModel = getPasteModel(this.connection!);
        const data = await PonjoPasteModel.create(paste);
        if (!data) {
            throw new Error("Failed to create paste.");
        }
        return data.toObject();
    }

    public async updatePaste(old: Paste, updated: Paste): Promise<Paste> {
        await this.ensureConnectionReady();
        const PonjoPasteModel = getPasteModel(this.connection!);
        const data = await PonjoPasteModel.findOneAndUpdate({ id: old.id }, updated, { new: true });
        logger.info(data)
        if (!data) {
            throw new PasteNotFoundException("Paste not found.");
        }
        logger.info(`Updated paste with id ${old.id}.`);
        return data.toObject();
    }

    public async getPaste(id: string): Promise<Paste> {
        await this.ensureConnectionReady();
        const PonjoPasteModel = getPasteModel(this.connection!);
        const data = await PonjoPasteModel.findOne({ id });
        if (!data) {
            throw new PasteNotFoundException("Paste not found.");
        }
        return data.toObject();
    }

    public async getAllPastes(): Promise<Paste[]> {
        await this.ensureConnectionReady();
        const PonjoPasteModel = getPasteModel(this.connection!);
        const data = await PonjoPasteModel.find({});
        if (!data) {
            throw new PasteNotFoundException("No pastes found.");
        }
        return data.map(paste => paste.toObject());
    }

    public async searchForPaste(query: string) : Promise<Paste[]> {
        await this.ensureConnectionReady();
        const PonjoPasteModel = getPasteModel(this.connection!);
        const data = await PonjoPasteModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } },
                { id: query }
            ],
        });
        if (!data) {
            throw new PasteNotFoundException("No pastes found.");
        }
        return data.map(paste => paste.toObject());
    }
}