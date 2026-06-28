export function calculateTotal(details) {
  return details?.reduce((sum, item) => sum + item.total, 0);
}

export function calculateGrandTotal(estimate_schedules) {
  let grandTotal = 0;

  estimate_schedules?.forEach((schedule) => {
    if (schedule.items && Array.isArray(schedule.items)) {
      schedule?.items?.forEach((item) => {
        grandTotal += item.total || 0;
      });
    }
  });

  return grandTotal;
}

export function calculateTenderPriceTotal(priceSchedules) {
  let tenderPriceTotal = 0;

  priceSchedules?.forEach((priceSchedule) => {
    priceSchedule?.estimate_schedules?.forEach((estimateSchedule) => {
      estimateSchedule?.items?.forEach((item) => {
        tenderPriceTotal += item.total;
      });
    });
  });

  return tenderPriceTotal;
}

export const formatPercentage = (percentage) => {
  const intPart = Math.floor(percentage);

  if (percentage === intPart) {
    return `${intPart}%`; // Show 5%
  }
  return `${parseFloat(percentage).toFixed(2)}%`;
};
