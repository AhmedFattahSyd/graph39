import User from "../Auth/User"
import GraphNode from "../Core/GraphNode"

export default class GraphStore{

    private _user: User
    public get user(): User {
        return this._user
    }
    public set user(value: User) {
        this._user = value
    }

    constructor(user: User){
        this._user=user
    }

    init = async()=>{
    }

    getData = async(): Promise<string> =>{
        return ""
    }

    updateNode=(node: GraphNode)=>{

    }
}