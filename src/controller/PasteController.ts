/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Paste } from "../database/PonjoPasteSchema";
import database from "../Server";
import {Result, ValidationError, validationResult} from "express-validator";
import PasteNotFoundException from "../exception/PasteNotFoundException";
import ShortUniqueId from "short-unique-id";
import {logger} from "../Logger";

export const getAllPastes = async (_req: Request, res: Response) => {
    try {
        const pastes: Paste[] = await database.getAllPastes();
        return res.status(200)
            .json({ pastes: pastes.map(paste => {
                return {
                    id: paste.id,
                    title: paste.title,
                    content: paste.content,
                    codeblock: paste.codeblock,
                    views: paste.views || 0,
                    likes: paste.likes || 0,
                    createdAt: paste.createdAt
                };
            }
        )});
    } catch (error: any) {
        if (error instanceof PasteNotFoundException) {
            return res.status(404)
                .json({ error: error.message });
        }
        return res.status(500)
            .json({ error: error.message });
    }
}

export const getPasteById = async (req: Request, res: Response) => {
    const result: Result<ValidationError> = validationResult(req);
    try {
        const { id } = req.params as ParamsDictionary;
        const { raw } = req.query as ParsedQs;
        const paste: Paste = await database.getPaste(id);
        if (raw === "true") {
            return res.status(200)
                .header("Content-Type", "text/plain")
                .send(paste.content);
        } else {
            return res.status(200)
                .json({
                    id: paste.id,
                    title: paste.title,
                    content: paste.content,
                    codeblock: paste.codeblock,
                    views: paste.views,
                    likes: paste.likes,
                    createdAt: paste.createdAt
                });
        }
    } catch (error: any) {
        logger.error(error);
        if (result.array().length > 0) {
            return res.status(400)
                .json({ errors: result.array() });
        }
        if (error instanceof PasteNotFoundException) {
            return res.status(404)
                .json({ error: error.message });
        }
        return res.status(500)
            .json({ error: error });
    }
}

export const searchForPaste = async (req: Request, res: Response) => {
    const result: Result<ValidationError> = validationResult(req);
    try {
        const { q, source } = req.query as ParsedQs;
        const query: string = q as string;
        const pastes: Paste[] = await database.searchForPaste(decodeURIComponent(query));
        if (!source || source !== "web") {
            return res.status(200)
                .json({ pastes: pastes.map(paste => {
                    return {
                        id: paste.id,
                        title: paste.title,
                        content: paste.content,
                        codeblock: paste.codeblock,
                        views: paste.views,
                        likes: paste.likes,
                        createdAt: paste.createdAt
                    };
                }
            )});
        }
        return res.status(200)
            .render("all", {
                data: {
                    pastes: pastes.reverse().map(paste => {
                        return {
                            id: paste.id,
                            title: paste.title,
                            content: paste.content,
                            codeblock: paste.codeblock,
                            views: paste.views,
                            likes: paste.likes,
                            createdAt: paste.createdAt
                        };
                    })
                }
            });
    } catch (error: any) {
        if (result.array().length > 0) {
            return res.status(400)
                .json({ errors: result.array() });
        }
        return res.status(500)
            .json({ error: error });
    }

}

export const createPaste = async (req: Request, res: Response) => {
    const result: Result<ValidationError> = validationResult(req);
    try {
        const { title, content, codeblock } = req.body;
        const data: Paste = await database.createPaste(
            {
                id: new ShortUniqueId().rnd(15),
                title: title,
                content: content,
                codeblock: codeblock,
                views: 0,
                likes: 0,
                createdAt: new Date()
            });
        return res.status(200)
            .json({
                id: data.id,
                title: data.title,
                content: data.content,
                codeblock: data.codeblock,
                views: data.views,
                likes: data.likes,
                createdAt: data.createdAt
            });
    } catch (error: any) {
        if (result.array().length > 0) {
            return res.status(400).json({ errors: result.array() });
        }
        return res.status(500).json({ error: error.message });
    }
}

export default {
    getAllPastes,
    getPasteById,
    searchForPaste,
    createPaste
}