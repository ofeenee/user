import {v4} from 'uuid';


namespace typeID {
  export interface Interface {
    validate(s: string): boolean;
    generate(): string;
    (this: any,s: string): Instance;
    new (this: any, s: string): Instance;
  }
  export interface Instance {
    id: v4;
    set: (s: v4) => v4 | null;
    get: () => v4;
  }
}

namespace typeEmail {
  export interface Interface {
    validate(s: string): boolean;
    (this: any, s: string): Instance;
    new (this: any, s: string): Instance;
  }
  export interface Instance {
    set: (s: string) => string;
    get: () => string | null;
    sendVerificationCode: () => Promise<object>;
    confirmVerificationCode: (s: string) => Promise<object>;
  };
}

namespace typePhone {
  export interface Interface {
    validate(s: string): boolean;
    (this: any, s: string): Instance;
    new (this: any, s: string): Instance;
  }
  export interface Instance {
    set: (s: string) => string;
    get: () => string | null;
    sendVerificationCodeSMS: () => Promise<object>;
    sendVerificationCodeCall: () => Promise<object>;
    confirmVerificationCode: (s: string) => Promise<object>;
  };
}