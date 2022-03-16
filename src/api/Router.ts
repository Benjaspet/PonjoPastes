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

const router: Router = Router();

router.put("/create", (req: Request, res: Response) => {
    const body: any = req.body as string;
    const id: string = shortid.generate();
    try {
        fs.writeFile(path.join(__dirname, "/../../pastes/" + id + ".txt"), body, (err) => {
            if (err) {
                return res.status(500).json({
                    message: "An error occurred while processing your request."
                });
            } else {
                return res.status(200).json({
                    message: "Success.",
                    paste: {
                        content: body,
                        id: id,
                        contentLength: body.length,
                        url: "https://pastes.ponjo.club/" + id
                    }
                });
            }
        });
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({
            message: "An error occurred while processing your request."
        });
    }
});

router.get("/fetch/:id", (req: Request, res: Response) => {
    fs.readFile(path.join(__dirname, "/../../pastes/") + req.params.id + ".txt", "utf8", (err, data) => {
        if (err) {
            return res.status(404).json({
                message: "A paste by that ID was not found."
            });
        } else {
            return res.status(200).json({
                message: "Success.",
                paste: {
                    content: data.toString(),
                    id: req.params.id,
                    url: "https://pastes.ponjo.club/" + req.params.id,
                    contentLength: data.length
                }
            })
        }
    });
});

export default router;