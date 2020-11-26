import GraphRoot from "./GraphRoot";
import { ObjectClass } from "./ObjectClass";

export default class GraphNode extends GraphRoot{

    private _name: string = "No name";
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    constructor(name: string = "No name",id: string = "",){
        super(id)
        this._name=name
        this._class=ObjectClass.Node
    }

    getNodeData = ()=>{
        const data: NodeData = {
            name: this._name
        }
        return data
    }
}

export interface NodeData{
    name: string
}