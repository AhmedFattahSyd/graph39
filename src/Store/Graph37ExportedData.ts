// Defeinition of Graph37 data format

export enum MpgItemType {
  Root = "Root",
  // an item that can be viewed in the app
  ViewableItem = "ViewableItem",
  // a data item that can be stored
  Item = "Item",
  User = "User",
  Rel = "Rel",
  Entry = "Entry",
  Tag = "Tag",
  List = "list",
  Search = "Search",
  Timeline = "Timeline",
  TagList = "TagList",
  Inbox = "Inbox",
  GraphicalView = "GraphicalView",
  Context = "Context",
  Import = "Import",
}
export enum MpgItemState {
  Active = "Active",
  Parked = "Parked",
  Archived = "Archived",
  Done = "Done",
}

export enum MpgItemPrivacy {
  Public = "Public",
  Community = "Community",
  Personal = "Personal",
  Private = "Private",
}

export interface MpgExternalItemData {
  id: string;
  headline: string;
  notes: string;
  type: MpgItemType;
  createdAt: Date;
  updatedAt: Date;
  priority: number;
  state: MpgItemState;
  parkedUntil: Date;
  sentiment: number;
  overrideSentiment: boolean;
  privacy: MpgItemPrivacy;
}

export interface MpgExternalRelData extends MpgRelData {
  id: string;
}

export enum MpgRelType {
  "Tag" = "tag",
  "Parent" = "parent",
}

export interface MpgRelData {
  type: MpgRelType;
  item1Id: string;
  item2Id: string;
}

export interface MpgExternalData {
  dataVerionNumber: number;
  dataVersionText: string;
  exportedAt: Date;
  user: MpgExternalItemData;
  graphData: {
    entries: MpgExternalItemData[];
    tags: MpgExternalItemData[];
    lists: MpgExternalItemData[];
    rels: MpgExternalRelData[];
  };
}
