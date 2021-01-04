import GraphNode from "../Core/GraphNode";

export default class PersistentNode{
    private _node: GraphNode;
    public get node(): GraphNode {
        return this._node;
    }
    public set node(value: GraphNode) {
        this._node = value;
    }

    constructor(node: GraphNode){
        this._node=node
    }
    getNodeData = () => {
        // getNodeData is overriden in PersistentNodes to match the storage schema
        const data: PersistentNodeData = {
        };
        return data;
      };
}

export interface PersistentNodeData {

}