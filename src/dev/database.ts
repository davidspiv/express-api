import { getDataPromises } from './utilDb.js';
import { buildSchema, insertModels } from './utilDb.js';
import { parseQueries, parseCsv } from './utilParse.js';
import dynamicQueries from './dynamicQueries.js';

const main = async () => {
	const fileNames = [
		'./src/models/schema.sql',
		'./testInputs/transactions.csv',
		'./testInputs/accounts.json',
		'./testInputs/entries.json',
		'./testInputs/sources.json',
		'./testInputs/users.json',
	];

	const data: string[] = [];
	const promises = getDataPromises(fileNames);

	try {
		data.push(...(await Promise.all(promises)));
	} catch (err) {
		console.log(err);
	}

	const [
		dataSchema,
		dataReferences,
		dataAccounts,
		dataEntries,
		dataSources,
		dataUsers,
	] = data;

	const schema = parseQueries(dataSchema);
	const references = parseCsv(dataReferences);
	const accounts = JSON.parse(dataAccounts);
	const entries = JSON.parse(dataEntries);
	const sources = JSON.parse(dataSources);
	const users = JSON.parse(dataUsers);

	buildSchema(schema);

	const userIds = insertModels(dynamicQueries.insertUsers, users);

	for (const source of sources) {
		source.userId = userIds[0];
		source.isDebit = 1; //sqlite accepts bool as 1 or 'TRUE'
	}

	const srcIds = insertModels(dynamicQueries.insertSources, sources);

	for (const account of accounts) {
		account.userId = userIds[0];
	}

	const accountIds = insertModels(dynamicQueries.insertAccounts, accounts);

	for (const reference of references) {
		reference.srcId = srcIds[0];
	}

	// const refIds = insertModels(dynamicQueries.insertRefs, references);

	// const entryIds = insertModels(dynamicQueries.insertEntries, entries);
};

main();
