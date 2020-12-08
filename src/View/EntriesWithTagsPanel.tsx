import {
  Typography,
  Card,
  TextField,
  List,
  Divider,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import GraphNode from "../Core/GraphNode";
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
}

export default class EntriesWithTagsPanel extends React.Component<
  EntriesWithTagsPanelProps,
  EntriesWithTagsPanelState
> {
  readonly ADD_NEW_ENTRY_ID = "ADD_NEW_ENTRY_ID";
  constructor(props: EntriesWithTagsPanelProps) {
    super(props);
    const entriesWithTags = this.getEntriesFiltered();
    this.state = {
      entriesWithTags: entriesWithTags,
      entrySearchText: "",
      entryListVisible: false,
      matchedEntries: [],
    };
  }

  getEntriesFiltered = () => {
    return new Map(
      Array.from(
        this.props.graphExplorer.mainGraph
          .getEntriesWithTags(this.props.currentNode.tags)
          .values()
      )
        .filter((node) => {
          return node.id !== this.props.currentNode.id;
        })
        .map((node) => [node.id, node])
    );
  };

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
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          {"Entries with same tags (" + this.state.entriesWithTags.size + ")"}
        </Typography>
      </div>
    );
  };

  renderDetails = () => {
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
          {this.renderSearchTextField()}
          {this.renderMatchedEntryList()}
          {this.renderExistingEntries()}
        </Card>
      </Card>
    );
  };

  renderMatchedEntryList = () => {
    return (
      <div>
        {this.state.entryListVisible ? (
          // eslint-disable-next-line react/jsx-no-undef
          <List>
            {this.state.matchedEntries.map((tag) => (
              <ListItem
                key={tag.id}
                button
                // onClick={(event) => this.handleAddNewTag(event, tag.id)}
              >
                <ListItemText primary={tag.name} style={{ fontSize: 12 }} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key={this.ADD_NEW_ENTRY_ID}
              button
              // onClick={(event) =>
              //   this.handleAddNewTag(event, this.ADD_NEW_TAG_ID)
              // }
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
          nodes={this.state.entriesWithTags}
        />
      </div>
    );
  };

  renderSearchTextField = () => {
    return (
      <TextField
        id="tag"
        label="Add or search for tags"
        value={this.state.entrySearchText}
        margin="normal"
        style={{ marginLeft: 10, width: "50%", fontSize: 12 }}
        onChange={this.handleTagSearchTextChange}
        autoComplete="off"
      />
    );
  };

  handleTagSearchTextChange = async (event: React.ChangeEvent) => {
    const entrySearchText = (event.target as HTMLInputElement).value;
    if (entrySearchText.length > 2) {
      await this.setState({
        entrySearchText: entrySearchText,
        entryListVisible: true,
      });
      await this.setMatchedEntries();
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
          .getFilteredEntries(this.state.entrySearchText)
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
