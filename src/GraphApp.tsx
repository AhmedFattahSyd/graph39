import {
  Toolbar,
  CircularProgress,
  Icon,
  Typography,
  Tooltip,
  SwipeableDrawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  SnackbarContent,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import React from "react";
import GraphTheme from "./GraphTheme";
import Explorer from "./GraphExplorer/GraphExplorer";
import Graph from "./Core/Graph";
import GraphNode from "./Core/GraphNode";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import NodeView from "./View/NodeView";
import ViewableItem from "./View/ViewableItem";
import { ViewableItemClass } from "./View/ViewableItemClass";
import GraphView from "./View/GraphView";
import LogView from "./View/LogView";
import ImportDataView from "./View/ImportDataView";

interface AppProps {}

interface AppState {
  initialLoadInProgress: boolean;
  dataSavingInprogress: boolean;
  sidebarVisible: boolean;
  userSignedOn: boolean;
  userName: string | null;
  nodes: Map<string, GraphNode>;
  openViewableItems: Map<string, ViewableItem>;
  messageVisible: boolean;
  message: string;
  messageWaitTime: number;
  messageType: MessageType;
  mainGraph: Graph;
  dataLoading: boolean;
  logText: string;
  error: Error | null;
  filteredStarredNodes: Map<string, GraphNode>;
  filteredTags: Map<string, GraphNode>;
  filteredContexts: Map<string, GraphNode>;
  filteredEntries: Map<string, GraphNode>;
  searchText: string;
}

enum MessageType {
  Information = "Information",
  Error = "Error",
}

export default class GraphApp extends React.Component<AppProps, AppState> {
  private appVersion = "My Graph - Version: Alpha (0.39.001) - 26 Nov 2020";
  private maxDisplayWidth = 10000;
  private displayWidth: number = 3000;
  private graphExplorer: Explorer;
  readonly maxViewWidth = 410;
  private startTime: number = new Date().getTime();
  private _viewWidth: number = this.maxViewWidth;
  private _logView: ViewableItem | null = null;
  private _importDataView: ViewableItem | null = null;
  public get viewWidth(): number {
    return this._viewWidth;
  }
  private _viewMargin = 5;
  public get viewMargin(): number {
    return this._viewMargin;
  }
  private _privateMode = true;
  public get privateMode() {
    return this._privateMode;
  }
  public set privateMode(value) {
    this._privateMode = value;
  }
  // private filteredStarredNodes: Map<string, GraphNode> = new Map();
  // private filteredTags: Map<string, GraphNode> = new Map();
  // private filteredContexts: Map<string, GraphNode> = new Map();
  // private filteredEntries: Map<string, GraphNode> = new Map();
  // private searchText = "";

  constructor(props: AppProps) {
    super(props);
    this.graphExplorer = new Explorer(this.refreshData);
    this.state = {
      initialLoadInProgress: true,
      dataLoading: true,
      dataSavingInprogress: false,
      sidebarVisible: false,
      userSignedOn: false,
      userName: null,
      nodes: new Map<string, GraphNode>(),
      // openNodes: new Map<string, GraphNode>(),
      openViewableItems: new Map<string, ViewableItem>(),
      messageVisible: false,
      messageType: MessageType.Information,
      messageWaitTime: 6000,
      message: "No message",
      mainGraph: this.graphExplorer.mainGraph,
      logText: "App has started",
      error: null,
      filteredStarredNodes: new Map(),
      filteredTags: new Map(),
      filteredContexts: new Map(),
      filteredEntries: new Map(),
      searchText: "",
    };
  }

  setFilteredNodes = () => {
    this.setState({
      filteredStarredNodes: this.graphExplorer.mainGraph.getFilteredNodesExact(
        this.state.searchText,
        false,
        false,
        true
      ),
      filteredContexts: this.graphExplorer.mainGraph.getFilteredNodesExact(
        this.state.searchText,
        false,
        true,
        false
      ),
      filteredTags: this.graphExplorer.mainGraph.getFilteredNodesExact(
        this.state.searchText,
        true,
        false,
        false
      ),
      filteredEntries: this.graphExplorer.mainGraph.getFilteredNodesExact(
        this.state.searchText,
        false,
        false,
        false
      ),
    });
  };

  setSearchText = async (text: string) => {
    await this.setState({ searchText: text });
    await this.setFilteredNodes();
  };

  createNewNode = async (
    headline = "New entry",
    tagFlag = false,
    contextFlag = false,
    starred = false
  ) => {
    const newNode = await this.graphExplorer.createNewNode(
      headline,
      tagFlag,
      contextFlag,
      starred
    );
    if (newNode !== null) {
      const viewableItem = new ViewableItem(ViewableItemClass.Node, newNode);
      const openViewableItems = this.state.openViewableItems;
      openViewableItems.set(viewableItem.id, viewableItem);
      this.setState({ openViewableItems: openViewableItems });
    } else {
      this.showMessage("New node could not be created", MessageType.Error);
    }
  };

  createNewEntry = async () => {
    this.createNewNode();
  };

  createNewStarredNode = async () => {
    this.createNewNode("New node", false, false, true);
  };

  createNewTag = async () => {
    this.createNewNode("New tag", true);
  };

  createNewContext = async () => {
    this.createNewNode("New context", false, true);
  };

  openNode = (node: GraphNode) => {
    const viewableItem = new ViewableItem(ViewableItemClass.Node, node);
    const openViewableItems = this.state.openViewableItems;
    openViewableItems.set(viewableItem.id, viewableItem);
    this.setState({ openViewableItems: openViewableItems });
  };

  signOn = async () => {
    this.graphExplorer.signOn();
  };

  handleCloseMessage = () => {
    this.setState({ messageVisible: false });
  };

  renderMessage() {
    const backgroundColor =
      this.state.messageType === MessageType.Information
        ? GraphTheme.palette.primary.dark
        : "red";
    return (
      <div style={{ display: "flex" }}>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.messageVisible}
          autoHideDuration={this.state.messageWaitTime}
          onClose={this.handleCloseMessage}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
        >
          <SnackbarContent
            style={{
              backgroundColor: backgroundColor,
              color: GraphTheme.palette.primary.contrastText,
            }}
            message={<span id="message-id">{this.state.message}</span>}
            action={[
              <Button
                key="undo"
                color="inherit"
                size="small"
                onClick={this.handleCloseMessage}
              >
                Close
              </Button>,
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleCloseMessage}
              ></IconButton>,
            ]}
          />
        </Snackbar>
      </div>
    );
  }

  render = () => {
    return (
      <div
        style={{
          width: this.displayWidth,
          height: "100%",
        }}
      >
        <div>
          {this.renderAppBar()}
          <div style={{ paddingTop: 60 }}> </div>
          <div
            style={{
              paddingTop: 5,
              display: "flex",
              // justifyContent: "flex-start",
              flexWrap: "wrap",
              textAlign: "center",
              width: this.displayWidth,
              alignItems: "flex-start",
              alignContent: "flex-start",
            }}
          >
            {Array.from(this.state.openViewableItems.values()).map((node) => (
              <div key={node.id}>{this.renderViewableItem(node)}</div>
            ))}
          </div>
          {this.renderMessage()}
          {this.renderDrawer()}
        </div>
      </div>
    );
  };

  renderViewableItem = (item: ViewableItem) => {
    switch (item.class) {
      case ViewableItemClass.Node:
        const node = item.object as GraphNode;
        return (
          <NodeView
            viewableItem={item}
            currentNode={node}
            graphApp={this}
            graphExplorer={this.graphExplorer}
          />
        );
      case ViewableItemClass.Search:
        const graph = item.object as Graph;
        return (
          <GraphView
            viewableItem={item}
            currentGraph={graph}
            graphApp={this}
            graphExplorer={this.graphExplorer}
            filteredStarredNodes={this.state.filteredStarredNodes}
            filteredTags={this.state.filteredTags}
            filteredContexts={this.state.filteredContexts}
            filteredEntries={this.state.filteredEntries}
            setSearchText={this.setSearchText}
          />
        );

      case ViewableItemClass.Log:
        return (
          <LogView
            viewableItem={item}
            currentGraph={this.state.mainGraph}
            graphApp={this}
            graphExplorer={this.graphExplorer}
            logText={this.state.logText}
          />
        );

      case ViewableItemClass.Import:
        return (
          <ImportDataView
            viewableItem={item}
            graphApp={this}
            graphExplorer={this.graphExplorer}
          />
        );

      // default:
      //   this.showMessage(
      //     `Invalid ViewableItemClass type: ${item.class}`,
      //     MessageType.Error
      //   );
    }
  };

  closeView = (viewableItem: ViewableItem) => {
    const openViews = this.state.openViewableItems;
    openViews.delete(viewableItem.id);
    this.setState({ openViewableItems: openViews });
    // this.refreshAllOpenViews();
  };

  public showMessage = (
    message: string,
    messageType: MessageType = MessageType.Information,
    messageWaitTime: number = 7000
  ) => {
    if (messageType === MessageType.Error) {
      messageWaitTime = 900000;
    }
    this.setState({
      messageVisible: true,
      message: message,
      messageWaitTime: messageWaitTime,
      messageType: messageType,
    });
  };

  renderDrawer = () => {
    return (
      <SwipeableDrawer
        open={this.state.sidebarVisible}
        onClose={this.toggleDrawer(false)}
        onOpen={this.toggleDrawer(true)}
        color="#DCDCDC"
      >
        <div
          tabIndex={0}
          role="button"
          onClick={this.toggleDrawer(false)}
          onKeyDown={this.toggleDrawer(false)}
        >
          {this.renderMenuItems()}
        </div>
      </SwipeableDrawer>
    );
  };

  renderMenuItems = () => {
    return (
      <div>
        <Divider />
        <List style={{ width: "300px" }}>
          <Divider />
          <ListItem button onClick={this.createNewEntry}>
            <ListItemText primary="New entry" />
          </ListItem>
          <ListItem button onClick={this.createNewTag}>
            <ListItemText primary="New tag" />
          </ListItem>
          <ListItem button onClick={this.createNewContext}>
            <ListItemText primary="New context" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.openSearchView}>
            <ListItemText primary="Search graph" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.signOn}>
            <ListItemText primary="Sign on" />
          </ListItem>
          <ListItem button onClick={this.signOff}>
            <ListItemText primary="Sign off" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.openImportDataView}>
            <ListItemText primary="Import data" />
          </ListItem>
          <ListItem button onClick={this.exportData}>
            <ListItemText primary="Export data" />
          </ListItem>
          <ListItem button onClick={this.openLogView}>
            <ListItemText primary="Log" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.setPrivateModeOn}>
            <ListItemText primary="Hide private items" />
          </ListItem>
          <ListItem button onClick={this.setPrivateModeOff}>
            <ListItemText primary="Show private items" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.showAppVersion}>
            <ListItemText primary="Show app version" />
          </ListItem>
        </List>
        <Divider />
      </div>
    );
  };

  private showAppVersion =()=>{
    this.showMessage(this.appVersion)
  }

  private exportData = async () => {
    await this.graphExplorer.exportData();
    this.showMessage("Data has been exported");
  };

  setPrivateModeOn = () => {
    this._privateMode = true;
  };

  setPrivateModeOff = () => {
    this._privateMode = false;
  };

  signOff = async () => {
    this.graphExplorer.signOff();
  };

  refreshData = async (
    userSignedOn: boolean,
    userName: string | null,
    mainGraph: Graph,
    error: Error | null,
    initialDataLoadInProgress: boolean
  ) => {
    // console.log("App: user signedOn:", userSignedOn, "name:", userName);
    await this.setState({
      userSignedOn: userSignedOn,
      userName: userName,
      nodes: mainGraph.nodes,
      error: error,
      initialLoadInProgress: initialDataLoadInProgress,
    });
    await this.setFilteredNodes();
    this.refreshOpenItems();
    if (error !== null) {
      this.showMessage(error.message, MessageType.Error);
      this.appendLog(error.message);
      this.openLogView();
    }
    const dataLoadingTime = Math.floor(
      (new Date().getTime() - this.startTime) / 1000
    );
    if (this.state.dataLoading) {
      if (!this.state.initialLoadInProgress) {
        await this.setState({ dataLoading: false });

        this.showMessage(
          `Data has been loaded. Elapsed time: ${dataLoadingTime} sec.
           items: ${this.state.mainGraph.nodes.size}
           relations: ${this.state.mainGraph.edges.size}`,
          MessageType.Information,
          60000
        );
        this.setState({ dataLoading: false });
        this.openSearchView();
      } else {
        //initial load is still in progress
        this.showMessage(
          `Loading data ... Elapsed time: ${dataLoadingTime} sec.
          items: ${this.state.mainGraph.nodes.size}
          relations: ${this.state.mainGraph.edges.size}`,
          MessageType.Information,
          60000
        );
      }
    } else {
      // do nothing
    }
  };

  refreshOpenItems = () => {
    const openItems = this.state.openViewableItems;
    this.setState({ openViewableItems: openItems });
  };

  toggleDrawer = (open: boolean) => () => {
    this.setState({
      sidebarVisible: open,
    });
  };

  componentDidMount = async () => {
    try {
      this.updateSize();
      this.showMessage(
        "App has started." + this.appVersion,
        MessageType.Information,
        12000
      );
      await this.graphExplorer.init();
      if (this.state.dataLoading) {
        this.showMessage("Loading data ... please wait");
        this.startTime = new Date().getTime();
      } else {
        this.openSearchView();
      }
    } catch (error) {
      // decide on error handling mechanism
      // this.setState({appErrorState: true, appError: error})
      // throw error
      // this.handleError(error);
    }
  };

  updateSize = () => {
    if (window.innerWidth < this.maxViewWidth) {
      this._viewWidth = window.innerWidth;
      this._viewMargin = 0;
      this.displayWidth = window.innerWidth;
    } else {
      this._viewWidth = this.maxViewWidth;
      this.displayWidth = this.maxDisplayWidth;
    }
    // console.log("displayWidth:", this.displayWidth);
  };

  appendLog = (text: string) => {
    this.setState({ logText: this.state.logText + "\n" + text });
  };

  openSearchView = () => {
    const searchViewableItem = new ViewableItem(
      ViewableItemClass.Search,
      this.state.mainGraph
    );
    const openViewableItems = this.state.openViewableItems;
    openViewableItems.set(searchViewableItem.id, searchViewableItem);
    this.setState({ openViewableItems: openViewableItems });
  };

  openLogView = () => {
    if (this._logView === null) {
      this._logView = new ViewableItem(ViewableItemClass.Log, null);
    }
    const openViewableItems = this.state.openViewableItems;
    // openViewableItems.set(logViewableItem.id, logViewableItem);
    openViewableItems.set(this._logView.id, this._logView);
    this.setState({ openViewableItems: openViewableItems });
  };

  openImportDataView = () => {
    if (this._importDataView === null) {
      this._importDataView = new ViewableItem(ViewableItemClass.Import, null);
    }
    const openViewableItems = this.state.openViewableItems;
    // openViewableItems.set(logViewableItem.id, logViewableItem);
    openViewableItems.set(this._importDataView.id, this._importDataView);
    this.setState({ openViewableItems: openViewableItems });
  };

  renderAppBar = () => {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: GraphTheme.palette.primary.dark,
            }}
          >
            <div>
              {this.state.initialLoadInProgress ||
              this.state.dataSavingInprogress ? (
                <CircularProgress color="secondary" size={25} value={50} />
              ) : (
                <Icon
                  style={{ margin: "5px" }}
                  onClick={this.toggleDrawer(true)}
                >
                  menu
                </Icon>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1">
                  {this.getCurrentUserName() + "  "}
                </Typography>
                <div style={{ width: "10px" }}></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" style={{ fontWeight: "bold" }}>
                    My Graph
                  </Typography>
                  {!this._privateMode ? (
                    <Typography
                      variant="body1"
                      style={{
                        fontWeight: "bold",
                        fontSize: "10px",
                        color: GraphTheme.palette.secondary.light,
                      }}
                    >
                      Private mode
                    </Typography>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div style={{ width: "10px" }}></div>
                <Typography variant="body1">
                  {"  " + this.state.nodes.size + " items"}
                </Typography>
              </div>
            </div>
            {this.state.initialLoadInProgress ||
            this.state.dataSavingInprogress ? (
              <CircularProgress color="secondary" size={25} value={50} />
            ) : (
              <Tooltip title="New entry">
                <Icon style={{ margin: "5px" }} onClick={this.createNewEntry}>
                  add_circle_outline
                </Icon>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  };

  getCurrentUserName = () => {
    let userName = "No user";
    if (this.state.userSignedOn) {
      if (this.state.userName !== null) {
        userName = this.state.userName.split(" ")[0];
      }
    }
    return userName;
  };
}
