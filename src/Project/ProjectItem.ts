import { Project } from "./Project.js";
import { ProjectBase } from "./ProjectBase.js";

export class ProjectItem extends ProjectBase<HTMLUListElement, HTMLLIElement> {
  project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, true, project.id);
    this.project = project;

    this.renderProjects();
  }

  configure(): void {}

  renderProjects() {
    this.element.querySelector("h2")!.innerHTML = this.project.title;
    this.element.querySelector("p")!.innerHTML = this.project.people.toString();
    this.element.querySelector("h3")!.innerHTML = this.project.description;
  }
}
