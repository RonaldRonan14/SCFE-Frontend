export interface Paginacao<T> {
    paginaatual: number,
    totalpaginas: number,
    tamanhopagina: number,
    totalitens: number,
    items: T[],
    hasProximaPagina: boolean;
    hasPaginaAnterior: boolean;
}