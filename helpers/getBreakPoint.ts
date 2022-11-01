import { useWindowSize } from "./useWindowSize";

type Breakpoint = "large" | "medium" | "small" | "xxs" | "xs" | "xl"

export const getBreakpoint = (): Breakpoint => {
    const { width } = useWindowSize()
  
    if(typeof width !== 'undefined') {
        switch (true) {
            case width < 300:
                return 'xxs'
            case width > 300 && width < 350:
                return 'xs'
            case width > 350 && width < 600:
                return 'small'
        
            case width > 600 && width < 900:
                return 'medium'
        
            case width > 900 && width < 1200:
                return 'large'
        
            case width > 1200:
                return 'xl'
        
            default: 'medium'
        }
    }
    return 'medium'
  }