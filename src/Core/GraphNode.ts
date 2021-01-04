import GraphRoot from "./GraphRoot";
import GraphEdge from "./GraphEdge";
import { PersistentGraphData } from "../Store/PersistentGraph";
import { GraphObjectClass } from "./GraphObjectClass";

// Node module
// Node is an entry with the option be also a tag

export enum GraphNodeState {
  Active = "Active",
  Parked = "Parked",
  Done = "Done",
}
export enum GraphNodePrivacy {
  Public = "Public",
  Community = "Community",
  Personal = "Personal",
  Private = "Private",
}

export default class GraphNode extends GraphRoot {
  constructor(
    name: string,
    id: string,
    tagFlag: boolean = false,
    contextFlag: boolean = false,
    starred: boolean = false,
    notes: string = "",
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    priority: number = 0,
    state: GraphNodeState = GraphNodeState.Active,
    parkedUntil: Date = new Date(),
    sentiment: number = 0,
    privacy=GraphNodePrivacy.Personal
  ) {
    super(name, id);
    this._class = GraphObjectClass.Node;
    this._tagFlag = tagFlag;
    this._priority = priority;
    this._notes = notes;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._state = state;
    this._parkedUntil = parkedUntil;
    this._sentiment = sentiment;
    this._starred = starred;
    this.contextFlag = contextFlag;
    this._privacy=privacy
  }

  private _sentiment = 0;
  public get sentiment() {
    return this._sentiment;
  }
  public set sentiment(value) {
    this._sentiment = value;
  }

  private _state = GraphNodeState.Active;

  private _parkedUntil: Date = new Date();
  public get parkedUntil(): Date {
    return this._parkedUntil;
  }
  public set parkedUntil(value: Date) {
    this._parkedUntil = value;
    const now = new Date();
    if (this._parkedUntil < now) {
      this._state = GraphNodeState.Active;
    } else {
      this._state = GraphNodeState.Parked;
    }
  }

  public get state() {
    // check date and change parked state if time is out
    if (this._state === GraphNodeState.Parked) {
      const now = new Date();
      if (this._parkedUntil < now) {
        this._state = GraphNodeState.Active;
      } else {
        this._state = GraphNodeState.Parked;
      }
    }
    return this._state;
  }

  public park = (numberOfHours: number = 1) => {
    this.state = GraphNodeState.Parked;
    this.parkedUntil = new Date();
    this.parkedUntil.setHours(this.parkedUntil.getHours() + numberOfHours);
  };

  public set state(value: GraphNodeState) {
    this._state = value;
    // console.log("GraphNode: set state: vlaue:",value,"this_state:",this._state)
  }

  private _notes: string = "";
  public get notes(): string {
    return this._notes;
  }
  public set notes(value: string) {
    this._notes = value;
  }

  private _priority: number = 0;
  public get priority(): number {
    return this._priority;
  }
  public set priority(value: number) {
    this._priority = value;
  }

  private _tagFlag: boolean = false;
  public get tagFlag(): boolean {
    return this._tagFlag;
  }
  public set tagFlag(value: boolean) {
    this._tagFlag = value;
  }

  private _contextFlag: boolean = false;
  public get contextFlag(): boolean {
    return this._contextFlag;
  }
  public set contextFlag(value: boolean) {
    this._contextFlag = value;
  }

  private _privacy = GraphNodePrivacy.Personal;
  public get privacy() {
    return this._privacy;
  }
  public set privacy(value) {
    this._privacy = value;
  }
  private _overrideSentiment = false;
  public get overrideSentiment() {
    return this._overrideSentiment;
  }
  public set overrideSentiment(value) {
    this._overrideSentiment = value;
  }
  private _tagEdges = new Map<string, GraphEdge>();
  public get tagEdges() {
    return this._tagEdges;
  }

  public addTagEdge = (tagEdge: GraphEdge) => {
    this._tagEdges.set(tagEdge.id, tagEdge);
    // set the tagged nodes in the adge
    tagEdge.node2.addTaggedNodeEdge(tagEdge);
  };

  public addParentEdge = (parentEdge: GraphEdge) => {
    this._parentEdges.set(parentEdge.id, parentEdge);
    // set the tagged nodes in the adge
    parentEdge.node2.addChildEdge(parentEdge);
  };

  public deleteTagEdge = (tagEdge: GraphEdge) => {
    if (!this._tagEdges.delete(tagEdge.id)) {
      throw new Error(
        `GraphNode: deleteTagEdge: edge:${tagEdge.id} does not exist in node:${this.shortName}`
      );
    }
  };

