import * as ReactDatePicker from 'react-datepicker';

// biome-ignore lint/suspicious/noExplicitAny: Rappa fra Pensjon 
const DatePicker: any = (ReactDatePicker as any).default || ReactDatePicker;
import 'react-datepicker/dist/react-datepicker.css';
import {nb} from 'date-fns/locale';

interface DateTimePickerProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    id?: string;
    dateFormat?: string;
    timeFormat?: string;
    timeIntervals?: number;
    timeCaption?: string;
    placeholderText?: string;
    ariaLabel?: string;
    labelText?: string;
    tabIndex?: number;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
                                                           selectedDate,
                                                           setSelectedDate,
                                                           id = 'date-picker',
                                                           labelText = 'Dato',
                                                           dateFormat = 'yyyy-MM-dd HH:mm',
                                                           timeFormat = 'HH:mm',
                                                           timeIntervals = 15,
                                                           timeCaption = 'Klokkeslett',
                                                           placeholderText = 'Velg tidspunkt',
                                                           ariaLabel = 'Velg tidspunkt', tabIndex
                                                       }) => {


    return (
        <div className="flex items-center flex-row gap-x-2 min-w-[100px]">
            <label htmlFor={id} className="block text-white mb-1">
                {labelText}
            </label>
            <DatePicker
                id={id}
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                showTimeSelect
                timeFormat={timeFormat}
                timeIntervals={timeIntervals}
                timeCaption={timeCaption}
                dateFormat={dateFormat}
                locale={nb}
                placeholderText={placeholderText}
                className="block w-full h-12 focus:border-indigo-500 focus:ring-indigo-500 text-center cursor-pointer text-white bg-surface-inverted border-gray-300 border rounded-md"
                aria-label={ariaLabel}
                tabIndex={tabIndex}
            />
        </div>
    );
};

export default DateTimePicker;