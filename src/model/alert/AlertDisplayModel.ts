import { AlertType } from "./AlertType";
import { ToastPosition } from "./ToastPosition";

export interface AlertDisplayModel {
  message: string;
  type: AlertType;
  duration?: number;
  position?: ToastPosition;
}
