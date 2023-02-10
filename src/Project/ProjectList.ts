import { ProjectBase } from "./ProjectBase.js";
import { projectState } from "../store/ProjectStore.js";
import { Project } from "./Project.js";
import { ProjectItem } from "./ProjectItem.js";

export class ProjectList extends ProjectBase<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((project) => project.status == this.type);
      this.renderProjects();
    });

    this.configure();
  }

  private renderProjects() {
    const listItem = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
    listItem.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }

  configure() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }
}
