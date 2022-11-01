import { getBreakpoint } from "./getBreakPoint"

const resizeSmallIcon = (num1: number, num2: number, num3: number): number => {
    const bp = getBreakpoint()

    if (bp === 'xl' || "large") {
        return num1
    }
    if (bp === 'medium' || "small") {
        return num2
    }
    if (bp === 'xxs' || "xs") {
        return num3
    }

    return num2
}

export const useResizeIcon = () => {
    return {
        resizeSmallIcon
    }
}