const str = `asdf,"a,d",fdsa`;
console.log(splitCsv(str));
function splitCsv(str) {
    const obj = {
        soFar: [],
        isConcatting: false,
    };
    return str.split(',').reduce((accum, curr) => {
        if (accum.isConcatting) {
            accum.soFar[accum.soFar.length - 1] += `,${curr}`;
        }
        else {
            accum.soFar.push(curr);
        }
        if (curr.split('"').length % 2 === 0) {
            accum.isConcatting = !accum.isConcatting;
        }
        return accum;
    }, obj).soFar;
}
export {};
