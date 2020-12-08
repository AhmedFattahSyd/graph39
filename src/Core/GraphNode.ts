import GraphRoot from "./GraphRoot";
import { GraphObjectClass } from "./GraphObjectClass";
import GraphEdge from "./GraphEdge";
import { PersistentGraphData } from "../Store/PersistentGraph";

// Node module
// Node is an entry with the option be also a tag
export default class GraphNode extends GraphRoot {
  constructor(
    name: string = "No name",
    id: string = "",
    tagFlag: boolean = false
  ) {
    super(name, id);
    this._class = GraphObjectClass.Node;
    this.tagFlag = tagFlag;
  }

  private _tagFlag: boolean = false;
  public get tagFlag(): boolean {
    return this._tagFlag;
  }
  public set tagFlag(value: boolean) {
    this._tagFlag = value;
  }

  getNodeData = () => {
    const data: NodeData = {
      name: this.name,
      tagFlag: this.tagFlag,
    };
    return data;
  };

  private _tagEdges = new Map<string, GraphEdge>();
  public get tagEdges() {
    return this._tagEdges;
  }
  // private set tagEdges(value) {
  //   this._tagEdges = value;
  // }

  public addTagEdge = (tagEdge: GraphEdge) => {
    this._tagEdges.set(tagEdge.id, tagEdge);
    // set the tagged nodes in the adge
    tagEdge.node2.addTaggedNodeEdge(tagEdge);
  };

  public deleteTagEdge = (tagEdge: GraphEdge) => {
    if (!this._tagEdges.delete(tagEdge.id)) {
      throw new Error(
        `GraphNode: deleteTagEdge: edge:${tagEdge.id} does not exist in node:${this.shortName}`
      );
    }
    // delete the tagged nodes in the adge
    // why do we need this?
    // tagEdge.node2.deleteTaggedNodeEdge(tagEdge);
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

  public hasTag = (tag: GraphNode) => {
    return this.tags.has(tag.id);
  };

  public hasAllTags = (tags: Map<string, GraphNode>) => {
    return tags.size > 0
      ? Array.from(tags.values())
          .map((tag) => this.hasTag(tag))
          .reduce((acc, hasTag) => {
            return acc && hasTag;
          }, true)
      : false;
  };

  public removeTagEdges = (tag: GraphNode) => {
    this.getTagEdgesOfTag(tag).forEach((edge) => this.deleteTagEdge(edge));
  };

  public getTagEdgesOfTag = (tag: GraphNode) => {
    return Array.from(this._tagEdges.values()).filter((tagEdge) => {
      return tagEdge.node2.id === tag.id;
    });
  };

  public getTaggedNodeEdgesOfNode = (taggedNode: GraphNode) => {
    return Array.from(this._tagEdges.values()).filter((tagEdge) => {
      return tagEdge.node1.id === taggedNode.id;
    });
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

  private deleteTaggedNodeEdge = (edge: GraphEdge) => {
    if (this._taggedNodesEdges.delete(edge.id)) {
      throw new Error(
        `GraphNode: deleteTaggedNodeEdge: edge:${edge.id} does not exist in node:${this.shortName}`
      );
    }
  };

  setCurrentGraph = (id: string, data: PersistentGraphData) => {}

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

export interface NodeData {
  name: string;
  tagFlag: boolean;
}
