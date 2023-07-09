import jsonfile from "jsonfile";
import IEntity from "../model/IEntity";
import fs from "fs";

export default class Repository {
    path: string = "";

    getAll(): IEntity[] {
        return (jsonfile.readFileSync(this.path) as IEntity[]).filter(
            entity => !entity.deleted,
        );
    }

    getById(id: Number): IEntity {
        return this.getAll().find(entity => entity.id == id) as IEntity;
    }

    save(entity: IEntity) {
        const list = jsonfile.readFileSync(this.path) as IEntity[];
        list.push(entity);
        jsonfile.writeFileSync(this.path, list);
    }

    update(entity: IEntity) {
        const list = (jsonfile.readFileSync(this.path) as IEntity[]).filter(
            entity => !entity.deleted,
        );
        list.splice(
            list.findIndex(x => x.id === entity.id),
            1,
            entity,
        );

        jsonfile.writeFileSync(this.path, list);
    }

    delete(id: number) {
        const list = (jsonfile.readFileSync(this.path) as IEntity[]).filter(
            entity => !entity.deleted,
        );
        const deletedEntity: IEntity = list.splice(
            list.findIndex(x => x.id === id),
            1,
        )[0];

        deletedEntity.deleted = true;
        this.update(deletedEntity);
    }

    createStorage() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, "", { flag: "wx" });
        }
    }

    getNextId(): number {
        const list = jsonfile.readFileSync(this.path) as IEntity[];
        return list === undefined ? 1 : list.length + 1;
    }
}
