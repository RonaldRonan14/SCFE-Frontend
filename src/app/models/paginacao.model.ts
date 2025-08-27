export interface Paginacao<T> {
    paginaAtual: number,
    totalPaginas: number,
    tamanhoPagina: number,
    totalItens: number,
    items: T[],
    hasProximaPagina: boolean;
    hasPaginaAnterior: boolean;
}