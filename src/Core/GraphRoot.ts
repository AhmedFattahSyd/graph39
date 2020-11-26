import { v4 as uuid } from "uuid";
import { ObjectClass } from "./ObjectClass";

export default class GraphRoot {
  protected _class: ObjectClass;
  public get class(): ObjectClass {
    return this._class;
  }

  private _id: string;
  public get id(): string {
    return this._id;
  }
  constructor(id: string = "") {
    if (id === "") {
      this._id = uuid();
    } else {
      this._id = id;
    }
    this._class = ObjectClass.Root;
  }
}
