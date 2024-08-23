import { getDataPromises } from './utilDb.js';
import { buildSchema, insertModels } from './utilDb.js';
import dynamicQueries from './dynamicQueries.js';

const parseQueries = (data: string) => {
	const queryArr = data.split(/(?<=;)/g);

	const filteredQueryArr = queryArr.filter((query) => {
		const firstWord = query.trim().split(' ')[0];
		return firstWord === 'CREATE' || firstWord === 'INSERT';
	});

	return filteredQueryArr;
};

const main = async () => {
	const fileNames = [
		'./src/models/schema.sql',
		'./testInputs/accounts.json',
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
		dataAccounts,
		dataSources,
		dataUsers,
	] = data;

	const schema = parseQueries(dataSchema);
	const accounts = JSON.parse(dataAccounts);
	const sources = JSON.parse(dataSources);
	const users = JSON.parse(dataUsers);

	buildSchema(schema);

	const userIds = insertModels(dynamicQueries.insertUsers, users);

	for (const source of sources) {
		source.userId = userIds[0];
		source.isDebit = 1; //sqlite accepts bool as 1 or 'TRUE'
	}

	insertModels(dynamicQueries.insertSources, sources);

	for (const account of accounts) {
		account.userId = userIds[0];
	}

	insertModels(dynamicQueries.insertAccounts, accounts);
};

main();
