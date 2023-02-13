import { Project } from "./Project.js";
import { ProjectBase } from "./ProjectBase.js";
import { Draggable } from "../interfaces.js";
import { Autobind } from "../decorators.js";

export class ProjectItem extends ProjectBase<HTMLUListElement, HTMLLIElement> implements Draggable {
  project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, true, project.id);
    this.project = project;

    this.configure();
    this.renderProjects();
  }

  get persons(): string {
    return this.project.people > 1 ? `${this.project.people} persons` : "1 person";
  }

  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @Autobind
  dragStopHandler(event: DragEvent) {
    console.log("drag stop", event);
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragStopHandler);
  }

  renderProjects() {
    this.element.querySelector("h2")!.innerHTML = this.project.title;
    this.element.querySelector("p")!.innerHTML = this.persons;
    this.element.querySelector("h3")!.innerHTML = this.project.description;
  }
}
