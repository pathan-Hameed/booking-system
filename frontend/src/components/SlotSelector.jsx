import React from "react";

const SlotSelector = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  error,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Select Time Slot</h3>
      {error && <p className="text-sm text-rose-300">{error}</p>}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading slots...</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => onSelectSlot(slot.time)}
              disabled={!slot.available}
              className={`h-12 rounded-xl font-medium border transition-all hover:cursor-pointer ${
                selectedSlot === slot.time
                  ? "bg-blue-500 text-white border-blue-400 shadow-lg"
                  : slot.available
                    ? "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                    : "bg-white/5 text-gray-500 border-white/5 opacity-40 cursor-not-allowed"
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotSelector;