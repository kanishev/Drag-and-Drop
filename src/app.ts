function Autobind(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const adjDescriptor: PropertyDescriptor = {
    get() {
      return descriptor.value.bind(this);
    },
  };

  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleCountInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedElement = document.importNode(this.templateElement.content, true);
    this.element = importedElement.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleCountInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.initNodes();
    this.attach();
    this.configure();
  }

  private initNodes() {}

  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
