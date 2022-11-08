import { useEffect, useState } from 'react'

interface Window {
    width: number | undefined
    height: number | undefined
}

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<Window>({
        width: undefined,
        height: undefined
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                })
            }

            window.addEventListener('resize', handleResize)

            handleResize()

            return () => window.removeEventListener('resize', handleResize)
        }
    }, [])

    return windowSize
}
