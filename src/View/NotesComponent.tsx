// import React from "react";
import * as React from "react";
import "react-quill/dist/quill.snow.css";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
  parentPanel: boolean;
  nodeDataChanged: () => void;
}

const NotesComponent: React.FC<IProps> = (props: IProps) => {
  
  // const handleNotesChanged = async (value: string) => {
  //   setNotesChanged(true);
  //   setNotes(value);
  // };

  // const handleNotesOnBlur = () => {
  //   if (notesChanged) {
  //     props.currentNode.notes = notes;
  //     props.nodeDataChanged();
  //     setNotesChanged(false);
  //   }
  // };

  return (
    <div style={{ width: "100%" }}>
      {/* <ReactQuill value={notes} onChange={handleNotesChanged}     /> */}
    </div>
  );
};

export default NotesComponent;
