import GraphEdge from "../Core/GraphEdge";
import { GraphEdgeType } from "../Core/GraphEdgeType";
import GraphNode, { GraphNodePrivacy, GraphNodeState } from "../Core/GraphNode";
import GraphExplorer from "../GraphExplorer/GraphExplorer";

export interface ExportNodeData {
  id: string,
  name: string;
  tagFlag: boolean;
  contextFlag: boolean;
  listFlag:boolean
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  priority: number;
  state: GraphNodeState;
  parkedUntil: Date;
  sentiment: number;
  overrideSentiment: boolean;
  privacy: GraphNodePrivacy;
  starred: boolean;
}

export interface ExportEdgeData {
  id: string,
  edgeType: GraphEdgeType;
  node1Id: string;
  node2Id: string;
}

export interface ExportUserData {
  id: string;
  name: string;
}

export interface ExportGraphData {
  dataVerionNumber: number;
  dataVersionText: string;
  exportedAt: Date;
  user: ExportUserData;
  graphData: {
    nodes: ExportNodeData[];
    edges: ExportEdgeData[];
  };
}

export default class ImportExportAgentV2 {

  private _graphExplorer: GraphExplorer;
  private _dataVersionNumber = 2;
  private _dataVersionText = "V2 - 3 Jan 2021";
  private _importedParsedData: ExportGraphData | null = null;

  constructor(graphExplorer: GraphExplorer) {
    this._graphExplorer = graphExplorer;
  }

  public exportData = async() => {
    const exportedData = this.getExportData();
    if (exportedData !== undefined) {
      const text = JSON.stringify(exportedData);
      const dateString = new Date()
        .toString()
        .split("GMT")[0]
        .replace(" ", "_");
      const filename = "Graph-" + dateString + ".graphdata";
      await this.downloadFile(filename, text);
    }
  };

   public importData = async (data: string) => {
    try {
      this._importedParsedData = JSON.parse(data);
      this._importedParsedData?.graphData.nodes.forEach(
        async (nodeData) => {
          await this.importNode(nodeData);
        }
      );
      this._importedParsedData?.graphData.edges.forEach(
        async (edgeData) => {
          await this.importEdge(edgeData);
        }
      );
    } catch (error) {
      //   this._graphExplorer.errorOccured(error);
      throw error;
    }
  };

  private importNode = async(nodeData: ExportNodeData)=>{
    const node = new GraphNode(
      nodeData.name,
      nodeData.id,
      nodeData.tagFlag,
      nodeData.contextFlag,
      nodeData.listFlag,
      nodeData.starred,
      nodeData.notes,
      new Date(nodeData.createdAt),
      new Date(nodeData.updatedAt),
      nodeData.priority,
      nodeData.state,
      new Date(nodeData.parkedUntil),
      nodeData.sentiment,
      nodeData.privacy
    );
    await this._graphExplorer.importNode(node);
  }

  private importEdge = async(edgeData: ExportEdgeData)=>{
    await this._graphExplorer.importEdge(edgeData.id,edgeData);
  }

  private downloadFile = async (filename: string, text: string) => {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  private getExportData = () => {
    try {
      if (this._graphExplorer.user !== null) {
        const userId = this._graphExplorer.user.userId;
        const userName = this._graphExplorer.user.name;
        if (userId !== undefined && userName !== null) {
          const exportData: ExportGraphData = {
            dataVerionNumber: this._dataVersionNumber,
            dataVersionText: this._dataVersionText,
            exportedAt: new Date(),
            user: { id: userId, name: userName },
            graphData: {
              nodes: Array.from(
                this._graphExplorer.mainGraph.nodes.values()
              ).map((node) => this.getNodeExportData(node)),
              edges: Array.from(
                this._graphExplorer.mainGraph.edges.values()
              ).map((edge) => this.getEdgeExportData(edge)),
            },
          };
          return exportData;
        }
      } else {
        throw new Error(`MpgGraphData: getExportedData: user is null`);
      }
    } catch (error) {
      throw error;
    }
  };

  private getNodeExportData = (node: GraphNode): ExportNodeData => {
    const data: ExportNodeData = {
      id: node.id,
      name: node.name,
      tagFlag: node.tagFlag,
      contextFlag: node.contextFlag,
      listFlag:node.listFlag,
      starred: node.starred,
      notes: node.notes,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      priority: node.priority,
      state: node.state,
      parkedUntil: node.parkedUntil,
      sentiment: node.sentiment,
      overrideSentiment: node.overrideSentiment,
      privacy: node.privacy,
    };
    return data;
  };

  getEdgeExportData = (edge: GraphEdge): ExportEdgeData => {
    const data: ExportEdgeData = {
      id: edge.id,
      edgeType: edge.edgeType,
      node1Id: edge.node1.id,
      node2Id: edge.node2.id,
    };
    return data;
  };
}
