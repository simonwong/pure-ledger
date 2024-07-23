import { DialogState } from "./types";

class Observer {
  subscribers: Array<(state: DialogState) => void>;

  constructor() {
    this.subscribers = [];
  }

  subscribe = (subscriber: (state: DialogState) => void) => {
    this.subscribers.push(subscriber);

    return () => {
      const index = this.subscribers.indexOf(subscriber);
      this.subscribers.splice(index, 1);
    };
  };

  publish = (data: DialogState) => {
    this.subscribers.forEach((subscriber) => subscriber(data));
  };

  addDialog = (data: DialogState) => {
    this.publish(data);
  };

  confirm = (data: DialogState) => {
    this.addDialog(data);
  };
}

export const ToastState = new Observer();

export const dialog = {
  confirm: ToastState.confirm,
};
