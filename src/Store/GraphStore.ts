import User from "../Auth/User";
import GraphEdge from "../Core/GraphEdge";
import GraphNode from "../Core/GraphNode";
import PersistentGraph from "./PersistentGraph";

export default class GraphStore {
  protected _persistentGraph: PersistentGraph;

  protected _user: User | null;
  // public get user(): User {
  //     return this._user
  // }
  // public set user(value: User) {
  //     this._user = value
  // }

  constructor(user: User | null, persistentGraph: PersistentGraph) {
    this._user = user;
    this._persistentGraph = persistentGraph;
  }

  deleteNode = async (node: GraphNode) => {}

  deleteEdge = async (tagEdge: GraphEdge) => {};

  createNewEdge = async (edge: GraphEdge) => {};

  init = async () => {};

  getData = async (): Promise<string> => {
    return "";
  };

  updateNode = (node: GraphNode) => {};

  createNewNode = async (node: GraphNode) => {};
}
