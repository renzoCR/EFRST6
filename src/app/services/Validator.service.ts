import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
const mensajesDeError: { [key: string]: string | Function } = {
  required: 'Este campo es requerido',
};
@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  public isValidField(form: FormGroup, field: string): boolean | null {
    const valid = form.controls[field].errors && form.controls[field].touched;
    return valid;
  }

  private getMessageError(errors: ValidationErrors): string {
    for (const key of Object.keys(errors)) {
      const errorMessage = mensajesDeError[key];
      if (errorMessage) {
        if (typeof errorMessage === 'function') {
          return errorMessage(errors);
        }
        return errorMessage;
      }
    }
    return '';
  }

  public getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};
    const errorMessage = this.getMessageError(errors);
    if (!(errorMessage.length > 0)) return null;
    return errorMessage;
  }
}