  public get tags(): Map<string, GraphNode> {
    return new Map(
      Array.from(this._tagEdges.values())
        .map((edge) => {
          return edge.node2;
        })
        .map((node) => [node.id, node])
    );
  }

  public get parents(): Map<string, GraphNode> {
    return new Map(
      Array.from(this._parentEdges.values())
        .map((edge) => {
          return edge.node2;
        })
        .map((node) => [node.id, node])
    );
  }

  public get children(): Map<string, GraphNode> {
    return new Map(
      Array.from(this._childEdges.values())
        .map((edge) => {
          return edge.node1;
        })
        .map((node) => [node.id, node])
    );
  }

  private _starred = false;
  public get starred() {
    return this._starred;
  }
  public set starred(value) {
    this._starred = value;
  }

  public hasTag = (tag: GraphNode): boolean => {
    return (
      this.tags.size > 0 &&
      (this.tags.has(tag.id) ||
        (tag.getDescendents().size !== 0 &&
          Array.from(tag.getDescendents().values())
            .map((descendentTag) => this.tags.has(descendentTag.id))
            .reduce((acc, hasTag) => acc || hasTag, false)))
    );
  };

  public get netPriority() {
    return (
      this._priority +
      Array.from(this.tags.values())
        .map((tag) => tag.priority)
        .reduce((acc, tagPriority) => acc + tagPriority, 0)
    );
  }

  public hasAllTags = (tags: Map<string, GraphNode>) => {
    // const hasAllTags = Array.from(tags.values()
    //   .map((tag) => this.hasTag(tag))
    //   .reduce((acc, hasTag) => acc && hasTag, true);
    // console.log(
    //   "GraphNode: hasAllTags: node:",
    //   this.name,
    //   "tags:",
    //   tags,
    //   "hasAllTags:",
    //   hasAllTags
    // );
    return tags.size > 0 && this.tags.size > 0
      ? Array.from(tags.values())
          .map((tag) => this.hasTag(tag))
          .reduce((acc, hasTag) => acc && hasTag, true)
      : false;
  };

  private _parentEdges = new Map<string, GraphEdge>();
  public get parentEdges() {
    return this._parentEdges;
  }
  public set parentEdges(value) {
    this._parentEdges = value;
  }

  private _childEdges = new Map<string, GraphEdge>();
  public get childEdges() {
    return this._childEdges;
  }
  public set childEdges(value) {
    this._childEdges = value;
  }

  public removeTagEdges = (tagNode: GraphNode) => {
    this.getTagEdgesOfTag(tagNode).forEach((edge) => this.deleteTagEdge(edge));
  };

  public getTagEdgesOfTag = (tag: GraphNode) => {
    return Array.from(this._tagEdges.values()).filter((tagEdge) => {
      return tagEdge.node2.id === tag.id;
    });
  };

  public removeTagEdgeOfTagNode = (tagNode: GraphNode):GraphEdge|undefined=>{
      const foundTagEdge = Array.from(this.tagEdges.values()).find(tagEdge=>
        tagEdge.node2.id === tagNode.id)
      if(foundTagEdge !== undefined){
        this.tagEdges.delete(foundTagEdge.id)
        foundTagEdge.node2.taggedNodesEdges.delete(foundTagEdge.id)
      }
      return foundTagEdge
  }

  public getTaggedNodeEdgesOfNode = (taggedNode: GraphNode) => {
    return Array.from(this._tagEdges.values()).filter((tagEdge) => {
      return tagEdge.node1.id === taggedNode.id;
    });
  };

  public getAncestors = (
    ancestorsSoFar: Map<string, GraphNode> = new Map()
  ): Map<string, GraphNode> => {
    this.parents.forEach((parent) => {
      if (!ancestorsSoFar.has(parent.id)) {
        ancestorsSoFar.set(parent.id, parent);
      }
      parent.getAncestors(ancestorsSoFar);
    });
    return ancestorsSoFar;
  };

  public getDescendents = (
    descendentsSoFar: Map<string, GraphNode> = new Map()
  ): Map<string, GraphNode> => {
    this.children.forEach((child) => {
      if (!descendentsSoFar.has(child.id)) {
        descendentsSoFar.set(child.id, child);
      }
      child.getDescendents(descendentsSoFar);
    });
    return descendentsSoFar;
  };

