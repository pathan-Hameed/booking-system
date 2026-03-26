import React from "react";

const StaffSelector = ({ staff, selectedStaff, onSelectStaff }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Select Staff (Optional)
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          onClick={() => onSelectStaff("")}
          className={`cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-lg ${
            selectedStaff === ""
              ? "border-blue-500 bg-blue-500/10 shadow-lg"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
        >
          <h4 className="text-lg font-semibold text-white">No Preference</h4>
          <p className="mt-2 text-sm text-gray-400">
            Any available staff will be assigned
          </p>
        </div>
        {staff.map((member) => (
          <div
            key={member._id}
            onClick={() => onSelectStaff(member._id)}
            className={`cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-lg ${
              selectedStaff === member._id
                ? "border-blue-500 bg-blue-500/10 shadow-lg"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <h4 className="text-lg font-semibold text-white">{member.name}</h4>
            <p className="mt-2 text-sm text-gray-400">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffSelector;
