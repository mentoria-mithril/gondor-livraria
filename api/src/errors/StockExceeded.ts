export class StockExceeded extends Error {
    constructor(
        readonly stock: number,
        readonly inCart: number,
    ) {
        super('Stock exceeded')
        this.name = 'StockExceeded'
    }
}
