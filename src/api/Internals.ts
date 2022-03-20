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
import fs from "fs";
import path from "path";
import shortid from "shortid";
import Logger from "../Logger";

export function renderHomepage(app: Express): void {
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        let total: number = 0;
        fs.readdirSync(path.join(__dirname, "../../pastes/")).forEach(() => total++);
        res.render("index", {
            data: {
                pastes: total
            }
        });
    });
}

export function createFormPostRequest(app: Express): void {
    app.post("/", (req: Request, res: Response, next: NextFunction) => {
        const paste: any = req.body.content;
        const id: string = shortid.generate();
        fs.writeFile(path.join(__dirname, "../../pastes/" + id + ".txt"), paste, (err) => {
            if (err) return Logger.error(err.message);
        });
        return res.render("success", {
            data: {
                id: id,
                href: "https://pastes.ponjo.club/" + id,
                content: paste
            }
        });
    });
}

export function getPasteById(app: Express): void {
    app.get("/:id", (req: Request, res: Response, next: NextFunction) => {
        fs.readFile(path.join(__dirname, "../../pastes/") + req.params.id + ".txt", "utf8", (err, data) => {
            if (err) return res.render("404");
            return res.render("success", {
                data: {
                    content: data.toString(),
                    id: req.params.id,
                    href: "https://pastes.ponjo.club/" + req.params.id
                }
            });
        });
    });
}

export function renderAllPastes(app: Express): void {
    app.get("/pastes/all", async (req: Request, res: Response, next: NextFunction) => {
        let data = []; let names = [];
        fs.readdirSync(path.join(__dirname, "/../../pastes/"), "utf8").forEach((file) => {
            data.push(fs.readFileSync(path.join(__dirname, "/../../pastes/") + file, "utf8"));
            names.push(file.split(".")[0]);
        });
        res.render("all", {files: data, ids: names});
    });
}

export function handle404s(app: Express): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
        return res.status(404).render("index");
    });
}