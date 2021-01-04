import {
  Typography,
  Card,
  TextField,
  List,
  Divider,
  ListItem,
  ListItemText,
  Button,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";
import GraphNode, { GraphNodeState } from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Theme from "../GraphTheme";
import NodeListComponent from "./NodeListComponent";
import Panel from "./Panel";

interface EntriesWithTagsPanelProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
}

interface EntriesWithTagsPanelState {
  entriesWithTags: Map<string, GraphNode>;
  entrySearchText: string;
  entryListVisible: boolean;
  matchedEntries: GraphNode[];
  selectedState: GraphNodeState;
}

export default class EntriesWithTagsPanel extends React.Component<
  EntriesWithTagsPanelProps,
  EntriesWithTagsPanelState
> {
  readonly ADD_NEW_ENTRY_ID = "ADD_NEW_ENTRY_ID";
  constructor(props: EntriesWithTagsPanelProps) {
    super(props);
    const entriesWithTags = this.props.graphExplorer.mainGraph.getEntriesWithTags(
      this.props.currentNode.tags,
      GraphNodeState.Active,
      this.props.currentNode,
    );
    this.state = {
      entriesWithTags: entriesWithTags,
      entrySearchText: "",
      entryListVisible: false,
      matchedEntries: [],
      selectedState: GraphNodeState.Active,
    };
  }

  // getEntriesFiltered = () => {
  //   return new Map(
  //     Array.from(
  //       this.props.graphExplorer.mainGraph
  //         .getEntriesWithTags(this.props.currentNode.tags)
  //         .values()
  //     )
  //       .filter((node) => {
  //         return node.id !== this.props.currentNode.id;
  //       })
  //       .map((node) => [node.id, node])
  //   );
  // };

  render = () => {
    return (
      <div>
        <Panel
          index={0}
          renderLabelFun={this.renderLabel}
          renderDetailsFun={this.renderDetails}
          initialStateOpen={false}
        />
      </div>
    );
  };

  renderLabel = () => {
    const entriesWithTags = this.props.graphExplorer.mainGraph.getEntriesWithTags(
      this.props.currentNode.tags,
      this.state.selectedState,
      this.props.currentNode,
    );
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {this.renderStateSelect()}
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
            marginLeft: 5,
          }}
        >
          {"Entries with same tags (" + entriesWithTags.size + ")"}
        </Typography>
      </div>
    );
  };

  renderStateSelect = () => {
    return (
      <div>
        <Select
          value={this.state.selectedState}
          onChange={(event) => this.handleStateSelectChange(event)}
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          <MenuItem value={GraphNodeState.Active}>Active</MenuItem>
          <MenuItem value={GraphNodeState.Parked}>Parked</MenuItem>
          <MenuItem value={GraphNodeState.Done}>Done</MenuItem>
        </Select>
      </div>
    );
  };

  handleStateSelectChange = (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => {
    const selection = event.target.value as GraphNodeState;
    const enteriesWithTags = this.props.graphExplorer.mainGraph.getEntriesWithTags(
      this.props.currentNode.tags,
      selection,
      this.props.currentNode,
    );
    this.setState({
      selectedState: selection,
      entriesWithTags: enteriesWithTags,
    });
  };

  renderDetails = () => {
    const entriesWithTags = this.props.graphExplorer.mainGraph.getEntriesWithTags(
      this.props.currentNode.tags,
      this.state.selectedState,
      this.props.currentNode,
    );
    return (
      <Card
        elevation={1}
        style={{
          margin: 5,
          backgroundColor: Theme.palette.primary.main,
        }}
      >
        <Card
          elevation={1}
          style={{ textAlign: "left", margin: 0, padding: 5 }}
        >
          {this.renderSearchTextFieldAndButtons()}
          {this.renderMatchedEntryList()}
          {entriesWithTags.size > 0 ? (
            this.renderExistingEntries()
          ) : (
            <div></div>
          )}
        </Card>
      </Card>
    );
  };

  handleAddNewEntry = async (event: any, entryId: string) => {
    // console.log("EntriesWithTagsPanel: handleAddNewEntry")
    // chcek if the tagId for a new tag
    if (entryId === this.ADD_NEW_ENTRY_ID) {
      // add a new entry
      await this.props.graphExplorer.createNewEntryAndTagIt(
        this.props.currentNode,
        this.state.entrySearchText
      );
    } else {
      // id is for an existing entry
      await this.props.graphExplorer.tagNodeWithAnotherNodeTags(
        entryId,
        this.props.currentNode
      );
    }
    this.setState({
      entrySearchText: "",
      entryListVisible: false,
      entriesWithTags: this.props.graphExplorer.mainGraph.getEntriesWithTags(
        this.props.currentNode.tags,
        this.state.selectedState,
        this.props.currentNode,
      ),
    });
  };

  handleSearch = (event: any) => {
    if (this.state.entrySearchText.length > 2) {
      this.setState({
        entryListVisible: true,
      });
      this.setMatchedEntries();
    }
  };

  renderMatchedEntryList = () => {
    return (
      <div>
        {this.state.entryListVisible ? (
          <List>
            {this.state.matchedEntries.map((entry) => (
              <ListItem
                key={entry.id}
                button
                onClick={(event) => this.handleAddNewEntry(event, entry.id)}
              >
                <ListItemText primary={entry.name} style={{ fontSize: 12 }} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key={this.ADD_NEW_ENTRY_ID}
              button
              onClick={(event) =>
                this.handleAddNewEntry(event, this.ADD_NEW_ENTRY_ID)
              }
            >
              <ListItemText
                primary={"Add new entry: " + this.state.entrySearchText}
              />
            </ListItem>
          </List>
        ) : (
          <div />
        )}
      </div>
    );
  };

  renderExistingEntries = () => {
    const entriesWithTags = this.props.graphExplorer.mainGraph.getEntriesWithTags(
      this.props.currentNode.tags,
      this.state.selectedState,
      this.props.currentNode,
    );
    return (
      <div
        style={{
          backgroundColor: Theme.palette.primary.light,
          margin: 5,
          padding: 5,
        }}
      >
        <NodeListComponent
          graphApp={this.props.graphApp}
          graphExplorer={this.props.graphExplorer}
          nodes={entriesWithTags}
        />
      </div>
    );
  };

  renderSearchTextFieldAndButtons = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          margin: 0,
        }}
      >
        <TextField
          id="tag"
          label="Add or search for entries"
          value={this.state.entrySearchText}
          margin="normal"
          style={{
            marginLeft: 10,
            marginRight: 5,
            width: "95%",
            fontSize: 10,
            marginTop: 0,
            marginBottom: 5,
          }}
          onChange={this.handleEntrySearchTextChange}
          autoComplete="off"
        />
        <div
          style={{
            display: "flex",
            margin: 5,
            flexDirection: "column",
            alignContent: "flex-end",
          }}
        >
          <Button
            onClick={(event) => this.handleSearch(event)}
            style={{
              margin: 2,
              color: Theme.palette.primary.contrastText,
              backgroundColor: Theme.palette.primary.main,
              height: 20,
              width: 20,
              fontSize: 8,
            }}
            size="small"
            // color="secondary"
          >
            Search
          </Button>
          <Button
            onClick={(event) =>
              this.handleAddNewEntry(event, this.ADD_NEW_ENTRY_ID)
            }
            style={{
              margin: 2,
              color: Theme.palette.primary.contrastText,
              backgroundColor: Theme.palette.primary.main,
              height: 20,
              width: 20,
              fontSize: 8,
            }}
            size="small"
            // color="secondary"
          >
            Add
          </Button>
        </div>
      </div>
    );
  };

  handleEntrySearchTextChange = async (event: React.ChangeEvent) => {
    const entrySearchText = (event.target as HTMLInputElement).value;
    if (entrySearchText.length > 2) {
      await this.setState({
        entrySearchText: entrySearchText,
        entryListVisible: true,
      });
      // we will do search explicit when search button is pressed
      // await this.setMatchedEntries();
    } else {
      await this.setState({
        entrySearchText: entrySearchText,
        entryListVisible: false,
      });
    }
  };

  setMatchedEntries = () => {
    this.setState({
      matchedEntries: Array.from(
        this.props.graphExplorer.mainGraph
          .getFilteredNodesFuzzy(this.state.entrySearchText)
          .values()
      ).filter((node) => {
        return (
          node.id !== this.props.currentNode.id &&
          !this.state.entriesWithTags.has(node.id)
        );
      }),
    });
  };

  static getDerivedStateFromProps = (
    props: EntriesWithTagsPanelProps,
    state: EntriesWithTagsPanelState
  ) => {
    state = {
      ...state,
    };
    return state;
  };
}
