export const format = ( value: number ) => {

    const formatter = new Intl.NumberFormat('de-DE',{
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    })
    return formatter.format(value);
}