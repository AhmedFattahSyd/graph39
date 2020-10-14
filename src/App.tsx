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
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import React from "react";
import Theme from "./Theme";
import Explorer from "./GraphExplorer/GraphExplorer";

interface AppProps {}

interface AppState {
  initialLoadInProgress: boolean;
  dataSavingInprogress: boolean;
  sidebarVisible: boolean;
  userSignedOn: boolean;
  userName: string | null;
}

export default class App extends React.Component<AppProps, AppState> {
  private displayWidth: number = 3000;
  private graphExplorer: Explorer;

  constructor(props: AppProps) {
    super(props);

    this.graphExplorer = new Explorer(this.refreshData);

    this.state = {
      initialLoadInProgress: false,
      dataSavingInprogress: false,
      sidebarVisible: false,
      userSignedOn: false,
      userName: null,
    };
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
              justifyContent: "flex-start",
              flexWrap: "wrap",
              textAlign: "center",
              width: this.displayWidth,
              alignItems: "flex-start",
              alignContent: "flex-start",
            }}
          ></div>
          {this.renderDrawer()}
        </div>
      </div>
    );
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

  signOn = async () => {
    this.graphExplorer.signOn();
  };

  signOff = async () => {
    this.graphExplorer.signOff();
  };

  refreshData = async (userSignedOn: boolean, userName: string | null) => {
    console.log("App: user signedOn:", userSignedOn, "name:", userName);
    await this.setState({ userSignedOn: userSignedOn, userName: userName });
  };

  toggleDrawer = (open: boolean) => () => {
    this.setState({
      sidebarVisible: open,
    });
  };

  componentDidMount = async () => {
    await this.graphExplorer.init();
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
              backgroundColor: Theme.palette.primary.dark,
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
                {/* {"  " + this.state.items.size + " items"} */}
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
                <Icon
                  style={{ margin: "5px" }}
                  // onClick={this.createABlankEntryAndOpenIt}
                >
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
