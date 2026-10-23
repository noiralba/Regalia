import {  useState } from "react";
import Calendar from "../components/Calender";
import DatePicker from "../components/DatePicker";


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
