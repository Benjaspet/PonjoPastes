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

import express, {Express} from "express";
import path from "path";
import * as bodyParser from "body-parser";
import Router from "./Router";

export default class RestApplication {

    private app: Express;

    constructor(app: Express) {
        this.app = app;
        this.handle();
    }

    private handle(): void {

        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.raw());
        this.app.use(bodyParser.text());

        this.app.use("/api/v1", Router);
        this.app.set("view engine", "ejs");
        this.app.set("views", __dirname + "/../views");

        this.app.set("trust proxy", "8.8.8.8");
        this.app.set("trust proxy", 1);

        this.app.use(express.static(path.join(__dirname, "/../../pastes")));
        this.app.use(express.static(path.join(__dirname, "/../public")));

    }

}