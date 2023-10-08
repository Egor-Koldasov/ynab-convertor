export const isRateValid = (rate: number) => !isNaN(rate) && rate > 0 && isFinite(rate)
