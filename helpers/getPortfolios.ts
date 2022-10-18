import fetch from 'node-fetch'
import { baseUrl } from '../config'
import type { Portfolio } from '../types'

export const getPortfolios = async () => {
    const res = await fetch(`${baseUrl}/home`)
    const { portfolios } = await res.json() as { portfolios: Portfolio[]}

    console.log(portfolios)

    return portfolios
}