export enum TipoCategoria {
    Receita = 1,
    Despesa = 2,
}

export function getDescricaoTipo(tipo: number): string {
    return TipoCategoria[tipo];
}

export function getTiposCategoriaKeys(): (keyof typeof TipoCategoria)[] {
    return Object.keys(TipoCategoria).filter(key => isNaN(Number(key))) as (keyof typeof TipoCategoria)[];
}