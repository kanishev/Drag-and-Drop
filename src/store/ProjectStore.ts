import { ProjectStatus } from "../enums.js";
import { Project } from "../Project/Project.js";
import { StoreBase } from "./StoreBase.js";

export class ProjetStore extends StoreBase {
  private projects: Project[] = [];
  private static instance: ProjetStore;

  addProject(title: string, description: string, people: number) {
    const project = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
    this.projects.push(project);
    this.runListeners();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjetStore();
    return this.instance;
  }

  private runListeners() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }

  changeProjectStatus(id: string, newStatus: ProjectStatus) {
    const project = this.projects.find((p) => p.id == id);
    if (project) {
      project.status = newStatus;
      this.runListeners();
    }
  }
}

export const projectState = ProjetStore.getInstance();
