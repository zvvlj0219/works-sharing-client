import { getBreakpoint } from './getBreakPoint'

const resizeSmallIcon = (num1: number, num2: number, num3: number): number => {
    const bp = getBreakpoint()

    switch (bp) {
        case 'xl' || 'large':
            return num3
            break
        case 'medium' || 'small':
            return num2
            break
        case 'xxs' || 'xs':
            return num1
            break
        default:
            return num2
            break
    }
}

export const useResizeIcon = () => {
    return {
        resizeSmallIcon
    }
}
