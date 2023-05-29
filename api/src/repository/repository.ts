import jsonfile from "jsonfile";
import IEntity from "../model/IEntity";

export default class Repository {
  path: string = "";

  getAll(): IEntity[] {
    return jsonfile.readFileSync(this.path);
  }

  getById(id: Number) {
    this.getAll().filter((entity) => entity.id == id);
  }

  save(entity: IEntity) {
    jsonfile.readFileSync(this.path);
  }

  constructor() {}
}
