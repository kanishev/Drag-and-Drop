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
  element: HTMLFormElement;

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

    this.attach();
    this.configure();
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const descrption = this.descriptionInputElement.value;
    const peopleCount = this.peopleCountInputElement.value;

    if (title.trim().length === 0 || descrption.trim().length === 0 || peopleCount.trim().length === 0) {
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
      console.log(title, description, peopleCount);
      this.resetFormState();
    }
  }

  private resetFormState() {
    this.element.reset();
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