  public isRootInCollection = (
    nodeCollection: Map<string, GraphNode>
  ): boolean => {
    // return true is
    // node has no parents
    // or if parents are not in collection provided
    // nor descendent of any node in connection
    // should improve this algorithm
    return (
      nodeCollection.size === 0 ||
      this.parents.size === 0 ||
      Array.from(this.getAncestors().values())
        .map((ancestor) => !nodeCollection.has(ancestor.id))
        .reduce((acc, isRoot) => acc && isRoot, true)
    );
    // let isRootInCollection = false;
    // if (nodeCollection.size === 0 || this.parents.size === 0) {
    //   isRootInCollection = true;
    // } else {
    //   this.getAncestors().forEach((ancestor) => {
    //     if (!nodeCollection.has(ancestor.id)) {
    //       isRootInCollection = true;
    //     }
    //   });
    // }
    // return isRootInCollection;
  };

  public isRootInCollectionDELETE = (
    nodeCollection: Map<string, GraphNode>
  ): boolean => {
    // return true is
    // node has no parents
    // or if parents are not in collection provided
    // nor descendent of any node in connection
    // should improve this algorithm
    let isRootInCollection = false;
    if (nodeCollection.size === 0 || this.parents.size === 0) {
      isRootInCollection = true;
    } else {
      this.getAncestors().forEach((ancestor) => {
        if (!nodeCollection.has(ancestor.id)) {
          isRootInCollection = true;
        }
      });
    }
    return isRootInCollection;
  };

  public isAncestor = (nodeToBeTest: GraphNode): boolean => {
    return this.getAncestors().has(nodeToBeTest.id);
  };

  public isDescendent = (nodeToBeTest: GraphNode): boolean => {
    return this.getDescendents().has(nodeToBeTest.id);
  };

  removeParentEdge = (parentNode: GraphNode): GraphEdge | undefined => {
    const parentEdgeToBeRemoved = Array.from(this.parentEdges.values()).find(
      (edge) => {
        return edge.node2.id === parentNode.id;
      }
    );
    if (parentEdgeToBeRemoved !== undefined) {
      // we should assert that these edges existed and have been deleted
      if (!this._parentEdges.delete(parentEdgeToBeRemoved.id)) {
        throw new Error(
          `GraphNode: removeParentNode: parentEdgeToBeRemoved does not exist in parentEdges`
        );
      } else {
        if (
          !parentEdgeToBeRemoved.node2.childEdges.delete(
            parentEdgeToBeRemoved.id
          )
        ) {
          throw new Error(
            `GraphNode: removeParentNode: parentEdgeToBeRemoved does not exist in childEdges`
          );
        }
      }
    } else {
      throw new Error(
        `GraphNode: removeParentNode: parentEdgeToBeRemoved is undefined`
      );
    }
    return parentEdgeToBeRemoved;
  };

  public removeTaggedNodeEdges = (taggedNode: GraphNode) => {
    this.getTaggedNodeEdgesOfNode(taggedNode).forEach((edge) =>
      this.deleteTagEdge(edge)
    );
  };

  private _taggedNodesEdges = new Map<string, GraphEdge>();
  public get taggedNodesEdges() {
    return this._taggedNodesEdges;
  }
  public set taggedNodesEdges(value) {
    this._taggedNodesEdges = value;
  }

  private addTaggedNodeEdge = (edge: GraphEdge) => {
    this._taggedNodesEdges.set(edge.id, edge);
  };

  private addChildEdge = (edge: GraphEdge) => {
    this._childEdges.set(edge.id, edge);
  };

  private deleteTaggedNodeEdge = (edge: GraphEdge) => {
    if (this._taggedNodesEdges.delete(edge.id)) {
      throw new Error(
        `GraphNode: deleteTaggedNodeEdge: edge:${edge.id} does not exist in node:${this.shortName}`
      );
    }
  };

  setCurrentGraph = (id: string, data: PersistentGraphData) => {};

  public get taggedNodes(): Map<string, GraphNode> {
    return new Map(
      Array.from(this._taggedNodesEdges.values())
        .map((edge) => {
          return edge.node1;
        })
        .map((node) => [node.id, node])
    );
  }

  public get shortName(): string {
    let shortName = this.name.substring(0, 20);
    if (shortName.length < this.name.length) {
      shortName += "...";
    }
    return shortName;
  }
}

// export interface GraphNodeData {
//   // persistent data may differe in so many ways
//   // for example, Firebase stores Date and Firebase.Timestampe
//   // it's not possible to extend and override
//   // so we will just leave it empty and get each subclass to define it's own data
// }
