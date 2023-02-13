import { ProjectBase } from "./ProjectBase.js";
import { projectState } from "../store/ProjectStore.js";
import { Project } from "./Project.js";
import { ProjectItem } from "./ProjectItem.js";
import { DroppableTarget } from "../interfaces.js";
import { Autobind } from "../decorators.js";

export class ProjectList extends ProjectBase<HTMLDivElement, HTMLElement> implements DroppableTarget {
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

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
      event.preventDefault();
      const listElement = this.element.querySelector("ul")!;
      listElement.classList.add("droppable");
    }
  }

  @Autobind
  dragLeaveHandler(event: DragEvent): void {
    const listElement = this.element.querySelector("ul")!;
    listElement.classList.remove("droppable");
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    console.log("Drop stop");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }
}
