export default class Result {
    success: boolean;
    message: string;
    value: any;
    constructor() {
        this.success = false;
        this.message = "";
    }
}
