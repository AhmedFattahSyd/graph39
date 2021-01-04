import React from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Panel from "./Panel";
import Theme from "../GraphTheme";
import { Card, Typography } from "@material-ui/core";
import NodeListComponent from "./NodeListComponent";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  nodeDataChanged: () => void;
}

const SimilarNodesPanel: React.FC<IProps> = (props: IProps) => {
  
  const renderLabel = () => {
    const similarNodes = props.graphExplorer.mainGraph.getFilteredNodesFuzzy(
      props.currentNode.name,
      props.currentNode,
    );
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          style={{
            fontWeight: "bold",
            color: Theme.palette.primary.dark,
          }}
        >
          {"Similar nodes :" + similarNodes.length}
        </Typography>
      </div>
    );
  };

  const renderDetails = () => {
    const similarNodes = new Map(
      props.graphExplorer.mainGraph
        .getFilteredNodesFuzzy(props.currentNode.name,props.currentNode)
        .map((node) => [node.id, node])
    );
    return (
      <Card
        style={{
          backgroundColor: Theme.palette.primary.light,
          margin: 5,
        }}
      >
        <NodeListComponent
          graphApp={props.graphApp}
          graphExplorer={props.graphExplorer}
          nodes={similarNodes}
          removeFromList={handelRemoveFromList}
        />
      </Card>
    );
  };

  const handelRemoveFromList = () => {};

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

export default SimilarNodesPanel;
