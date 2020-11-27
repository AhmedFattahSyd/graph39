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
  public set id(id: string) {
    this._id = id;
  }

  private _name: string = "No name";
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  constructor(name: string = "No name", id: string = "") {
    if (id === "") {
      this._id = uuid();
    } else {
      this._id = id;
    }
    this._name = name;

    this._class = ObjectClass.Root;
  }
}
