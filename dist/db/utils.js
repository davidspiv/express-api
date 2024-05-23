import { readFile } from 'node:fs/promises';
const getData = async (fileName) => {
    try {
        const contents = await readFile(fileName, { encoding: 'utf8' });
        return contents;
    }
    catch (err) {
        console.log('Could not read SQL statement');
    }
};
const parseCsv = async (fileType) => {
    const transactions = [];
    const csvData = await getData('debit.csv');
    if (csvData) {
        const csvValues = csvData.split(',');
        const totalCol = 6;
        for (let i = 1; i < Math.floor(csvValues.length / totalCol); i++) {
            const datePosted = csvValues[i * totalCol].split('\n')[1];
            const memo = csvValues[i * totalCol + 1];
            const amount = csvValues[i * totalCol + 5];
            transactions.push({
                transType: fileType,
                datePosted,
                dateAvailable: null,
                amount,
                fitid: null,
                transName: null,
                memo,
            });
        }
        return transactions;
    }
    console.log('Error with getData()');
};
const parseOfx = async () => {
    const transactions = [];
    const ofxString = await getData('debit.ofx');
    const objectify = (ofxData) => {
        const transType = ofxData.slice(ofxData.indexOf('<TRNTYPE>') + 9, ofxData.indexOf('</TRNTYPE'));
        const datePosted = ofxData.slice(ofxData.indexOf('<DTPOSTED>') + 10, ofxData.indexOf('</DTPOSTED>'));
        const dateAvailable = ofxData.slice(ofxData.indexOf('<DTAVAIL>') + 9, ofxData.indexOf('</DTAVAIL>'));
        const amount = ofxData.slice(ofxData.indexOf('<TRNAMT>') + 8, ofxData.indexOf('</TRNAMT>'));
        const fitid = ofxData.slice(ofxData.indexOf('<FITID>') + 7, ofxData.indexOf('</FITID>'));
        const transName = ofxData.slice(ofxData.indexOf('<NAME>') + 6, ofxData.indexOf('</NAME>'));
        const memo = ofxData.slice(ofxData.indexOf('<MEMO>') + 6, ofxData.indexOf('</MEMO>'));
        return {
            transType,
            datePosted,
            dateAvailable,
            amount,
            fitid,
            transName,
            memo,
        };
    };
    if (ofxString) {
        const ofxDataArr = ofxString.split('<STMTTRN>');
        //skip first AND last el
        for (let i = 1; i < ofxDataArr.length - 1; i++) {
            const transaction = objectify(ofxDataArr[i]);
            transactions.push(transaction);
        }
        return transactions;
    }
    console.log('Error with getData()');
};
export { getData, parseCsv, parseOfx };
