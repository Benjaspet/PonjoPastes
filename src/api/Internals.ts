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

import {Express, NextFunction, Request, Response} from "express";
import shortid from "shortid";
import DatabaseUtil from "../database/DatabaseUtil";

export async function renderHomepage(app: Express): Promise<void> {
    app.get("/", async (req: Request, res: Response) => {
        const pastes = await DatabaseUtil.fetchAllPastes();
        return res.render("index", {
            data: {
                pastes: pastes.length
            }
        });
    });
}

export function renderApiPage(app: Express): void {
    app.get("/docs/api", (req: Request, res: Response) => {
       return res.render("docs");
    });
}

/**
 * The POST route to handle form data.
 * @param app The express app instance.
 * @return void
 */

export function createFormPostRequest(app: Express): void {
    app.post("/", async(req: Request, res: Response) => {
        const pasteData: any = req.body;
        const id: string = shortid.generate();
        const data: any = await DatabaseUtil.createPaste(
            shortid.generate(),
            pasteData.content,
            pasteData.codeblock || false,
            pasteData.title || null
        );
        return res.render("success", {
           data: {
               id: data.id,
               href: "https://pastes.ponjo.club/" + data.id,
               content: data.content,
               title: data.title,
               codeblock: data.codeblock || false
           }
        });
    });
}

/**
 * The endpoint to get a paste by ID.
 * @param app The express app instance.
 * @return void
 */

export async function getPasteById(app: Express): Promise<void> {
    app.get("/:id", async (req: Request, res: Response) => {
        const data: any = await DatabaseUtil.fetchPasteById(req.params.id);
        return res.render("success", {
            data: {
                id: data.id,
                href: "https://pastes.ponjo.club/" + data.id,
                content: data.content,
                title: data.title,
                codeblock: data.codeblock || false
            }
        });
    });
}

/**
 * Render all existing pastes.
 * @param app The express app instance.
 * @return void
 */

export function renderAllPastes(app: Express): void {
    app.get("/pastes/all", async (req: Request, res: Response) => {
        let content = []; let names = [];
        const data: any = await DatabaseUtil.fetchAllPastes();
        data.forEach(paste => {
           content.push(paste.content);
           names.push(paste.id);
        });
        return res.render("all", {files: content, ids: names});
    });
}

/**
 * The middleware to handle 404 errors.
 * @param app The express app instance.
 * @return void
 */

export function handle404s(app: Express): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).render("index");
        next();
    });
}