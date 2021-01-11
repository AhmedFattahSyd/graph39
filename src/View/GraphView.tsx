import {
  Typography,
  Tooltip,
  Icon,
  CircularProgress,
  Button,
  TextField,
  Card,
  MenuItem,
  Select,
  Checkbox,
} from "@material-ui/core";
import React from "react";
import Graph, { GRAPH_NO_CONTEXT_SET } from "../Core/Graph";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";
import NodeListComponent from "./NodeListComponent";
import Panel from "./Panel";
import SkeletonView from "./SkeletonView";
import ViewableItem from "./ViewableItem";
import Theme from "../GraphTheme";

// search view module

interface GraphViewProps {
  viewableItem: ViewableItem;
  currentGraph: Graph;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  filteredStarredNodes: Map<string, GraphNode>;
  filteredTags: Map<string, GraphNode>;
  filteredContexts: Map<string, GraphNode>;
  filteredEntries: Map<string, GraphNode>;
  filteredLists: Map<string, GraphNode>;
  setSearchText: (text: string) => void;
}
interface GraphViewState {
  currentGraph: Graph;
  itemDataChanged: boolean;
  dataSavingInProgress: boolean;
  searchText: string;
  graphSize: number;
  currentNodes: Map<string, GraphNode>;
  currentContextId: string;
  filterByContext: boolean;
  filteredStarredNodes: Map<string, GraphNode>;
  filteredTags: Map<string, GraphNode>;
  filteredContexts: Map<string, GraphNode>;
  filteredEntries: Map<string, GraphNode>;
  filteredLists: Map<string, GraphNode>;
}

export default class GraphView extends React.Component<
  GraphViewProps,
  GraphViewState
