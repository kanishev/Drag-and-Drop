import { Project } from "./Project.js";
import { ProjectBase } from "./ProjectBase.js";

export class ProjectItem extends ProjectBase<HTMLUListElement, HTMLLIElement> {
  project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, true, project.id);
    this.project = project;

    this.renderProjects();
  }

  get persons(): string {
    return this.project.people > 1 ? `${this.project.people} persons` : "1 person";
  }

  configure(): void {}

  renderProjects() {
    this.element.querySelector("h2")!.innerHTML = this.project.title;
    this.element.querySelector("p")!.innerHTML = this.persons;
    this.element.querySelector("h3")!.innerHTML = this.project.description;
  }
}
