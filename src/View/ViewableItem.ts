import { v4 as uuid } from "uuid";
import GraphRoot from "../Core/GraphRoot";
import { ViewableItemClass } from "./ViewableItemClass";

export default class ViewableItem {
  protected _class: ViewableItemClass;
  public get class(): ViewableItemClass {
    return this._class;
  }

  private _id: string;
  public get id(): string {
    return this._id;
  }
  private _object: GraphRoot | null = null;
  public get object(): GraphRoot | null {
    return this._object;
  }

  constructor(itemClass: ViewableItemClass, object: GraphRoot | null = null) {
    this._class = itemClass;
    if (object === null) {
      this._id = uuid();
    } else {
      this._id = object.id;
      this._object = object;
    }
  }
}
