import {Router} from "express";
import baseController from "../controller/BaseController";
import {body, param, query} from "express-validator";
import pasteController from "../controller/PasteController";
import {logger} from "../Logger";

export const pasteRouter: Router = Router();

pasteRouter.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    logger.debug(`${req.method} /api/v2${req.path}`);
    next();
});

pasteRouter.post("/create",
    body("content")
        .isString()
        .notEmpty()
        .withMessage("Content must not be empty."),
    body("codeblock")
        .isBoolean()
        .notEmpty()
        .withMessage("Must specify if the content is a codeblock or not."),
    pasteController.createPaste);

pasteRouter.get("/getAll", pasteController.getAllPastes);

pasteRouter.get("/get/:id",
    param("id")
        .isString()
        .withMessage("ID must be a string.")
        .notEmpty()
        .withMessage("ID must not be empty.")
        .isLength({ min: 15, max: 15})
        .withMessage("ID must be exactly 15 characters long."),
    pasteController.getPasteById);

export default pasteRouter;