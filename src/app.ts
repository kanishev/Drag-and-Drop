interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate({ value, required, minLength, maxLength, min, max }: Validatable): boolean {
  let isValid = true;

  if (required) {
    isValid = isValid && value.trim().length > 0;
  }

  if (minLength) {
    isValid = isValid && value.length >= minLength;
  }

  if (maxLength) {
    isValid = isValid && validate.length <= maxLength;
  }

  if (min != null) {
    isValid = isValid && +value >= min;
  }

  if (max != null) {
    isValid = isValid && +value <= max;
  }

  return isValid;
}

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

new ProjectInput();
