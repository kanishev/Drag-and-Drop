import { Listener } from "./types.js";
import { Project } from "./Project/Project.js";
import { ProjectStatus } from "./enums.js";

class StoreBase {
  protected listeners: Listener<Project>[] = [];

  addListener(listener: Listener<Project>) {
    this.listeners.push(listener);
  }
}

export class ProjetStore extends StoreBase {
  private projects: Project[] = [];
  private static instance: ProjetStore;

  addProject(title: string, description: string, people: number) {
    const project = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
    this.projects.push(project);

    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjetStore();
    return this.instance;
  }
}

export const projectState = ProjetStore.getInstance();
