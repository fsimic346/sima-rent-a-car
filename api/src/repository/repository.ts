import jsonfile from "jsonfile";
import IEntity from "../model/IEntity";

export default class Repository {
    path: string = "";

    getAll(): IEntity[] {
        return (jsonfile.readFileSync(this.path) as IEntity[]).filter((entity) => !entity.deleted);
    }

    getById(id: Number) {
        this.getAll().find((entity) => entity.id == id);
    }

    save(entity: IEntity) {
        const list = this.getAll();
        list.push(entity);
        jsonfile.writeFileSync(this.path, list);
    }

    update(entity: IEntity) {
        const list = this.getAll();
        list.splice(
            list.findIndex((x) => x.id === entity.id),
            1,
            entity
        );

        jsonfile.writeFileSync(this.path, list);
    }

    delete(id: number) {
        const list = this.getAll();
        const deletedEntity: IEntity = list.splice(
            list.findIndex((x) => x.id === id),
            1
        )[0];

        deletedEntity.deleted = true;
        this.update(deletedEntity);
    }
}
