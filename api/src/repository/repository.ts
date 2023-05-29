import jsonfile from "jsonfile";

export default class Repository {
  path: string = "";

  getAll() {
    return jsonfile.readFileSync(this.path);
  }

  save(entity: Object) {
    jsonfile.readFileSync(this.path);
  }

  constructor() {}
}
