import { validate } from "./utils.js";
import { Autobind } from "./decorators.js";

abstract class Project {
  abstract templateElement: HTMLTemplateElement;
  abstract hostElement: HTMLElement;
  abstract element: HTMLElement;

  constructor() {}

  abstract attach(): void;
  abstract configure(): void;
}

class ProjetStore {
  private projects: any[] = [];
  private listeners: any[] = [];
  private static instance: ProjetStore;

  addProject(title: string, description: string, people: number) {
    const project = {
      id: Math.random.toString(),
      title: title,
      description: description,
      people: people,
    };

    this.projects.push(project);

    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }

  addListener(listener: Function) {
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

class ProjectList extends Project {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: "active" | "finished") {
    super();
    this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedElement = document.importNode(this.templateElement.content, true);
    this.element = importedElement.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.configure();
  }

  private renderProjects() {
    const listItem = document.getElementById(`${this.type}-projects`)! as HTMLUListElement;

    for (const prjItem of this.assignedProjects) {
      const item = document.createElement("li");
      item.textContent = prjItem.title;
      listItem.append(item);
    }
  }

  attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }

  configure() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }
}

class ProjectInput extends Project {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleCountInputElement: HTMLInputElement;

  constructor() {
    super();
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedElement = document.importNode(this.templateElement.content, true);
    this.element = importedElement.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleCountInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.attach();
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

  attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
