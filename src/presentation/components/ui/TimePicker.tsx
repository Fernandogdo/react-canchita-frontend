// TimePicker.tsx
import React, { useState } from 'react';
import { Button, Input } from '@ui-kitten/components';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MyIcon } from './MyIcon';
import { StyleProp, ViewStyle } from 'react-native';

interface TimePickerProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (time: string) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export const TimePicker = ({ label, placeholder, value, onChange, error, style }: TimePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedTime = selectedDate.toTimeString().split(' ')[0]; // Formato HH:MM:SS
      onChange(formattedTime);
    }
  };

  return (
    <>
      <Input
        label={label}
        placeholder={placeholder}
        accessoryLeft={<MyIcon name="clock-outline" />}
        value={value}
        onFocus={() => setShowPicker(true)}
        status={error ? 'danger' : 'basic'}
        caption={error}
        style={style}
        textStyle={{ color: 'white' }}
      />
      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};
