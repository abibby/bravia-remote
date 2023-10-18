import { braviaAPIFactory } from './internal'

export interface GetSourceListOptions {
    scheme: 'extInput'
}

export interface Source {
    source: string
}

export const getSourceList = braviaAPIFactory<
    [options: GetSourceListOptions],
    Source[]
>('avContent', 'getSourceList', '1.0')

export interface SetPlayContentOptions {
    uri: string
}

export const setPlayContent = braviaAPIFactory<
    [options: SetPlayContentOptions],
    void
>('avContent', 'setPlayContent', '1.0')
