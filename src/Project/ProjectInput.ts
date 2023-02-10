import { ProjectBase } from "./ProjectBase.js";
import { Autobind } from "../decorators.js";
import { validate } from "../utils.js";
import { projectState } from "../store/ProjectStore.js";

export class ProjectInput extends ProjectBase<HTMLDivElement, HTMLFormElement> {
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
