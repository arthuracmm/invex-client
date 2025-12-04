import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';


interface DateRangePickerProps {
    onChange: (range: { startDate: Dayjs | null, endDate: Dayjs | null }) => void;
    withTime?: boolean;
    dateSelected?: { startDate: Dayjs | null; endDate: Dayjs | null };
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, withTime = false, dateSelected }) => {
    const [startDate, setStartDate] = useState<Dayjs | null>(
        dateSelected?.startDate ? dayjs(dateSelected.startDate) : dayjs()
    );

    const [endDate, setEndDate] = useState<Dayjs | null>(
        dateSelected?.endDate ? dayjs(dateSelected.endDate) : dayjs()
    );

    const handleStartDateChange = (date: any) => {
        setStartDate(date);
        onChange({ startDate: date, endDate });
    };

    const handleEndDateChange = (date: any) => {
        setEndDate(date);
        onChange({ startDate, endDate: date });
    };

    useEffect(() => {
        if (dateSelected) {
            setStartDate(dateSelected.startDate ? dayjs(dateSelected.startDate) : null);
            setEndDate(dateSelected.endDate ? dayjs(dateSelected.endDate) : null);
        }
    }, [dateSelected]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex w-full gap-4 items-center">
                <div className='w-full'>
                    <DatePicker
                        label="De"
                        value={startDate}
                        onChange={handleStartDateChange}
                        format={withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
                        sx={{ display: 'flex', width: '100%' }}
                    />
                </div>
                <p>-</p>
                <div className='w-full'>
                    <DatePicker
                        label="Até"
                        value={endDate}
                        onChange={handleEndDateChange}
                        format={withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
                        sx={{ display: 'flex', width: '100%' }}
                    />
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default DateRangePicker;
