export type SignInParams<
    P extends Record<string, unknown> = Profile,
    A extends Record<string, unknown> = Account
> = {
    user: User
    account: A
    profile?: P & Record<string, unknown>
    email?: {
        verificationRequest?: boolean;
    }
    credentials?: Record<string, CredentialInput>
}

export type JWTParams<
    P extends Record<string, unknown> = Profile,
    A extends Record<string, unknown> = Account
> = {
    token: JWT
    user?: User
    account?: A
    profile?: P & Record<string, unknown>
    isNewUser?: boolean
}

export type SessionParams = {
    session: Session
    user: User
    token: JWT
}

export type RedirectParams = {
    url: string
    baseUrl: string
}