> {
  constructor(props: GraphViewProps) {
    super(props);
    this.state = {
      currentGraph: props.currentGraph,
      itemDataChanged: false,
      dataSavingInProgress: false,
      searchText: "",
      // filteredNodes: props.currentGraph.getFilteredNodes(""),
      graphSize: props.currentGraph.nodes.size,
      currentNodes: props.currentGraph.nodes,
      currentContextId: GRAPH_NO_CONTEXT_SET,
      filterByContext: false,
      filteredStarredNodes: props.filteredStarredNodes,
      filteredTags: props.filteredTags,
      filteredContexts: props.filteredContexts,
      filteredEntries: props.filteredEntries,
      filteredLists: props.filteredLists,
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
              style={{ width: "80%", fontSize: 12, marginTop: -5 }}
              onChange={this.handleSearchTextChange}
              // onKeyPress={this.handleKeyPressed}
              // onBlur={event=>this.setAllMatchedItems()}
            />
            <Tooltip title="Clear search text">
              <Icon
                onClick={(event) => this.handleClearSearchText()}
                style={{
                  fontSize: "14px",
                  color: GraphTheme.palette.primary.contrastText,
                  backgroundColor: GraphTheme.palette.primary.main,
                  margin: 3,
                }}
              >
                clear_outlined
              </Icon>
            </Tooltip>
            <Button
              onClick={() => this.handleSearchButtonClicked()}
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
          {/* {this.renderCurrentContext()} */}
          {this.renderPanels()}
        </div>
      </Card>
    );
  };

  handleSearchButtonClicked = async () => {
    await this.props.setSearchText(this.state.searchText);
  };

  handleClearSearchText = async () => {
    await this.setState({ searchText: "" });
    await this.handleSearchButtonClicked();
  };

  renderCurrentContext = () => {
    const contexts = this.state.currentGraph.getFilteredNodesExact(
      "",
      false,
      true,
      false
    );
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.dark,
              marginRight: 10,
            }}
          >
            Context:
          </Typography>
          <Select
            value={this.state.currentContextId}
            onChange={(event) => this.handleCurrentContextChange(event)}
            style={{
              fontWeight: "bold",
              color: Theme.palette.primary.dark,
            }}
          >
            <MenuItem key={GRAPH_NO_CONTEXT_SET} value={GRAPH_NO_CONTEXT_SET}>
              Not set
            </MenuItem>
            ;
            {Array.from(contexts.values()).map((context) => {
              return (
                <MenuItem key={context.id} value={context.id}>
                  {context.name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            color="primary"
            checked={this.state.filterByContext}
            onChange={(event) => this.handleFilterByContextChange(event)}
            size="small"
            // inputProps={{ "aria-label": "primary checkbox" }}
          />
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: Theme.palette.primary.dark,
            }}
          >
            Filter by context
          </Typography>
        </div>
      </div>
    );
  };

  handleFilterByContextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ filterByContext: event.target.checked });
  };

  handleCurrentContextChange = (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => {
    const currentContextId = event.target.value as string;
    this.props.graphExplorer.mainGraph.currentContextId = currentContextId;
    this.setState({ currentContextId: currentContextId });
  };

  // setFilteredNodes = () => {
  //   // this.setState({
  //   //   filteredNodes: this.state.currentGraph.getFilteredNodes(
  //   //     this.state.searchText
  //   //   ),
  //   // });
  // };

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
            renderLabelFun={this.renderStarredPanelLabel}
            renderDetailsFun={this.renderFilteredStarred}
            initialStateOpen={false}
          />
          <Panel
            index={4}
            renderLabelFun={this.renderListPanelLabel}
            renderDetailsFun={this.renderFilteredLists}
            initialStateOpen={false}
          />
          <Panel
            index={2}
            renderLabelFun={this.renderContextPanelLabel}
            renderDetailsFun={this.renderFilteredContexts}
            initialStateOpen={false}
          />
          <Panel
            index={3}
            renderLabelFun={this.renderTagPanelLabel}
            renderDetailsFun={this.renderFilteredTags}
            initialStateOpen={false}
          />
          <Panel
            index={4}
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
    props: GraphViewProps,
    state: GraphViewState
  ) => {
    state = {
      ...state,
      currentGraph: props.currentGraph,
      graphSize: props.currentGraph.nodes.size,
      filteredStarredNodes: props.filteredStarredNodes,
      filteredTags: props.filteredTags,
      filteredContexts: props.filteredContexts,
      filteredEntries: props.filteredEntries,
      filteredLists:props.filteredLists,
    };
    return state;
  };

  private renderFilteredTags = () => {
    const filteredNodes = this.state.currentGraph.getFilteredNodesExact(
      this.state.searchText,
      true,
      false,
      false
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

  private renderFilteredStarred = () => {
    // const filteredNodes = this.state.currentGraph.getFilteredNodesExact(
    //   this.state.searchText,
    //   false,
    //   false,
    //   true
    // );
    return (
      <div>
        {this.state.filteredStarredNodes.size > 0 ? (
          <div>
            <Card
              style={{
                backgroundColor: GraphTheme.palette.primary.light,
                margin: 5,
              }}
            >
              <NodeListComponent
                nodes={this.state.filteredStarredNodes}
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
    return (
      <div>
        {this.state.filteredEntries.size > 0 ? (
          <div>
            <Card
              style={{
                backgroundColor: GraphTheme.palette.primary.light,
                margin: 5,
              }}
            >
              <NodeListComponent
                nodes={this.state.filteredEntries}
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

  private renderFilteredLists = () => {
    return (
      <div>
        {this.state.filteredLists.size > 0 ? (
          <div>
            <Card
              style={{
                backgroundColor: GraphTheme.palette.primary.light,
                margin: 5,
              }}
            >
              <NodeListComponent
                nodes={this.state.filteredLists}
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

  private renderFilteredContexts = () => {
    // const filteredNodes = this.state.currentGraph.getFilteredNodesExact(
    //   this.state.searchText,
    //   false,
    //   true,
    //   false
    // );
    return (
      <div>
        {this.state.filteredContexts.size > 0 ? (
          <div>
            <Card
              style={{
                backgroundColor: GraphTheme.palette.primary.light,
                margin: 5,
              }}
            >
              <NodeListComponent
                nodes={this.state.filteredContexts}
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

  renderTagPanelLabel = () => {
    // const filteredNodes = this.state.currentGraph.getFilteredNodesExact(
    //   this.state.searchText,
    //   true,
    //   false,
    //   false
    // );
    return (
      <div style={{ width: "330px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "10px" }}></div>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.dark,
            }}
          >
            {"Tags: (" + this.state.filteredTags.size + ")"}
          </Typography>

          <Tooltip title="New tag">
            <Icon
              style={{
                color: GraphTheme.palette.primary.dark,
                fontSize: "18px",
                marginTop: "3px",
              }}
              onClick={this.props.graphApp.createNewTag}
            >
              add_circle_outline
            </Icon>
          </Tooltip>
        </div>
      </div>
    );
  };

  renderStarredPanelLabel = () => {
    return (
      <div style={{ width: "330px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "stretch",
          }}
        >
          <div style={{ width: "10px" }}></div>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.dark,
            }}
          >
            {"Starred: (" + this.state.filteredStarredNodes.size + ")"}
          </Typography>
          <Tooltip title="New starred node">
            <Icon
              style={{
                color: GraphTheme.palette.primary.dark,
                fontSize: "18px",
                marginTop: "3px",
              }}
              onClick={this.props.graphApp.createNewStarredNode}
            >
              add_circle_outline
            </Icon>
          </Tooltip>
        </div>
      </div>
    );
  };

  renderListPanelLabel = () => {
    return (
      <div style={{ width: "330px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "stretch",
          }}
        >
          <div style={{ width: "10px" }}></div>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.dark,
            }}
          >
            {"Lists: (" + this.state.filteredLists.size + ")"}
          </Typography>
          <Tooltip title="New starred node">
            <Icon
              style={{
                color: GraphTheme.palette.primary.dark,
                fontSize: "18px",
                marginTop: "3px",
              }}
              onClick={this.props.graphApp.createNewList}
            >
              add_circle_outline
            </Icon>
          </Tooltip>
        </div>
      </div>
    );
  };

  renderEntryPanelLabel = () => {
    // const filteredNodes = this.state.currentGraph.getFilteredNodesExact(
    //   this.state.searchText,
    //   false,
    //   false,
    //   false
    // );
    return (
      <div style={{ width: "330px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "10px" }}></div>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.dark,
            }}
          >
            {"Entries: (" + this.state.filteredEntries.size + ")"}
          </Typography>

          <Tooltip title="New entry">
            <Icon
              style={{
                color: GraphTheme.palette.primary.dark,
                fontSize: "18px",
                marginTop: "3px",
              }}
              onClick={this.props.graphApp.createNewEntry}
            >
              add_circle_outline
            </Icon>
          </Tooltip>
        </div>
      </div>
    );
  };

  renderContextPanelLabel = () => {
    // const filteredNodes = this.state.currentGraph.getFilteredNodesExact(
    //   this.state.searchText,
    //   false,
    //   true,
    //   false
    // );
    return (
      <div style={{ width: "330px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "stretch",
          }}
        >
          <div style={{ width: "10px" }}></div>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.dark,
            }}
          >
            {"Contexts: (" + this.state.filteredContexts.size + ")"}
          </Typography>
          <Tooltip title="New context">
            <Icon
              style={{
                color: GraphTheme.palette.primary.dark,
                fontSize: "18px",
                marginTop: "3px",
              }}
              onClick={this.props.graphApp.createNewContext}
            >
              add_circle_outline
            </Icon>
          </Tooltip>
        </div>
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
            Graph ({this.state.graphSize} items)
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
