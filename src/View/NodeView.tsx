import {
  Typography,
  CircularProgress,
  Icon,
  Tooltip,
  Button,
} from "@material-ui/core";
import React from "react";
import GraphApp from "../GraphApp";
import GraphNode, { GraphNodePrivacy } from "../Core/GraphNode";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";
import KeyInfoPanel from "./KeyInfoPanel";
import SkeletonView from "./SkeletonView";
import ViewableItem from "./ViewableItem";
import TagPanel from "./TagPanel";
import EntriesWithTagsPanel from "./EntriesWithTagsPanel";
import TaggedEntriesComponent from "./TaggedEntriesComponent";
import StatePanel from "./StatePanel";
import ParentChildPanel from "./ParentChildPanel";
import PriorityPanel from "./PriorityPanel";
import SimilarNodesPanel from "./SimilarNodesPanel";
import DatesPanel from "./DatesPanel";
import PrivacyPanel from "./PrivacyPanel";

interface NodeViewProps {
  viewableItem: ViewableItem;
  currentNode: GraphNode;
  graphExplorer: GraphExplorer;
  graphApp: GraphApp;
}

interface NodeViewState {
  currentNode: GraphNode;
  itemDataChanged: boolean;
  dataSavingInProgress: boolean;
}

export default class NodeView extends React.Component<
  NodeViewProps,
  NodeViewState
