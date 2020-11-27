import Graph from "../Core/Graph";

export default class StoredGraph{
    private _graph: Graph
    public get graph(){
        return this._graph
    }

    constructor(graph: Graph){
        this._graph=graph
    }
}