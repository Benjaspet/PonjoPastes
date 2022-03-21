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

import PonjoPasteSchema from "./PonjoPasteSchema";

export default class DatabaseUtil {

    public static async fetchAllPastes() {
        const trimmed: object[] = [];
        const data = await PonjoPasteSchema.find();
        if (!data) return [];
        data.forEach(paste => {
           trimmed.push({
               id: paste.id ?? null,
               title: paste.title ?? null,
               content: paste.content ?? null,
               codeblock: paste.codeblock ?? false
           });
        });
        return trimmed;
    }

    public static async createPaste(id: string, content: string, codeblock: boolean, title?: string) {
        const data = await PonjoPasteSchema.create({id: id, content: content, codeblock: codeblock, title: title});
        if (!data) {
            return false;
        } else {
            return {
                id: id,
                title: title,
                content: content,
                codeblock: codeblock
            };
        }
    }

    public static async fetchPasteById(id: string) {
        const data = await PonjoPasteSchema.findOne({id: id});
        if (!data) {
            return null;
        } else {
            return {
                id: data.id,
                title: data.title,
                content: data.content,
                codeblock: data.codeblock
            };
        }
    }
}