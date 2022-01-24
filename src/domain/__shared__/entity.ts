import { IEquatable } from "./equatable";
import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<T, U extends UniqueEntityId>
  implements IEquatable
{
  protected constructor(protected props: T, private readonly _id: U) {}

  public get id(): U {
    return this._id;
  }

  public equals(object: Entity<T, U>): boolean {
    if (this === object) {
      return true;
    }

    return this.id.equals(object.id);
  }
}
