import { validate } from "./utils.js";
import { Autobind } from "./decorators.js";

enum ProjectStatus {
  Active = "active",
  Finished = "finished",
}

type Listener = (projects: Project[]) => void;

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

abstract class ProjectBase<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostId: string, insertAtStart: boolean, newElementId: string) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;

    const importedElement = document.importNode(this.templateElement.content, true);
    this.element = importedElement.firstElementChild as U;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean): void {
    this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
  }

  abstract configure(): void;
}

class ProjetStore {
  private projects: Project[] = [];
  private listeners: Listener[] = [];
  private static instance: ProjetStore;

  addProject(title: string, description: string, people: number) {
    const project = new Project(Math.random.toString(), title, description, people, ProjectStatus.Active);
    this.projects.push(project);

    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }

  addListener(listener: Listener) {
    this.listeners.push(listener);
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjetStore();
    return this.instance;
  }
}

let projectState = ProjetStore.getInstance();

class ProjectList extends ProjectBase<HTMLDivElement, HTMLElement> {
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

class ProjectInput extends ProjectBase<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleCountInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleCountInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const descrption = this.descriptionInputElement.value;
    const peopleCount = this.peopleCountInputElement.value;

    const titleConfig = {
      value: title,
      required: true,
      minLength: 5,
    };

    const descriptionConfig = {
      value: descrption,
      required: true,
      minLength: 10,
    };

    const peopleCountConfig = {
      value: peopleCount,
      required: true,
      min: 5,
      max: 10,
    };

    if (![titleConfig, descriptionConfig, peopleCountConfig].some((el) => validate(el))) {
      alert("Invalid inputs");
      return;
    } else {
      return [title, descrption, +peopleCount];
    }
  }

  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, peopleCount] = userInput;
      projectState.addProject(title, description, peopleCount);
      this.resetFormState();
    }
  }

  private resetFormState() {
    this.element.reset();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
}

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
