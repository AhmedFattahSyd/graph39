import GraphNode from "../Core/GraphNode";

export default class StoredNode{
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
}