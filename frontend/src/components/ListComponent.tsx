import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ListResponse {
    year: string;
    availableYears: string[];
    availableMonths: number[];
}

const ListComponent: React.FC = () => {
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [availableMonths, setAvailableMonths] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (selectedYear: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get<ListResponse>(`/api/data/${selectedYear}`);
            setYear(res.data.year);
            setAvailableYears(res.data.availableYears);
            setAvailableMonths(res.data.availableMonths);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(year);
    }, []);

    const handleYearClick = (selectedYear: string) => {
        fetchData(selectedYear);
    };

    const handleMonthClick = (selectedMonth: number) => {
        const newUrl = `/${year}/${selectedMonth}`;
        window.history.pushState(null, '', newUrl);
    };

    const monthName = (monthNumber: number) =>
        new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Available Data by Year and Month</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-6">
                <h3 className="font-medium mb-2">Select Year:</h3>
                <div className="flex flex-wrap gap-2">
                    {availableYears.map(y => (
                        <button
                            key={y}
                            onClick={() => handleYearClick(y)}
                            className={`px-4 py-2 rounded border ${
                                y === year
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-100'
                            } transition`}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Month</th>
                        </tr>
                        </thead>
                        <tbody>
                        {availableMonths.length > 0 ? (
                            availableMonths.map(month => (
                                <tr key={month}
                                    onClick={() => handleMonthClick(month)}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {monthName(month)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 text-gray-500">
                                    No data available for this year.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListComponent;
