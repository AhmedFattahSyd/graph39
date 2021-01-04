import {
  Typography,
  Card,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import React, { useState } from "react";
import Panel from "./Panel";
import Theme from "../GraphTheme";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import NodeListComponent from "./NodeListComponent";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
}

const TaggedEntriesComponent: React.FC<IProps> = (props: IProps) => {
  const ADD_NEW_ENTRY_ID = "ADD_NEW_ENTRY_ID";
  // entriesWithTags: Map<string, GraphNode>;
  // entrySearchText: string;
  // entryListVisible: boolean;
  // matchedEntries: GraphNode[];
  //   const [currentNode, setCurrentState] = useState(props.currentNode);
  // const [taggedEntries, setTaggedEntriies] = useState(
  //   props.currentNode.taggedNodes
  // );
  const [entrySearchText, setEntrySearchText] = useState("");
  const [entryListVisible, setEntryListVisible] = useState(false);
  const [matchedEntries, setMatchedEntries] = useState(new Array<GraphNode>());

  // useEffect(() => {
  //   setTaggedEntriies(props.currentNode.taggedNodes);
  // }, [props.currentNode.taggedNodes]);

  const renderMatchedEntryList = () => {
    return (
      <div>
        {entryListVisible ? (
          <List>
            {matchedEntries.map((entry) => (
              <ListItem
                key={entry.id}
                button
                onClick={(event) => handleAddNewEntry(event, entry.id)}
              >
                <ListItemText primary={entry.name} style={{ fontSize: 12 }} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key={ADD_NEW_ENTRY_ID}
              button
              onClick={(event) => handleAddNewEntry(event, ADD_NEW_ENTRY_ID)}
            >
              <ListItemText primary={"Add new entry: " + entrySearchText} />
            </ListItem>
          </List>
        ) : (
          <div />
        )}
      </div>
    );
  };

  const handleAddNewEntry = async (event: any, entryId: string) => {
    if (entryId === ADD_NEW_ENTRY_ID) {
      await props.graphExplorer.createNewEntryAndTagItWithTag(
        props.currentNode,
        entrySearchText
      );
    } else {
      await props.graphExplorer.addTagToNodeWithId(entryId, props.currentNode);
    }
    setEntryListVisible(false);
    setEntrySearchText("");
  };

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
          {"Tagged entries (" + getTaggedNodes().size + ")"}
        </Typography>
      </div>
    );
  };

  const renderExistingEntries = () => {
    return (
      <div
        style={{
          backgroundColor: Theme.palette.primary.light,
          margin: 5,
          padding: 5,
        }}
      >
        <NodeListComponent
          graphApp={props.graphApp}
          graphExplorer={props.graphExplorer}
          nodes={getTaggedNodes()}
        />
      </div>
    );
  };

  const getTaggedNodes = (): Map<string, GraphNode> => {
    return props.graphExplorer.mainGraph.getTaggedNodes(props.currentNode);
  };

  const renderDetails = () => {
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
          {renderSearchEntries()}
          {renderMatchedEntryList()}
          {renderExistingEntries()}
        </Card>
      </Card>
    );
  };

  const renderSearchEntries = () => {
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
          onChange={(event) => handleEntrySearchTextChange(event)}
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
            onClick={(event) => handleAddNewEntry(event,ADD_NEW_ENTRY_ID)}
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

  const handleSearch = () => {
    if (entrySearchText.length > 3) {
      setEntryListVisible(true);
      const matchedEntries = props.graphExplorer.mainGraph
        .getFilteredNodesFuzzy(entrySearchText)
        .filter((node) => {
          return (
            node.id !== props.currentNode.id &&
            !props.currentNode.taggedNodes.has(node.id)
          );
        });
      setMatchedEntries(matchedEntries);
      setEntryListVisible(true);
    }
  };

  const handleEntrySearchTextChange = (event: React.ChangeEvent) => {
    setEntrySearchText((event.target as HTMLInputElement).value);
  };

  return (
    <div>
      <Panel
        index={0}
        renderLabelFun={renderLabel}
        renderDetailsFun={renderDetails}
        initialStateOpen={false}
      />
    </div>
  );
};
export default TaggedEntriesComponent;
