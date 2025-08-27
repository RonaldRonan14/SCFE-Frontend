export interface Autenticacao {
    email: string,
    senha: string,
}

export interface Token {
    token: string,
    expiracao: Date,
}