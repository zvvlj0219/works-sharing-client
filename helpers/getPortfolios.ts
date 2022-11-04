import fetch from 'node-fetch'
import { baseUrl } from '../config'
import type { Portfolio } from '../types'

/*
 * ポートフォリオをデータベースから取得
 */
export const getPortfolios = async () => {
    const res = await fetch(`${baseUrl}/home`)
    const { portfolios } = (await res.json()) as { portfolios: Portfolio[] }
    return portfolios
}
