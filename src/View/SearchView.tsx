import {
  Typography,
  Tooltip,
  Icon,
  CircularProgress,
  Button,
  TextField,
  Card,
} from "@material-ui/core";
import React from "react";
import Graph from "../Core/Graph";
import GraphNode from "../Core/GraphNode";
import { GraphNodeType } from "../Core/NodeTypes";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";
import NodeListComponent from "./NodeListComponent";
import Panel from "./Panel";
import SkeletonView from "./SkeletonView";
import ViewableItem from "./ViewableItem";

// search view module

interface SearchViewProps {
  viewableItem: ViewableItem;
  currentGraph: Graph;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
}
interface SearchViewState {
  currentGraph: Graph;
  itemDataChanged: boolean;
  dataSavingInProgress: boolean;
  searchText: string;
  // filteredNodes: Map<string, GraphNode>;
  graphSize: number;
  currentNodes: Map<string, GraphNode>;
}

export default class SearchView extends React.Component<
  SearchViewProps,
  SearchViewState
> {
  constructor(props: SearchViewProps) {
    super(props);
    this.state = {
      currentGraph: props.currentGraph,
      itemDataChanged: false,
      dataSavingInProgress: false,
      searchText: "",
      // filteredNodes: props.currentGraph.getFilteredNodes(""),
      graphSize: props.currentGraph.nodes.size,
      currentNodes: props.currentGraph.nodes,
    };
  }

  render = () => {
    return (
      <SkeletonView
        graphApp={this.props.graphApp}
        renderHeader={this.renderHeader}
        renderBody={this.renderBody}
        renderButtons={this.renderButtons}
      />
    );
  };

  renderBody = () => {
    return (
      <Card
        elevation={1}
        style={{
          textAlign: "left",
          margin: 5,
          paddingRight: 2,
          paddingLeft: 2,
          paddingTop: -150,
          paddingBottom: 0,
          //   width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            margin: 5,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <TextField
              id="seachText"
              autoFocus
              // onFocus={event => event.target.select()}
              label="Search text"
              value={this.state.searchText}
              margin="normal"
              style={{ width: "80%", fontSize: 12 }}
              onChange={this.handleSearchTextChange}
              // onKeyPress={this.handleKeyPressed}
              // onBlur={event=>this.setAllMatchedItems()}
            />
            <Button
              onClick={() => this.setFilteredNodes()}
              style={{
                margin: 0,
                color: GraphTheme.palette.primary.contrastText,
                backgroundColor: GraphTheme.palette.primary.main,
                height: 20,
                width: 30,
                fontSize: 9,
              }}
              size="small"
            >
              Search
            </Button>
          </div>
          {this.renderPanels()}
        </div>
      </Card>
    );
  };

  setFilteredNodes = () => {
    // this.setState({
    //   filteredNodes: this.state.currentGraph.getFilteredNodes(
    //     this.state.searchText
    //   ),
    // });
  };

  renderPanels = () => {
    return (
      <div>
        <Card
          elevation={1}
          style={{
            margin: 5,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
        >
          <Panel
            index={1}
            renderLabelFun={this.renderListPanelLabel}
            renderDetailsFun={this.renderFilteredLists}
            initialStateOpen={false}
          />
           <Panel
            index={2}
            renderLabelFun={this.renderTagPanelLabel}
            renderDetailsFun={this.renderFilteredTags}
            initialStateOpen={false}
          />
           <Panel
            index={3}
            renderLabelFun={this.renderEntryPanelLabel}
            renderDetailsFun={this.renderFilteredEntries}
            initialStateOpen={false}
          />
          {/* <MpgPanel
            index={1}
            renderLabelFun={this.renderListsPanelLabel}
            renderDetailFun={this.renderMatchedLists}
            initialStateOpen={false}
          />
          <MpgPanel
            index={2}
            renderLabelFun={this.renderTagsPanelLabel}
            renderDetailFun={this.renderMatchedTags}
            initialStateOpen={false}
          />
          <MpgPanel
            index={3}
            renderLabelFun={this.renderEntriesPanelLabel}
            renderDetailFun={this.renderMatchedEntries}
            initialStateOpen={false}
          /> */}
        </Card>
      </div>
    );
  };

  static getDerivedStateFromProps = (
    props: SearchViewProps,
    state: SearchViewState
  ) => {
    state = {
      ...state,
      currentGraph: props.currentGraph,
      graphSize: props.currentGraph.nodes.size,
    };
    return state;
  };

  private renderFilteredLists = () => {
    const filteredNodes = this.state.currentGraph.getFilteredNodes(
      this.state.searchText,GraphNodeType.List
    );
    return (
      <div>
        {filteredNodes.size > 0 ? (
          <div>
            <Card
              style={{
                backgroundColor: GraphTheme.palette.primary.light,
                margin: 5,
              }}
            >
              <NodeListComponent
                nodes={filteredNodes}
                graphApp={this.props.graphApp}
                graphExplorer={this.props.graphExplorer}
              />
            </Card>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  private renderFilteredTags = () => {
    const filteredNodes = this.state.currentGraph.getFilteredNodes(
      this.state.searchText,GraphNodeType.Tag
    );
    return (
      <div>
        {filteredNodes.size > 0 ? (
          <div>
            <Card
              style={{
                backgroundColor: GraphTheme.palette.primary.light,
                margin: 5,
              }}
            >
              <NodeListComponent
                nodes={filteredNodes}
                graphApp={this.props.graphApp}
                graphExplorer={this.props.graphExplorer}
              />
            </Card>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  private renderFilteredEntries = () => {
    const filteredNodes = this.state.currentGraph.getFilteredNodes(
      this.state.searchText,GraphNodeType.Entry
    );
    return (
      <div>
        {filteredNodes.size > 0 ? (
          <div>
            <Card
              style={{
                backgroundColor: GraphTheme.palette.primary.light,
                margin: 5,
              }}
            >
              <NodeListComponent
                nodes={filteredNodes}
                graphApp={this.props.graphApp}
                graphExplorer={this.props.graphExplorer}
              />
            </Card>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  renderListPanelLabel = () => {
    const filteredNodes = this.state.currentGraph.getFilteredNodes(
      this.state.searchText, GraphNodeType.List
    );
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: GraphTheme.palette.primary.dark,
          }}
        >
          {"List: (" + filteredNodes.size + ")"}
        </Typography>
      </div>
    );
  };

  renderTagPanelLabel = () => {
    const filteredNodes = this.state.currentGraph.getFilteredNodes(
      this.state.searchText, GraphNodeType.Tag
    );
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: GraphTheme.palette.primary.dark,
          }}
        >
          {"Tags: (" + filteredNodes.size + ")"}
        </Typography>
      </div>
    );
  };

  renderEntryPanelLabel = () => {
    const filteredNodes = this.state.currentGraph.getFilteredNodes(
      this.state.searchText, GraphNodeType.Entry
    );
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: GraphTheme.palette.primary.dark,
          }}
        >
          {"Entries: (" + filteredNodes.size + ")"}
        </Typography>
      </div>
    );
  };

  handleSearchTextChange = async (event: React.ChangeEvent) => {
    const searchText = (event.target as HTMLInputElement).value;
    this.setState({
      searchText: searchText,
    });
  };

  renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          margin: 5,
        }}
      >
        {this.renderLeftIcon()}
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.contrastText,
            }}
          >
            Search graph ({this.state.graphSize} nodes)
          </Typography>
        </div>
        {this.renderRightIcon()}
      </div>
    );
  };

  renderLeftIcon = () => {
    let saveIconColor = this.state.itemDataChanged
      ? GraphTheme.palette.secondary.light
      : GraphTheme.palette.primary.contrastText;
    return (
      <div>
        {!this.state.dataSavingInProgress ? (
          <Tooltip title={"Close"}>
            <Icon
              //   onClick={() => this.handleClose()}
              style={{ fontSize: "18px", color: saveIconColor }}
            >
              close
            </Icon>
          </Tooltip>
        ) : (
          <CircularProgress color="secondary" size={25} value={50} />
        )}
      </div>
    );
  };

  renderRightIcon = () => {
    let saveIconColor = this.state.itemDataChanged
      ? GraphTheme.palette.secondary.light
      : GraphTheme.palette.primary.contrastText;
    return (
      <div>
        {!this.state.dataSavingInProgress ? (
          <Tooltip title={"Save"}>
            <Icon
              //   onClick={() => this.props.updateItem}
              style={{ fontSize: "18px", color: saveIconColor }}
            >
              save
            </Icon>
          </Tooltip>
        ) : (
          <CircularProgress color="secondary" size={25} value={50} />
        )}
      </div>
    );
  };

  renderButtons = () => {
    return (
      <div>
        <Button
          onClick={() => this.handleClose()}
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.contrastText,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
          size="small"
          // color="secondary"
          disabled={this.state.itemDataChanged}
        >
          Close
        </Button>
      </div>
    );
  };

  handleClose = () => {
    this.props.graphApp.closeView(this.props.viewableItem);
  };
}
