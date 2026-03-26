import React from "react";

const ServiceSelector = ({
  services,
  selectedService,
  onSelectService,
  loading,
  error,
}) => {
  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-rose-300">{error}</p>}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading services...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              onClick={() => onSelectService(service._id)}
              className={`cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-lg ${
                selectedService === service._id
                  ? "border-blue-500 bg-blue-500/10 shadow-lg"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <h3 className="text-lg font-semibold text-white">
                {service.name}
              </h3>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-300">
                <span>₹{service.price}</span>
                <span>{service.duration} mins</span>
              </div>
              {service.description && (
                <p className="mt-3 text-sm text-gray-400">
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
