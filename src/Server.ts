/*
 * Copyright © 2024 Ben Petrillo. All rights reserved.
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
 * All portions of this software are available for public use,
 * provided that credit is given to the original author(s).
 */

import { Express, Router } from "express";
import express from "express";
import config from "../config.json";
import * as bodyParser from "body-parser";
import path from "path";
import baseController from "./controller/BaseController";
import { logger } from "./Logger";
import Database from "./database/Database";
import pasteRouter from "./routers/PasteRouter";

const app: Express = express();
const router: Router = Router();
const database: Database = new Database();

(async () => {
    try {
        await database.connect();
    } catch (error) {
        process.exit(1);
    }
})();

app.set("trust proxy", "127.0.0.1")
app.set("trust proxy", "8.8.8.8");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/styles")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.raw({ limit: "50mb" }));
app.use(bodyParser.text({ limit: "50mb" }));
app.use("/", router);

app.use("/api/v2/pastes", pasteRouter);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    logger.debug(`${req.method} ${req.path}`);
    next();
});

app.get("/", baseController.renderHomepage);
app.get("/about", baseController.renderAboutPage);
app.get("/createform", baseController.renderPasteFormPage);
app.get("/browse", baseController.renderAllPastes);
app.get("/paste/:id", baseController.renderPasteById);
app.post("/post/create", baseController.parseCreatePasteFormInput);

app.use((_req, res, next) => {
    res.status(404).render("404");
    next();
});

app.listen(config.port, () => {
    console.clear(); logger.info(`Now running on http://localhost:${config.port}.`);
});

export default database;