import './InputDate.scss';
import { Input, type InputProps, type InputRef } from 'antd';
import { useRef } from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';

const InputDate: React.FC<InputProps> = ({ ...props }) => {
    const inputRef = useRef<InputRef>(null);

    const handleOpenDatePicker = () => {
        if (inputRef.current?.input) {
            try {
                inputRef.current.input.showPicker();
            } catch {
                inputRef.current.input.focus();
            }
        }
    };

    return (
        <Input
            className='InputDate'
            onClick={handleOpenDatePicker}
            ref={inputRef}
            suffix={
                <AiOutlineCalendar
                    onClick={handleOpenDatePicker}
                    opacity={0.4}
                    size={15}
                    style={{ cursor: 'pointer' }}
                />
            }
            type='date'
            {...props}
        />
    );
};

export default InputDate;
