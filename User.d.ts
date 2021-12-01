import {v4} from 'uuid';


namespace ID {
  export interface Id {
    validate(s: string): boolean;
    generate(): string;
    (s: string): IdInstance;
    new (this: IdInstance, s: string): IdInstance;
  }
}

export interface IdInstance {
  id: v4;
  set: (s:v4) => v4;
  get: () => v4;
}
