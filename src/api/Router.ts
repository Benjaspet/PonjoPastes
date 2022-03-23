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

import {Request, Response, Router} from "express";
import shortid from "shortid";
import fs from "fs";
import path from "path";
import DatabaseUtil from "../database/DatabaseUtil";

const router: Router = Router();

/**
 * Create a paste.
 * @route /api/v1/create
 * @body object
 */

router.put("/create", async (req: Request, res: Response) => {
    const body: any = req.body;
    const id: string = shortid.generate();
    try {
        const data: any = await DatabaseUtil.createPaste(
            id,
            body.content,
            body.codeblock || false,
            body.title || null
        );
        return res.status(200).json(
            {
                message: "Success.",
                paste: {
                    title: data.title,
                    id: data.id,
                    content: data.content,
                    codeblock: data.codeblock
                }
            }
        );
    } catch (err: any) {
        return res.status(500).json(
            {
                message: "An error occurred while processing your request."
            }
        );
    }
});

/**
 * Fetch a paste by ID.
 * @route /api/v1/fetch/:id
 * @param id The paste ID.
 */

router.get("/fetch/:id", async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
        const data: any = await DatabaseUtil.fetchPasteById(id);
        return res.status(200).json(
            {
                message: "Success.",
                paste: {
                    title: data.title,
                    id: data.id,
                    content: data.content,
                    codeblock: data.codeblock
                }
            }
        );
    } catch (err: any) {
        return res.status(500).json(
            {
                message: "An error occurred while processing your request."
            }
        );
    }
});

/**
 * Fetch all existing pastes.
 * @route /api/v1/all
 * @param limit? The amount limit to fetch (optional).
 */

router.get("/all", async (req: Request, res: Response) => {
    try {
        const data: any = await DatabaseUtil.fetchAllPastes();
        return res.status(200).json(
            {
                message: "Success.",
                total: data.length,
                pastes: data
            }
        );
    } catch (err: any) {
        console.log(err)
        return res.status(500).json(
            {
                message: "An error occurred while processing your request."
            }
        );
    }
});

export default router;