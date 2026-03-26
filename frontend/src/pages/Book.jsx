import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import BookingProgressStepper from "../components/BookingProgressStepper";
import ServiceSelector from "../components/ServiceSelector";
import StaffSelector from "../components/StaffSelector";
import DateSelector from "../components/DateSelector";
import SlotSelector from "../components/SlotSelector";
import PersonalInfoForm from "../components/PersonalInfoForm";
import { useServices } from "../hooks/useServices";
import { useAvailability } from "../hooks/useAvailability";
import { useCreateBooking } from "../hooks/useCreateBooking";
import { useStaff } from "../hooks/useStaff";

// Helper to get today's ISO date
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Helper to format date
function formatDateObj(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Generate dates for the next 14 days
function generateDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const iso = date.toISOString().split("T")[0];
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    dates.push({
      date: iso,
      day: day.substring(0, 3),
      dateNum: date.getDate(),
    });
  }
  return dates;
}

export default function Book() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Hooks
  const {
    services = [],
    loading: servicesLoading,
    error: servicesError,
  } = useServices?.() || { services: [], loading: false, error: null };

  const { staff, loading, error } = useStaff();

  const {
    slotsByStaff = [],
    anyStaffSlots = [],
    loading: slotsLoading,
    error: slotsError,
    fetchAvailability,
  } = useAvailability();

  const {
    loading: bookingLoading,
    error: bookingError,
    submitBooking = async () => {},
  } = useCreateBooking?.() || {
    loading: false,
    error: null,
    submitBooking: async () => {},
  };

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceId, setServiceId] = useState(state?.preselectServiceId || "");
  const [staffId, setStaffId] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Generate dates
  const dates = generateDates();
  const slots = staffId
    ? slotsByStaff.find((s) => String(s.staffId) === String(staffId))?.slots ||
      []
    : anyStaffSlots || [];

  // Get the selected service
  const selectedService = useMemo(
    () => services.find((s) => String(s._id || s.id) === String(serviceId)),
    [services, serviceId],
  );

  // Fetch availability when service or date changes
  useEffect(() => {
    if (!serviceId || !selectedDate || currentStep !== 3) return;
    fetchAvailability({ serviceId, date: selectedDate, staffId });
  }, [serviceId, selectedDate, currentStep, fetchAvailability]);

  // Handle step navigation - Next
  const handleNext = () => {
    if (currentStep === 1 && !serviceId) {
      alert("Please select a service");
      return;
    }
    if (currentStep === 2) {
      // Staff is optional, proceed anyway
    }
    if (currentStep === 3 && !selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle step navigation - Back
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle booking submission
  const handleBookingSubmit = async (finalFormData) => {
    if (!serviceId || !selectedSlot) {
      alert("Please complete all required fields");
      return;
    }

    const bookingPayload = {
      serviceId,
      staffId: staffId || null,
      date: selectedDate,
      startTime: selectedSlot,
      customerName: finalFormData.customerName,
      phone: finalFormData.phone,
      email: finalFormData.email,
      notes: finalFormData.notes,
    };

    try {
      const booking = await submitBooking(bookingPayload);
      navigate("/bookingSuccess", {
        state: { booking },
      });
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <PageTransition>
      <section className="min-h-screen bg-gradient-to-b from-zinc-950 to-black">
        {/* Header */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Book Your Appointment
            </h1>
            <p className="mt-2 text-gray-400">
              Follow the steps below to secure your booking
            </p>
          </div>

          {/* Progress Stepper */}
          <BookingProgressStepper currentStep={currentStep} />
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-5xl px-4 pb-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Select a Service
                  </h2>
                  <p className="text-gray-400">
                    Choose the service you&apos;d like to book
                  </p>
                </div>
                <ServiceSelector
                  services={services}
                  selectedService={serviceId}
                  onSelectService={setServiceId}
                  loading={servicesLoading}
                  error={servicesError}
                />
              </div>
            )}

            {/* Step 2: Staff Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Choose Your Stylist
                  </h2>
                  <p className="text-gray-400">
                    Select a staff member or let us assign one for you
                  </p>
                </div>
                <StaffSelector
                  staff={staff}
                  selectedStaff={staffId}
                  onSelectStaff={setStaffId}
                  loading={loading}
                  error={error}
                />
              </div>
            )}

            {/* Step 3: Date & Slot Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Select Date & Time
                  </h2>
                  <p className="text-gray-400">
                    Pick a convenient date and time slot for your appointment
                  </p>
                </div>
                <DateSelector
                  dates={dates}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                <SlotSelector
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  loading={slotsLoading}
                  error={slotsError}
                />
              </div>
            )}

            {/* Step 4: Personal Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Your Information
                  </h2>
                  <p className="text-gray-400">
                    Please provide your contact details
                  </p>
                </div>

                {/* Booking Summary */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <h3 className="font-semibold text-white">Booking Summary</h3>
                  {selectedService && (
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Service:</span>
                        <span className="text-white font-medium">
                          {selectedService.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Price:</span>
                        <span className="text-white font-medium">
                          ₹{selectedService.price}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Duration:</span>
                        <span className="text-white font-medium">
                          {selectedService.duration} mins
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-gray-300">
                        <span>Date & Time:</span>
                        <span className="text-white font-medium">
                          {formatDateObj(selectedDate)} at {selectedSlot}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <PersonalInfoForm
                  formData={formData}
                  onFormChange={setFormData}
                  onSubmit={handleBookingSubmit}
                  loading={bookingLoading}
                  error={bookingError}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4 justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-8 h-12 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>

              {currentStep < 4 && (
                <button
                  onClick={handleNext}
                  className="px-8 h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
