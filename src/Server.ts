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

import {Express} from "express";
import express from "express";
import * as http from "http";
import Logger from "./Logger";
import RestApplication from "./api/RestApplication";
import {createFormPostRequest, renderHomepage, renderAllPastes, handle404s} from "./api/Internals";

const app: Express = express();

new RestApplication(app);

createFormPostRequest(app);
renderHomepage(app);
renderAllPastes(app);
handle404s(app);

const server = http.createServer(app);
server.listen(2000, () => {
    Logger.clear();
    Logger.info("Now running on port 2000.");
});