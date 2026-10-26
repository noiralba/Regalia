import { useState } from "react";
import Calendar from "../components/Calender/Calender";
import DatePicker from "../components/Date-Picker/DatePicker";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toLocaleDateString("sv-SE"),
  );

  return (
    <main>
      <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
      <Calendar selectedDate={selectedDate} />
    </main>
  );
}
