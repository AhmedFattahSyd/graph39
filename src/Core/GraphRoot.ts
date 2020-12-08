import { v4 as uuid } from "uuid";
import { GraphObjectClass } from "./GraphObjectClass";

export default class GraphRoot {
  protected _class: GraphObjectClass;
  public get class(): GraphObjectClass {
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
  private _updateAt: Date = new Date()
  public get updatedAt(): Date {
    return this._updateAt;
  }
  public set updatedAt(value: Date) {
    this._updateAt = value;
  }

  constructor(name: string = "No name", id: string = "") {
    if (id === "") {
      this._id = uuid();
    } else {
      this._id = id;
    }
    this._name = name;

    this._class = GraphObjectClass.Root;
  }
}
