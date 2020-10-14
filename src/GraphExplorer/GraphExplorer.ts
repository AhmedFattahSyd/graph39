// Explorer module
// provide all functions apart from UI
//

import FirebaseUser from "../Auth/FirebaseUser";
import GDriveStore from "./GraphStore/GDriveStore";

export default class GraphExplorer {
  private refershData: (userSignedOn: boolean, userName: string | null) => void;
  private user = new FirebaseUser();
  private store = new GDriveStore();

  constructor(
    refreshData: (userSignedOn: boolean, userName: string | null) => void
  ) {
    this.refershData = refreshData;
  }

  init = async () => {
    await this.user.init();
    if (this.user !== null) {
      await this.store.init(this.user);
    }
    await this.invokeRefreshData();
  };

  invokeRefreshData = async () => {
    //refreshData = async(userSignedOn: boolean, userName: string | null)
    await this.refershData(this.user.signedOn, this.user.name);
  };

  signOn = async () => {
    await this.user.signOn();
    await this.invokeRefreshData();
  };

  signOff = async () => {
    await this.user.signOff();
    await this.invokeRefreshData();
  };
}
