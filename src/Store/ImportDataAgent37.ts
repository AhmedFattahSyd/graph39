import { GraphEdgeType } from "./../Core/GraphEdgeType";
import { GraphNodeState } from "./../Core/GraphNode";
import GraphNode from "../Core/GraphNode";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import {
  MpgExternalData,
  MpgExternalItemData,
  MpgExternalRelData,
  MpgItemState,
  MpgItemType,
  MpgRelType,
} from "./Graph37ExportedData";
import { GraphEdgeData } from "../Core/GraphEdge";

export default class ImportDataAgent37 {
  // import data from Graph37 to GraphData version x

  private _graphExplorer: GraphExplorer;
  private _importedParsedData: MpgExternalData | null = null;

  constructor(graphExporer: GraphExplorer) {
    this._graphExplorer = graphExporer;
  }

  private mapState = (itemData: MpgExternalItemData): GraphNodeState => {
    let newState: GraphNodeState;
    switch (itemData.state) {
      case MpgItemState.Active:
        newState = GraphNodeState.Active;
        break;
      case MpgItemState.Parked:
        newState = GraphNodeState.Parked;
        break;
      case MpgItemState.Done:
        newState = GraphNodeState.Done;
        break;
      default:
        throw new Error(
          `ImportDataAgent37: mapState: invalid item state: ${itemData.state}`
        );
    }
    return newState;
  };

  private importItem = async (
    itemData: MpgExternalItemData,
    type: MpgItemType
  ) => {
    try {
      if (itemData.type !== type) {
        throw new Error(
          `ImportDataAgent37: importItem: item type ${itemData.type} does not match parameter: ${type}`
        );
      } else {
        if (itemData.state !== MpgItemState.Archived) {
          let tagFlag = false;
          let listFlag=false
          if (itemData.type === MpgItemType.Tag) {
            tagFlag = true;
          }else{
            if(itemData.type===MpgItemType.List){
              listFlag=true
            }
          }
          const newState = this.mapState(itemData);
          const node = new GraphNode(
            itemData.headline,
            itemData.id,
            tagFlag,
            false,
            listFlag,
            false,
            itemData.notes,
            new Date(itemData.createdAt),
            new Date(itemData.updatedAt),
            itemData.priority,
            newState,
            new Date(itemData.parkedUntil),
            itemData.sentiment,
            // itemData.privacy
          );
          await this._graphExplorer.importNode(node);
        } else {
          // do nothing
          // we will not import archived nodes???
        }
      }
    } catch (error) {
      //   this._graphExplorer.errorOccured(error);
      throw error;
    }
  };

  private importEdge = async (relData: MpgExternalRelData) => {
    const edgeType = this.mapRelTypeToEdgeType(relData.type);
    // it seems that the direction of parent rel is the opposite of the new one
    const node1Id =
      relData.type === MpgRelType.Parent ? relData.item2Id : relData.item1Id;
    const node2Id =
      relData.type === MpgRelType.Parent ? relData.item1Id : relData.item2Id;
    const newEdgeData: GraphEdgeData = {
      edgeType: edgeType,
      node1Id: node1Id,
      node2Id: node2Id,
    };
    await this._graphExplorer.importEdge(relData.id, newEdgeData);
  };

  private mapRelTypeToEdgeType = (relType: MpgRelType): GraphEdgeType => {
    let edgeType: GraphEdgeType;
    switch (relType) {
      case MpgRelType.Tag:
        edgeType = GraphEdgeType.Tag;
        break;
      case MpgRelType.Parent:
        edgeType = GraphEdgeType.Parent;
        break;
      default:
        throw new Error(
          `ImportDataAgent37: maprelTypeToEdgeType: invalid relType:${relType}`
        );
    }
    return edgeType;
  };

  public importData = async (data: string) => {
    try {
      this._importedParsedData = JSON.parse(data);
      await this._importedParsedData?.graphData.entries.forEach(
        async (entryData) => {
          await this.importItem(entryData, MpgItemType.Entry);
        }
      );
      await this._importedParsedData?.graphData.tags.forEach(
        async (entryData) => {
          await this.importItem(entryData, MpgItemType.Tag);
        }
      );
      await this._importedParsedData?.graphData.lists.forEach(
        async (entryData) => {
          await this.importItem(entryData, MpgItemType.List);
        }
      );
      await this._importedParsedData?.graphData.rels.forEach(
        async (relData) => {
          await this.importEdge(relData);
        }
      );
    } catch (error) {
      //   this._graphExplorer.errorOccured(error);
      throw error;
    }
  };
}
