import { natsWraper } from '@adwesh/common';
import { Types } from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { COOKIE_MAX_AGE } from '../app';
import { AuthSuccessfulPublisher } from '../events/AuthSuccessfulPublisher';
import { User, UserDoc } from '../models/User';

type ResUser = UserDoc & { _id: Types.ObjectId };

passport.serializeUser((user: any, done) => {
  done(undefined, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: NativeError, user: UserDoc) => {
    done(err, user);
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
      let existingUser: ResUser | null;
      try {
        existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          //
          await new AuthSuccessfulPublisher(natsWraper.client).publish({
            userId: existingUser._id.toString(),
            ttl: COOKIE_MAX_AGE,
          });
          return done(undefined, existingUser);
        }
        const user = await new User({
          googleId: profile.id,
          username: profile.displayName,
        }).save();
        //
        await new AuthSuccessfulPublisher(natsWraper.client).publish({
          userId: user._id.toString(),
          ttl: COOKIE_MAX_AGE,
        });
        done(null, user);
      } catch (err) {
        done(err instanceof Error ? err : 'An error occured', undefined);
      }
    }
  )
);
