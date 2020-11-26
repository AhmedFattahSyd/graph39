import { ThemeProvider, Card } from "@material-ui/core";
import React, { ReactNode } from "react";
import GraphApp from "../GraphApp";
import GraphTheme from "../GraphTheme";

// search view module

interface SkeletonViewProps {
  graphApp: GraphApp;
  // should change signature to match react render signature
  renderHeader: () => void;
  renderBody: () => void;
  renderButtons: () => ReactNode;
}
interface SkeletonViewState {}

export default class SkeletonView extends React.Component<
  SkeletonViewProps,
  SkeletonViewState
> {
  constructor(props: SkeletonViewProps) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <ThemeProvider theme={GraphTheme}>
        <div>
          <Card
            elevation={1}
            style={{
              maxWidth: this.props.graphApp.viewWidth,
              minWidth: this.props.graphApp.viewWidth,
              margin: this.props.graphApp.viewMargin,
              marginTop: 5,
              backgroundColor: GraphTheme.palette.primary.dark,
            }}
          >
            {this.props.renderHeader()}
            {this.props.renderBody()}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                margin: 5,
              }}
            >
              {this.props.renderButtons()}
            </div>
          </Card>
        </div>
      </ThemeProvider>
    );
  };
}
