import React from "react";

const PersonalInfoForm = ({
  formData,
  onFormChange,
  onSubmit,
  loading,
  error,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Personal Information</h3>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) =>
              onFormChange({ ...formData, customerName: e.target.value })
            }
            required
            className="w-full h-11 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              onFormChange({ ...formData, phone: e.target.value })
            }
            required
            className="w-full h-11 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              onFormChange({ ...formData, email: e.target.value })
            }
            required
            className="w-full h-11 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Special Request (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              onFormChange({ ...formData, notes: e.target.value })
            }
            rows={3}
            className="w-full rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 resize-none"
            placeholder="Any special requests or notes..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
