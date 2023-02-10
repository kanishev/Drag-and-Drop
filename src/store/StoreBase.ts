import { Project } from "../Project/Project.js";
import { Listener } from "../types.js";

export class StoreBase {
  protected listeners: Listener<Project>[] = [];

  addListener(listener: Listener<Project>) {
    this.listeners.push(listener);
  }
}
