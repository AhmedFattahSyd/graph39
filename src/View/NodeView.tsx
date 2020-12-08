import {
  Typography,
  CircularProgress,
  Icon,
  Tooltip,
  Button,
} from "@material-ui/core";
import React from "react";
import GraphApp from "../GraphApp";
import GraphNode from "../Core/GraphNode";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";
import NamePanel from "./NamePanel";
import SkeletonView from "./SkeletonView";
import ViewableItem from "./ViewableItem";
import TagPanel from "./TagPanel";
import EntriesWithTagsPanel from "./EntriesWithTagsPanel";
import EntriesTaggedComponent from "./EntriesTaggedComponent";

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
          }}
        >
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
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              color: GraphTheme.palette.primary.contrastText,
            }}
          >
            {this.state.currentNode.shortName}
          </Typography>
        </div>
        {this.renderRightIcon()}
      </div>
    );
  };

  renderBody = () => {
    return (
      <div>
        <NamePanel
          currentNode={this.state.currentNode}
          nodeDataChanged={this.nodeDataChanged}
        />
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
        <EntriesTaggedComponent
          currentNode={this.state.currentNode}
          graphApp={this.props.graphApp}
          graphExplorer={this.props.graphExplorer}
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
    console.log("handleDelete");
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
    this.props.graphApp.refreshOpenItems()
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
    console.log("handleClose");
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
