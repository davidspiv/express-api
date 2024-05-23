import { getData } from './utils.js';
import Database from 'better-sqlite3';

const db = new Database('accounting.db');
const query = await getData('sql/test.sql');
if (typeof query === 'string') {
	const response = db.prepare(query).all();
		
	console.log(response);
}
