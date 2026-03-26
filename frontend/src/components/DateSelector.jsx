import React from "react";

const DateSelector = ({ dates, selectedDate, onSelectDate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Select Date</h3>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date.date}
            onClick={() => onSelectDate(date.date)}
            className={`flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all ${
              selectedDate === date.date
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <span className="text-xs font-medium">{date.day}</span>
            <span className="text-lg font-semibold">{date.dateNum}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
