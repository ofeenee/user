import {v4} from 'uuid';


namespace ID {
  export interface Interface {
    validate(s: string): boolean;
    generate(): string;
    (this: any,s: string): Instance;
    new (this: any, s: string): Instance;
  }
  export interface Instance {
    id: v4;
    set: (s: v4) => v4;
    get: () => v4;
  }

}

declare namespace Email {
  export interface Interface {
    validate(s: string): boolean;
    (this: any, s: string): Instance;
    new (this: any, s: string): Instance;
  }
  export interface Instance {
    set: (s: string) => string;
    get: () => string;
    sendVerificationCode: () => Promise<object>;
    confirmVerificationCode: (s: string) => Promise<object>;
    };
  }
}
