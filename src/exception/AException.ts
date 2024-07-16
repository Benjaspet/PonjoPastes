export default abstract class AException implements Error {

    public readonly message: string;
    public name: string;

    protected constructor(message: string) {
        this.message = message;
        this.name = "PonjoPasteException";
    }
}