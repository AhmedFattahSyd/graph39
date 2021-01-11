import { Card, Typography } from "@material-ui/core";
import React from "react";
import GraphNode from "../Core/GraphNode";
import GraphApp from "../GraphApp";
import GraphExplorer from "../GraphExplorer/GraphExplorer";
import Theme from "../GraphTheme";
import Panel from "./Panel";

interface IProps {
  currentNode: GraphNode;
  graphApp: GraphApp;
  graphExplorer: GraphExplorer;
}

const DatesPanel: React.FC<IProps> = (props: IProps) => {
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
          Dates
        </Typography>
      </div>
    );
  };

  const renderDetails = () => {
    const createdAtDate = props.currentNode.createdAt
      .toString()
      .split("GMT")[0];
    const updatedAtDate = props.currentNode.updatedAt
      .toString()
      .split("GMT")[0];
    const ageFromCreation = getAgeFormatted(props.currentNode.createdAt);
    const ageFromLastUpdated = getAgeFormatted(props.currentNode.updatedAt);
    return (
      <Card
        elevation={1}
        style={{
          margin: 5,
          backgroundColor: Theme.palette.primary.contrastText,
          padding:5,
        }}
      >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              alignContent: "flex-start",
              justifyContent: "flex-start",
              justifyItems: "flex-start",
            }}
          >
            <Typography
              variant="body1"
              style={{
                fontSize: "12px",
                color: Theme.palette.primary.dark,
              }}
            >
              {"Created: " + createdAtDate + " (" + ageFromCreation + ")"}
            </Typography>
            <Typography
              variant="body1"
              style={{
                fontSize: "12px",
                color: Theme.palette.primary.dark,
              }}
            >
              {"Upadted: " + updatedAtDate + " (" + ageFromLastUpdated + ")"}
            </Typography>
          </div>
      </Card>
    );
  };

  const getAgeFormatted = (date: Date): string => {
    var now = new Date();
    // var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var yearNow = now.getFullYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    let creationDate = date;

    var yearDob = creationDate.getFullYear();
    var monthDob = creationDate.getMonth();
    var dateDob = creationDate.getDate();

    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";

    let yearAge = yearNow - yearDob;

    if (monthNow >= monthDob) var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob) var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    const age = {
      years: yearAge,
      months: monthAge,
      days: dateAge,
    };

    if (age.years > 1) yearString = " years";
    else yearString = " year";
    if (age.months > 1) monthString = " months";
    else monthString = " month";
    if (age.days > 1) dayString = " days";
    else dayString = " day";

    if (age.years > 0 && age.months > 0 && age.days > 0)
      ageString =
        age.years +
        yearString +
        ", " +
        age.months +
        monthString +
        ", and " +
        age.days +
        dayString +
        " old.";
    else if (age.years === 0 && age.months === 0 && age.days >= 0)
      ageString = "" + age.days + dayString + "";
    else if (age.years > 0 && age.months === 0 && age.days === 0)
      ageString = age.years + yearString + "";
    else if (age.years > 0 && age.months > 0 && age.days === 0)
      ageString = age.years + yearString + ", " + age.months + monthString + "";
    else if (age.years === 0 && age.months > 0 && age.days > 0)
      ageString = age.months + monthString + ", " + age.days + dayString + "";
    else if (age.years > 0 && age.months === 0 && age.days > 0)
      ageString = age.years + yearString + ", " + age.days + dayString + "";
    else if (age.years === 0 && age.months > 0 && age.days === 0)
      ageString = age.months + monthString + "";
    else ageString = "";

    return ageString;
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

export default DatesPanel;
