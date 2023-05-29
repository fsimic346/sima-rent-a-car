import jsonfile from "jsonfile";
import IEntity from "../model/IEntity";

export default class Repository {
  path: string = "";

  getAll(): IEntity[] {
    return (jsonfile.readFileSync(this.path) as IEntity[]).filter(
      (entity) => !entity.deleted
    );
  }

  getById(id: Number) {
    this.getAll().find((entity) => entity.id == id);
  }

  save(entity: IEntity) {
    jsonfile.readFileSync(this.path);
  }
}
