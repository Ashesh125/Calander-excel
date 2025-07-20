import fs from 'fs';
import path from 'path';

/**
 * Saves a JSON object to a file in ../data as YEAR-MONTH.json (e.g., 2025-7.json)
 * @param data The data to save
 * @param year The calendar year
 * @param month The month number (1 = January)
 */
export function saveCalendarJson(data: any, year: number, month: number): void {
    const fileName = `${year}-${month}.json`;
    const filePath = path.resolve(__dirname, '../../data', fileName);

    const jsonWithTimestamp = {
        updated_at: new Date().toISOString(),
        calendar: data,
    };

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify(jsonWithTimestamp, null, 2), 'utf-8');
    console.log(`✅ Calendar JSON saved (overwritten) at: ${filePath}`);
}