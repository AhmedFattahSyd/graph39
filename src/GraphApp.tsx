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
import SearchView from "./View/SearchView";

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
  public get viewWidth(): number {
    return this._viewWidth;
  }
  private _viewMargin = 5;
  public get viewMargin(): number {
    return this._viewMargin;
  }

  constructor(props: AppProps) {
    super(props);
    this.graphExplorer = new Explorer(this.refreshData);
    this.state = {
      initialLoadInProgress: false,
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
      dataLoading: true,
    };
  }

  createNewEntry = async () => {
    const newNode = await this.graphExplorer.createNewNode(
      "New entry"
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
          <SearchView
            viewableItem={item}
            currentGraph={graph}
            graphApp={this}
            graphExplorer={this.graphExplorer}
          />
        );
    }
  };

  closeView = (viewableItem: ViewableItem) => {
    const openViews = this.state.openViewableItems;
    openViews.delete(viewableItem.id);
    this.setState({ openViewableItems: openViews });
    // this.refreshAllOpenViews();
  };

  private showMessage = (
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
        </List>
        <Divider />
      </div>
    );
  };

  signOff = async () => {
    this.graphExplorer.signOff();
  };

  refreshData = async (
    userSignedOn: boolean,
    userName: string | null,
    mainGraph: Graph
  ) => {
    // console.log("App: user signedOn:", userSignedOn, "name:", userName);
    await this.setState({
      userSignedOn: userSignedOn,
      userName: userName,
      nodes: mainGraph.nodes,
    });
    if (this.state.dataLoading) {
      if (!this.state.initialLoadInProgress) {
        await this.setState({ dataLoading: false });
        const dataLoadingTime = Math.floor(
          (new Date().getTime() - this.startTime) / 1000
        );
        this.showMessage(
          `Data has been loaded. Elapsed time: ${dataLoadingTime} sec.
           nodes: ${this.state.mainGraph.nodes.size}`,
          MessageType.Information,
          60000
        );
        this.openSearchView();
      } else {
        // initial load is still in progress
        // this.showMessage(
        //   `Loading data ... items loaded: ${this.state.itemsLoaded}`,
        //   MpgMessageType.Information,
        //   60000
        // );
      }
    } else {
      // do nothing
    }
  };

  refreshOpenItems = ()=>{
    const openItems = this.state.openViewableItems
    this.setState({openViewableItems: openItems})
  }

  toggleDrawer = (open: boolean) => () => {
    this.setState({
      sidebarVisible: open,
    });
  };

  componentDidMount = async () => {
    try {
      this.updateSize();
      this.showMessage(
        "App has started. Version: " + this.appVersion,
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

  openSearchView = () => {
    const searchViewableItem = new ViewableItem(
      ViewableItemClass.Search,
      this.state.mainGraph
    );
    const openViewableItems = this.state.openViewableItems;
    openViewableItems.set(searchViewableItem.id, searchViewableItem);
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">
                {this.getCurrentUserName() + "  "}
              </Typography>
              <div style={{ width: "10px" }}></div>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                My Graph
              </Typography>
              <div style={{ width: "10px" }}></div>
              <Typography variant="body1">
                {"  " + this.state.nodes.size + " items"}
              </Typography>
              {/* <div style={{width:3}}></div>
              <Typography variant="body1">
                {"  " + this.state.rels.size + " rels"}
              </Typography> */}
            </div>
            {this.state.initialLoadInProgress ||
            this.state.dataSavingInprogress ? (
              <CircularProgress color="secondary" size={25} value={50} />
            ) : (
              <Tooltip title="New entry">
                <Icon style={{ margin: "5px" }} onClick={this.createNewEntry}>
                  add
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
        userName = this.state.userName;
      }
    }
    return userName;
  };
}
