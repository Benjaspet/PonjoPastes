import AException from "./AException";

export default class PasteNotFoundException extends AException {

    constructor(message: string) {
        super(message);
        this.name = "PonjoPasteExceptions";
    }
}