> {
  constructor(props: NodeViewProps) {
    super(props);
    this.state = {
      currentNode: props.currentNode,
      itemDataChanged: false,
      dataSavingInProgress: false,
    };
  }

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
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.contrastText,
            }}
          >
            {this.getHeadlineMasked()}
          </Typography>
          <div style={{ width: "5px" }} />
          <Typography
            variant="button"
            style={{
              color: GraphTheme.palette.primary.contrastText,
              fontSize: "9px",
              fontWeight: "bold",
            }}
          >
            {this.state.currentNode.tagFlag ? "TAG" : ""}
          </Typography>
          <div style={{ width: "5px" }} />
          {this.state.currentNode.starred ? (
            <Icon
              style={{
                fontSize: "14px",
                color: GraphTheme.palette.primary.contrastText,
              }}
            >
              star
            </Icon>
          ) : (
            <div></div>
          )}
        </div>
        {this.renderRightIcon()}
      </div>
    );
  };

  getHeadlineMasked = (): string => {
    if (
      this.props.graphApp.privateMode &&
      this.state.currentNode.privacy === GraphNodePrivacy.Private
    ) {
      return "***********************";
    } else {
      return this.props.currentNode.shortName;
    }
  };

  renderBody = () => {
    return (
      <div>
        <KeyInfoPanel
          currentNode={this.state.currentNode}
          nodeDataChanged={this.nodeDataChanged}
          graphExplorer={this.props.graphExplorer}
          graphApp={this.props.graphApp}
        />
        {this.state.currentNode.tagFlag ? (
          <div>
            <TaggedEntriesComponent
              currentNode={this.state.currentNode}
              graphApp={this.props.graphApp}
              graphExplorer={this.props.graphExplorer}
            />
          </div>
        ) : (
          <div>
            {" "}
            <TagPanel
              currentNode={this.state.currentNode}
              nodeDataChanged={this.nodeDataChanged}
              graphApp={this.props.graphApp}
              graphExplorer={this.props.graphExplorer}
            />
            <EntriesWithTagsPanel
              currentNode={this.state.currentNode}
              graphApp={this.props.graphApp}
              graphExplorer={this.props.graphExplorer}
            />
          </div>
        )}
        {/* {this.state.currentNode.tagFlag ? (
          <TaggedEntriesComponent
            currentNode={this.state.currentNode}
            graphApp={this.props.graphApp}
            graphExplorer={this.props.graphExplorer}
          />
        ) : (
          <div></div>
        )} */}
        <StatePanel
          currentNode={this.state.currentNode}
          graphApp={this.props.graphApp}
          graphExplorer={this.props.graphExplorer}
          showLabel={true}
        />
        <ParentChildPanel
          currentNode={this.state.currentNode}
          graphApp={this.props.graphApp}
          graphExplorer={this.props.graphExplorer}
          parentPanel={true}
          refreshNode={this.refreshNode}
        />
        <ParentChildPanel
          currentNode={this.state.currentNode}
          graphApp={this.props.graphApp}
          graphExplorer={this.props.graphExplorer}
          parentPanel={false}
          refreshNode={this.refreshNode}
        />
        <PriorityPanel
          currentNode={this.state.currentNode}
          nodeDataChanged={this.nodeDataChanged}
          graphExplorer={this.props.graphExplorer}
          graphApp={this.props.graphApp}
        />
        <SimilarNodesPanel
          currentNode={this.state.currentNode}
          nodeDataChanged={this.nodeDataChanged}
          graphExplorer={this.props.graphExplorer}
          graphApp={this.props.graphApp}
        />
        <DatesPanel
          currentNode={this.state.currentNode}
          graphExplorer={this.props.graphExplorer}
          graphApp={this.props.graphApp}
        />
        <PrivacyPanel
          currentNode={this.state.currentNode}
          graphExplorer={this.props.graphExplorer}
          graphApp={this.props.graphApp}
        />
      </div>
    );
  };

  renderSaveAndClose = () => {
    return (
      <div>
        <Button
          // onClick={() => this.handleSave()}
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.contrastText,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
          size="small"
          // color="secondary"
        >
          Save
        </Button>
        <Button
          onClick={() => this.handleSaveAndClose()}
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.contrastText,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
          size="small"
          // color="secondary"
        >
          Save and close
        </Button>
        <Button
          variant="contained"
          onClick={() => this.handleDelete()}
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.contrastText,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
          size="small"
          // color="secondary"
        >
          Delete
        </Button>
      </div>
    );
  };

  handleDelete = async () => {
    await this.props.graphExplorer.deleteNode(this.state.currentNode);
    this.props.graphApp.closeView(this.props.viewableItem);
  };

  handleSaveAndClose = async () => {
    await this.updateCurrentNode();
    this.props.graphApp.closeView(this.props.viewableItem);
  };

  nodeDataChanged = async () => {
    const node = this.state.currentNode;
    // node.name = newName;
    await this.setState({ itemDataChanged: true, currentNode: node });
    await this.updateCurrentNode();
    await this.updateGraph();
    this.props.graphApp.refreshOpenItems();
  };

  static getDerivedStateFromProps = (
    props: NodeViewProps,
    state: NodeViewState
  ) => {
    state = {
      ...state,
      currentNode: props.currentNode,
    };
    return state;
  };

  updateCurrentNode = async () => {
    try {
      // this.props.graphApp.appendLog("Hello from NodeView")
      if (this.state.itemDataChanged) {
        const node = this.state.currentNode;
        await this.props.graphExplorer.updateNode(node);
        this.setState({
          currentNode: node,
          itemDataChanged: false,
        });
      } else {
        // do nothing. data has not changed
      }
    } catch (error) {
      throw error;
    }
  };

  refreshNode = () => {
    const node = this.state.currentNode;
    this.setState({
      currentNode: node,
    });
  };

  updateGraph = () => {};

  renderLeftIcon = () => {
    let saveIconColor = this.state.itemDataChanged
      ? GraphTheme.palette.secondary.light
      : GraphTheme.palette.primary.contrastText;
    return (
      <div>
        {!this.state.dataSavingInProgress ? (
          <Tooltip title={"Close"}>
            <Icon
              onClick={() => this.handleClose()}
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
                onClick={() => this.updateCurrentNode}
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

  renderButtons = () => {
    return this.renderClose();
    // return this.state.itemDataChanged
    //   ? this.renderSaveAndClose()
    // : this.renderClose();
  };

  handleClose = () => {
    // console.log("handleClose");
    if (!this.state.itemDataChanged) {
      this.props.graphApp.closeView(this.props.viewableItem);
    } else {
      // do nothing
      // cannot close item if it has changed
      // use delete or save it
      // better we should disable close
    }
  };

  renderClose = () => {
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
        <Button
          variant="contained"
          onClick={() => this.handleDelete()}
          style={{
            margin: 5,
            color: GraphTheme.palette.primary.contrastText,
            backgroundColor: GraphTheme.palette.primary.main,
          }}
          size="small"
          // color="secondary"
        >
          Delete
        </Button>
      </div>
    );
  };
}
