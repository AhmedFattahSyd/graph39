import React, { useState } from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Panel from "./Panel";
import Theme from "../GraphTheme";
import {
  Button,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import GraphTheme from "../GraphTheme";
import NodeListComponent from "./NodeListComponent";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  parentPanel: boolean;
  refreshNode: Function;
}

const ParentChildPanel: React.FC<IProps> = (props: IProps) => {
  const [entrySearchText, setEntrySearchText] = useState("");
  const [entryListVisible, setEntryListVisible] = useState(false);
  const [matchedEntries, setMatchedParentsChildren] = useState(
    new Map<string, GraphNode>()
  );

  const ADD_NEW_ENTRY_ID = "ADD_NEW_ENTRY_ID";

  const renderLabel = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          {props.parentPanel
            ? "Parents (" + props.currentNode.parents.size + ")"
            : "Children (" + props.currentNode.children.size + ")"}
        </Typography>
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <ThemeProvider theme={GraphTheme}>
        <Card
          elevation={1}
          style={{
            margin: 5,
            backgroundColor: Theme.palette.primary.main,
          }}
        >
          <Card
            elevation={1}
            style={{ textAlign: "left", margin: 0, padding: 0 }}
          >
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
                value={entrySearchText}
                margin="normal"
                style={{
                  marginLeft: 10,
                  marginRight: 5,
                  width: "95%",
                  fontSize: 10,
                  marginTop: 0,
                  marginBottom: 5,
                }}
                onChange={handleEntriesSearchTextChange}
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
                  onClick={handleSearch}
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
                    handleAddNewParentChild(event, ADD_NEW_ENTRY_ID)
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
            {renderMatchedEntriesList()}
            {renderExistingParentsChildren()}
          </Card>
        </Card>
      </ThemeProvider>
    );
  };

  const renderExistingParentsChildren = () => {
    const existingParentsOrChildren = props.parentPanel
      ? props.currentNode.parents
      : props.currentNode.children;
    // console.log("ParentChildPanel: renderExisting... node:",props.currentNode)
    return (
      <div
        style={{
          backgroundColor: Theme.palette.primary.light,
          margin: 2,
          padding: 2,
        }}
      >
        <NodeListComponent
          graphApp={props.graphApp}
          graphExplorer={props.graphExplorer}
          nodes={existingParentsOrChildren}
          removeFromList={handleRemoveParentChild}
        />
      </div>
    );
  };

  const handleRemoveParentChild = (nodeToBeRemoved: GraphNode) => {
    props.parentPanel
      ? props.graphExplorer.removeParentFromNode(
          props.currentNode,
          nodeToBeRemoved
        )
      : props.graphExplorer.removeParentFromNode(
          nodeToBeRemoved,
          props.currentNode
        );
    props.refreshNode();
  };

  const renderMatchedEntriesList = () => {
    return (
      <div>
        {entryListVisible ? (
          <List>
            {Array.from(matchedEntries.values()).map((parent) => (
              <ListItem
                key={parent.id}
                button
                onClick={(event) => handleAddNewParentChild(event, parent.id)}
              >
                <ListItemText primary={parent.name} style={{ fontSize: 12 }} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key={ADD_NEW_ENTRY_ID}
              button
              onClick={(event) =>
                handleAddNewParentChild(event, ADD_NEW_ENTRY_ID)
              }
            >
              <ListItemText
                primary={
                  props.parentPanel
                    ? "Add new parent: " + entrySearchText
                    : "Add new child: " + entrySearchText
                }
              />
            </ListItem>
          </List>
        ) : (
          <div />
        )}
      </div>
    );
  };

  const handleAddNewParentChild = async (event: any, id: string) => {
    try {
      if (id === ADD_NEW_ENTRY_ID) {
        await props.graphExplorer.createNewParentOrChild(
          props.currentNode,
          entrySearchText,
          props.parentPanel
        );
      } else {
        const newParentOrChild = props.graphExplorer.mainGraph.getNodeById(id);
        if (newParentOrChild !== undefined) {
          props.parentPanel
            ? await props.graphExplorer.addParentToNode(
                props.currentNode,
                newParentOrChild
              )
            : await props.graphExplorer.addChildToNode(
                newParentOrChild,
                props.currentNode
              );
          // await props.graphExplorer.addParentOrChildToNode(
          //   props.currentNode,
          //   parent,
          //   props.parentPanel
          // );
        } else {
          throw new Error(`ParentChildPanel: cannot find entry with id:${id}`);
        }
      }
      setEntrySearchText("");
      setEntryListVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const handleEntriesSearchTextChange = async (event: React.ChangeEvent) => {
    const text = (event.target as HTMLInputElement).value;
    setEntrySearchText(text);
  };

  const handleSearch = async () => {
    if (entrySearchText.length > 0) {
      setEntryListVisible(true);
      setMatchedParentsChildren(
        props.graphExplorer.mainGraph.getFilteredNodesExactNoStarred(
          entrySearchText,
          props.currentNode.tagFlag,
          props.currentNode.contextFlag,
          props.currentNode
        )
      );
    } else {
      setEntryListVisible(false);
    }
  };

  return (
    <div>
      <Panel
        index={0}
        renderLabelFun={renderLabel}
        renderDetailsFun={renderDetails}
        initialStateOpen={false}
        showLabel={true}
      />
    </div>
  );
};

export default ParentChildPanel;
