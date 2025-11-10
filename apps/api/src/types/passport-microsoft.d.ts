declare module 'passport-microsoft' {
  import { Strategy as OAuth2Strategy } from 'passport-oauth2';

  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      givenName?: string;
      familyName?: string;
    };
    emails?: Array<{ value: string }>;
    _json?: any;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    tenant?: string;
    scope?: string[];
  }

  export class Strategy extends OAuth2Strategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToken: any,
        refreshToken: any,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) => void
    );
  }
}
