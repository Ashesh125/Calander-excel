import express from 'express';
import cors from 'cors';
import ExcelJS from 'exceljs';
import { saveCalendarJson } from './helpers/file-hepler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/message', (_req, res) => {
  res.json({ message: 'Hello from backend with TypeScript!' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

interface Task {
  id: number;
  title: string;
  date: string;
}

app.post('/api/export-tasks', async (req, res) => {
  try {
    const { tasks } = req.body as { tasks: Task[] };
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Calendar');

    worksheet.columns = [
      { width: 25 },
      { width: 25 },
      { width: 40 },
      { width: 40 },
      { width: 20 },
      { width: 40 },
      { width: 20 }
    ];

    const referenceDate = tasks.length > 0 ? new Date(tasks[0].date) : new Date();
    const currentMonth = referenceDate.getMonth();
    const currentYear = referenceDate.getFullYear();
    const monthYearString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01 00:00:00`;

    const titleRow = worksheet.addRow(['', '', '', 'Nabil SSE', '', '', '']);
    const dateRow =    worksheet.addRow(['', '', '', monthYearString, '', '', '']);
    titleRow.font = { bold: true };

    titleRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00b050' },
      };
    });

    dateRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00b050' },
      };
    });

    worksheet.addRow([]);

    let task_array = buildTaskCalendar(currentYear, currentMonth + 1, tasks);
    console.log(task_array);
    saveCalendarJson(task_array, currentYear, currentMonth + 1);

    task_array.forEach((row) => {
      const excelRow = worksheet.addRow(row);
      excelRow.eachCell((cell, colNumber) => {
        cell.alignment = { wrapText: true, vertical: 'top' };
        if (excelRow.number === 1) {
          const headerTextLength = row[colNumber - 1]?.toString().length || 10;
          worksheet.getColumn(colNumber).width = Math.max(15, headerTextLength + 5);
        }
        const contentLength = (cell.value?.toString().length || 0);
        if (contentLength > 50) {
          excelRow.height = 40;
        }
      });
    });


    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Nabil_SSE_Calendar.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Export failed');
  }
});

function getMonthCalendarWithLabels(year: number, month: number) {
  const weeks = [];
  const date = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = date.toLocaleString('default', { month: 'long' });

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function getOrdinal(n: number) {
    if (n > 3 && n < 21) return n + 'th';
    switch (n % 10) {
      case 1: return n + 'st';
      case 2: return n + 'nd';
      case 3: return n + 'rd';
      default: return n + 'th';
    }
  }

  let firstDay = date.getDay(); // 0 = Sunday
  let currentWeek = new Array(firstDay).fill('');

  for (let day = 1; day <= daysInMonth; day++) {
    const tempDate = new Date(year, month - 1, day);
    const weekday = weekdayNames[tempDate.getDay()];
    currentWeek.push(`${weekday} ${getOrdinal(day)} ${monthName}`);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push('');
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function buildTaskCalendar(year: number, month: number, tasks: Task[]): string[][] {
  const calendarLabels = getMonthCalendarWithLabels(year, month);
  const finalCalendar: string[][] = [];
  const taskRows: string[][][] = [];

  // Create a map of ISO date -> {row, col}
  const dateToPosition: Record<string, { rowIndex: number; colIndex: number }> = {};

  for (let rowIndex = 0; rowIndex < calendarLabels.length; rowIndex++) {
    for (let colIndex = 0; colIndex < 7; colIndex++) {
      const label = calendarLabels[rowIndex][colIndex];
      if (!label) continue;

      const dayParts = label.split(' ');
      const dayNumber = parseInt(dayParts[1].replace(/\D/g, ''));
      const date = new Date(year, month - 1, dayNumber);
      const isoDate = date.toISOString().split('T')[0];

      dateToPosition[isoDate] = { rowIndex, colIndex };
    }
  }

  for (const task of tasks) {
    const pos = dateToPosition[task.date];
    if (!pos) continue;

    let placed = false;
    for (const row of taskRows) {
      if (row[pos.rowIndex][pos.colIndex] === '') {
        row[pos.rowIndex][pos.colIndex] = task.title;
        placed = true;
        break;
      }
    }

    if (!placed) {
      const newRow: string[][] = calendarLabels.map(() => new Array(7).fill(''));
      newRow[pos.rowIndex][pos.colIndex] = task.title;
      taskRows.push(newRow);
    }
  }

  // Combine: label row + task rows for each week
  for (let i = 0; i < calendarLabels.length; i++) {
    finalCalendar.push(calendarLabels[i]);
    for (const row of taskRows) {
      finalCalendar.push(row[i]);
    }
  }

  return finalCalendar;
}


