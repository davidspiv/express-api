import Database from 'better-sqlite3';
import type { EntryData } from '../../interfaces.js';

const isEntry = (obj: unknown): obj is EntryData => {
	return (
		(obj as EntryData)?.entry_id !== undefined &&
		(obj as EntryData)?.entry_type !== undefined
	);
};

export default () => {};
