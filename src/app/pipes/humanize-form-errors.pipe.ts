import { Pipe, PipeTransform } from '@angular/core';

enum InformationError {
  AUTOCOMPLETE = 'You must choose from the list provided',
  EMAIL = 'This is not a valid email',
  REQUIRED = 'This field cannot be empty',
}


@Pipe({ name: 'humanizeFormErrors' })
export class HumanizeFormErrorsPipe implements PipeTransform {
  transform(errors): Array<string> {
    const messages = [];
    for (let error in errors) {
      if (errors.hasOwnProperty(error)) {
        // It's message type Required from backend
        if (errors[error] === 'This field may not be blank.') {
          error = 'required';
        }
        switch (error) {
          case 'email':
            messages.push(InformationError.EMAIL);
            break;
          case 'required':
            messages.push(InformationError.REQUIRED);
            break;
          case 'autoCompleteValidator':
            messages.push(InformationError.AUTOCOMPLETE);
            break;
          case 'custom':
            messages.push(errors[error]);
            break;
        }
      }
    }
    return messages.length > 0 ? messages : undefined;
  }
}
