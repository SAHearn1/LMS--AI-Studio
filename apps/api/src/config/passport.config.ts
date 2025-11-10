import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { config } from '../config';
import { supabaseService } from '../utils/supabase.service';
import { JWTPayload, AuthProvider } from '../types/auth.types';

// JWT Strategy
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.accessTokenSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: JWTPayload, done) => {
    try {
      const user = await supabaseService.getUserById(payload.userId);

      if (!user) {
        return done(null, false);
      }

      if (!user.isActive) {
        return done(null, false, { message: 'User account is disabled' });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
if (config.oauth.google.clientId && config.oauth.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth.google.clientId,
        clientSecret: config.oauth.google.clientSecret,
        callbackURL: config.oauth.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), false);
          }

          const user = await supabaseService.findOrCreateOAuthUser(
            email,
            AuthProvider.GOOGLE,
            profile.id,
            profile.name?.givenName,
            profile.name?.familyName
          );

          return done(null, user);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );
}

// Microsoft OAuth Strategy
if (config.oauth.microsoft.clientId && config.oauth.microsoft.clientSecret) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: config.oauth.microsoft.clientId,
        clientSecret: config.oauth.microsoft.clientSecret,
        callbackURL: config.oauth.microsoft.callbackURL,
        tenant: config.oauth.microsoft.tenant,
        scope: ['user.read'],
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value || profile._json?.mail || profile._json?.userPrincipalName;
          if (!email) {
            return done(new Error('No email found in Microsoft profile'), false);
          }

          const user = await supabaseService.findOrCreateOAuthUser(
            email,
            AuthProvider.MICROSOFT,
            profile.id,
            profile.name?.givenName,
            profile.name?.familyName
          );

          return done(null, user);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );
}

export default passport;
