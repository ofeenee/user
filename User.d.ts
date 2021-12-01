import {v4} from 'uuid';


namespace typeID {
  export interface Interface {
    validate(s: string): boolean;
    generate(): string;
    (this: any,s: string): typeID.Instance;
    new (this: any, s: string): typeID.Instance;
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
    (this: any, s: string): typeEmail.Instance;
    new (this: any, s: string): typeEmail.Instance;
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
    (this: any, s: string): typePhone.Instance;
    new (this: any, s: string): typePhone.Instance;
  }
  export interface Instance {
    set: (s: string) => string;
    get: () => string | null;
    sendVerificationCodeSMS: () => Promise<object>;
    sendVerificationCodeCall: () => Promise<object>;
    confirmVerificationCode: (s: string) => Promise<object>;
  };
}

namespace Auth {
  export interface Interface {
    ({id, email, phone}:{id:string, email:string, phone:string}): Auth.Instance;
  }
  export interface Instance {
    create: () => Promise<object>;
    get: (sid:string) => Promise<object>;
    list: () => Promise<Array[object]>;
    verify: (code:string) => Promise<object>;
    delete: () => Promise<object>;
    close: () => Promise<object>;
    authenticate: (code: string, details: null | object) => Promise<object>;
    listAttempts: () => Promise<Array[object]>;
  }
}