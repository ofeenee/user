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



namespace JWT {
  export interface Interface {
    (o:JWT.Options): JWT.Instance;
  }
  export interface Instance {
    sign: (payload: object) => Promise<string>;
    verify: (token: string) => Promise<object>;
  }
  export interface Options {
    issuer?: null | string,
    audience?: null | string,
    expiration?: null | string,
    encrypted?: boolean,
    subject?: null | string,
    path?: string;
  }
}

namespace User {
  export interface Interface {
    (o:User.credentials): User.Instance;
  }
  export interface credentials {
    id?: string;
    email: string;
    password?: string | undefined | null;
    phone: string;
    role?: string | undefined | null;
    created_at?: string | undefined | null;
    updated_at?: string | undefined | null;
  }
  export interface Instance {
    id: ID.Instance;
    email: Email.Instance;
    password?: string;
    phone: Phone.Instance;
    role?: string;
    created_at: string;
    updated_at: string;
    auth: Auth.Instance;
  }
}
