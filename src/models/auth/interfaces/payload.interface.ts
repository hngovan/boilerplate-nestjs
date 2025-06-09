export interface JwtPayload {
  email: string
  id: number // userID
  iat?: number // issued at (auto added by JWT)
  exp?: number // expiration (auto added by JWT)
}
