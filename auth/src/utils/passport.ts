import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(undefined, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: 'http://ts-fileupload.io/auth/google/callback',
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(undefined, existingUser);
        }
        const user = await new User({
          googleId: profile.id,

          username: profile.displayName,
        }).save();
        done(null, user);
      } catch (err) {
        done(err instanceof Error ? err : 'An error occured', undefined);
      }
    }
  )
);
