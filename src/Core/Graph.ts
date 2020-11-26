import { ObjectClass } from "./ObjectClass";
import GraphRoot from "./GraphRoot";
import GraphNode from "./GraphNode";

export default class Graph extends GraphRoot {
  private _nodes = new Map<string, GraphNode>();
  public get nodes() {
    return this._nodes;
  }
  public set nodes(value) {
    this._nodes = value;
  }

  constructor(name: string = "New Graph") {
    super();
    this._class = ObjectClass.Graph;
  }

  public getFilteredNodes = (
    searchText: string = ""
  ): Map<string, GraphNode> => {
    const foundEntries = new Map<string, GraphNode>();
    const entriesToSerach = this.nodes;
    entriesToSerach.forEach((node) => {
      if (node.name.toLowerCase().includes(searchText.toLowerCase())) {
        foundEntries.set(node.id, node);
      }
    });
    return foundEntries;
  };
}
