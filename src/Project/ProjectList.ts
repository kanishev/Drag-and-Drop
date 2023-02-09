import { ProjectBase } from "./ProjectBase.js";
import { projectState } from "../store.js";

export class ProjectList extends ProjectBase<HTMLDivElement, HTMLElement> {
  assignedProjects: any[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects.filter((project) => project.status == this.type);
      this.renderProjects();
    });

    this.configure();
  }

  private renderProjects() {
    const listItem = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
    listItem.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      const item = document.createElement("li");
      item.textContent = prjItem.title;
      listItem.append(item);
    }
  }

  configure() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }
}
