import GraphRoot from "./GraphRoot";
import { GraphNodeType } from "./NodeTypes";
import { ObjectClass } from "./ObjectClass";

export default class GraphNode extends GraphRoot{

    constructor(name: string = "No name",id: string = "",types: GraphNodeType[]){
        super(name, id)
        this._class=ObjectClass.Node
        this.nodeTypes = new Set<GraphNodeType>(types)
    }

    getNodeData = ()=>{
        const data: NodeData = {
            name: this.name,
            types: Array.from(this.nodeTypes)
        }
        return data
    }

    private _nodeTypes: Set<GraphNodeType> = new Set();
    public get nodeTypes(): Set<GraphNodeType> {
        return this._nodeTypes;
    }
    public set nodeTypes(value: Set<GraphNodeType>) {
        this._nodeTypes = value;
    }

    addType = (type: GraphNodeType)=>{
        this.nodeTypes.add(type)
    }

    removeType = (type: GraphNodeType)=>{
        this.nodeTypes.delete(type)
    }

    hasType = (type: GraphNodeType)=>{
        return this.nodeTypes.has(type)
    }

}

export interface NodeData{
    name: string,
    types: GraphNodeType[],
}