import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { findUserByGoogleId, createUserFromGoogle } from '../repositories/user.repository';
import { generateJWT } from '../services/user.service';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '/api/v1/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('[passport] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: false,
        },
        async (
            _accessToken: string,
            _refreshToken: string,
            profile: Profile,
            done: (err: any, user?: any, info?: any) => void
        ) => {
            try {
                const googleId = profile.id;
                const email = profile.emails && profile.emails[0]?.value;
                if (!email) return done(null, false, { message: 'No email from Google' });

                let user = await findUserByGoogleId(googleId);
                if (!user) {
                    user = await createUserFromGoogle({
                        name: profile.displayName || email.split('@')[0],
                        email,
                        avatar: profile.photos && profile.photos[0]?.value,
                        googleId,
                    });
                }

                const token = generateJWT((user as any).id);
                return done(null, { ...(user as any), jwt: token });
            } catch (err) {
                return done(err as any, undefined);
            }
        }
    )
);

export default passport;
