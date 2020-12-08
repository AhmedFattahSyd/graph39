import {
  Card,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import React from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import GraphTheme from "../GraphTheme";

interface TagComponentProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  tagsHaveChanged: ()=>void
}
interface TagComponentState {
  currentNode: GraphNode;
  tagSearchText: string;
  tagListVisible: boolean;
  matchedTags: Map<string, GraphNode>;
  existingTags: Map<string, GraphNode>;
  numberOfTags: number;
}

export default class TagComponent extends React.Component<
  TagComponentProps,
  TagComponentState
> {
  readonly ADD_NEW_TAG_ID = "ADD_NEW_TAG_ID";

  constructor(props: TagComponentProps) {
    super(props);
    this.state = {
      currentNode: props.currentNode,
      tagSearchText: "",
      tagListVisible: false,
      matchedTags: new Map(),
      existingTags: props.currentNode.tags,
      numberOfTags: props.currentNode.tags.size,
    };
  }

  render = () => {
    return (
      <ThemeProvider theme={GraphTheme}>
        <Card
          key={this.state.currentNode.id}
          elevation={1}
          style={{ textAlign: "left", margin: 5, padding: 0 }}
        >
          <TextField
            id="tag"
            label="Add or search for tags"
            value={this.state.tagSearchText}
            margin="normal"
            style={{ marginLeft: 10, width: "50%", fontSize: 12 }}
            onChange={this.handleTagSearchTextChange}
            autoComplete="off"
          />
          {this.renderMatchedTagList()}
          {this.renderExistingTags()}
        </Card>
      </ThemeProvider>
    );
  };

  handleTagSearchTextChange = async (event: React.ChangeEvent) => {
    const tagSearchText = (event.target as HTMLInputElement).value;
    if (tagSearchText.length > 2) {
      await this.setState({
        tagSearchText: tagSearchText,
        tagListVisible: true,
      });
      await this.setMatchedTags(tagSearchText);
    } else {
      await this.setState({
        tagSearchText: tagSearchText,
        tagListVisible: false,
      });
    }
  };

  setMatchedTags = (searchText: string) => {
    this.setState({
      matchedTags: this.props.graphExplorer.mainGraph.getFilteredTags(
        searchText,
      ),
    });
  };

  renderExistingTags = () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {Array.from(this.state.existingTags.values()).map((node) => (
          <Chip
            key={node.id}
            label={node.name}
            color="primary"
            onDelete={(event) => this.handleRemoveTag(event, node)}
            onClick={(event) => this.handleTagClicked(event, node)}
            variant="outlined"
            style={{
              margin: "5px",
              // color: MpgTheme.palette.primary.dark,
              // backgroundColor: MpgTheme.palette.primary.contrastText,
              fontWeight: "bold",
            }}
          />
        ))}
      </div>
    );
  };

  handleRemoveTag = async (event: any, tag: GraphNode) => {
    try {
      await this.props.graphExplorer.removeTagFromNode(
        this.state.currentNode,
        tag
      );
      const currentNode = this.state.currentNode;
      this.setState({
        currentNode: currentNode,
        existingTags: currentNode.tags,
        numberOfTags: currentNode.tags.size,
      });
      this.props.tagsHaveChanged()
    } catch (error) {
      throw error;
    }
  };

  handleTagClicked = (event: any, node: GraphNode) => {
    this.props.graphApp.openNode(node);
  };

  renderMatchedTagList = () => {
    return (
      <div>
        {this.state.tagListVisible ? (
          <List>
            {Array.from(this.state.matchedTags.values()).map((tag) => (
              <ListItem
                key={tag.id}
                button
                onClick={(event) => this.handleAddNewTag(event, tag.id)}
              >
                <ListItemText primary={tag.name} style={{ fontSize: 12 }} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key={this.ADD_NEW_TAG_ID}
              button
              onClick={(event) =>
                this.handleAddNewTag(event, this.ADD_NEW_TAG_ID)
              }
            >
              <ListItemText
                primary={"Add new tag: " + this.state.tagSearchText}
              />
            </ListItem>
          </List>
        ) : (
          <div />
        )}
      </div>
    );
  };

  handleAddNewTag = async (event: any, id: string) => {
    try {
      if (id === this.ADD_NEW_TAG_ID) {
        await this.props.graphExplorer.createNewTagAndAddToNode(
          this.state.currentNode,
          this.state.tagSearchText
        );
      } else {
        const tag = this.props.graphExplorer.mainGraph.getNodeById(id);
        if (tag !== undefined) {
          await this.props.graphExplorer.addTagToNode(
            this.state.currentNode,
            tag
          );
        } else {
          throw new Error(
            `TagComponent: handleAddNewTag: cannot find tag with id:${id}`
          );
        }
      }
      this.setState({
        tagSearchText: "",
        tagListVisible: false,
      });
      this.props.tagsHaveChanged()
    } catch (error) {
      throw error;
    }
  };

  static getDerivedStateFromProps = (
    props: TagComponentProps,
    state: TagComponentState
  ) => {
    state = {
      ...state,
      currentNode: props.currentNode,
      existingTags: props.currentNode.tags,
      numberOfTags: props.currentNode.tags.size,
    };
    return state;
  };
}
