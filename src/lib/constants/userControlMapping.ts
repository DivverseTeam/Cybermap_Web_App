import { CONTROL_STATUS_ENUM } from "./controls";

export interface IUserControlMapping {
  _id: string;
  controlId: string;
  userId: string;
  status: CONTROL_STATUS_ENUM;
}

const USER_CONTROL_MAPPING = [
  {
    _id: "671b6ca27266734d282a9909",
    controlId: "ISP", // change to controlId
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.NOT_IMPLEMENTED,
  },
];

export { USER_CONTROL_MAPPING };
