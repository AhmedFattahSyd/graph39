import { ObjectClass } from "./ObjectClass";
import GraphRoot from "./GraphRoot";
import GraphNode from "./GraphNode";
import { GraphNodeType } from "./NodeTypes";

export default class Graph extends GraphRoot {
  private _nodes = new Map<string, GraphNode>();
  public get nodes() {
    return this._nodes;
  }
  public set nodes(value) {
    this._nodes = value;
  }

  constructor(name: string = "New Graph", id: string = "") {
    super(name, id);
    this._class = ObjectClass.Graph;
  }

  public getFilteredNodes = (
    searchText: string = "",
    type: GraphNodeType
  ): Map<string, GraphNode> => {
    return new Map(
      Array.from(this.nodes.values())
        .filter((node) => {
          return (
            node.name.toLowerCase().includes(searchText.toLowerCase()) &&
            node.hasType(type)
          );
        })
        .map((node) => [node.id, node])
    );
    // const nodeMap = new Map(nodeArray.map(node=>[node.id,node]))
    // const foundEntries = new Map<string, GraphNode>();
    // const entriesToSerach = this.nodes;
    // entriesToSerach.forEach((node) => {
    //   if (node.name.toLowerCase().includes(searchText.toLowerCase())) {
    //     foundEntries.set(node.id, node);
    //   }
    // });
    // return foundEntries;
  };
}
