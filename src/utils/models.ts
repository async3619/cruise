import { ClassType } from "type-graphql";
import { Inject } from "typedi";

export function InjectRepository(model: ClassType) {
    return Inject(model.name);
}
