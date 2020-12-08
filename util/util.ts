export function shuffleArray(array_: any[]): any[] {
    const array = array_;
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

export const wait: (ms: number) => Promise<unknown> = (ms: number) => new Promise((r)=>setTimeout(r, ms))