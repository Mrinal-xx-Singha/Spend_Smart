import React from "react";

const BudgetItem = ({ budget }) => {
  // Calculate the percentage of the budget spent
  const percentageSpent = budget.totalSpend
    ? (budget.totalSpend / budget.amount) * 100
    : 0;

  return (
    <div className="p-6 border rounded-lg hover:shadow-md bg-white cursor-pointer">
      <div className="flex justify-between items-center mb-4">
        {/* Icon and Budget Name */}
        <div className="flex gap-3 items-center">
          {/* Budget Icon */}
          <div className="text-3xl bg-slate-100 rounded-full p-4">
            {budget?.icon}
          </div>
          {/* Budget Name and Total Items */}
          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              {budget.name}
            </h2>
            <p className="text-sm text-gray-500">
              {budget.totalItem} {budget.totalItem > 1 ? "Items" : "Item"}
            </p>
          </div>
        </div>
        {/* Budget Amount */}
        <h2 className="font-bold text-lg text-primary">
          ${budget.amount.toLocaleString()}
        </h2>
      </div>

      {/* Total Spend & Remaining */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <p>
          <span className="font-semibold">
            ${budget.totalSpend ? budget.totalSpend.toLocaleString() : 0}
          </span>{" "}
          Spent
        </p>
        <p>
          <span className="font-semibold">
            ${budget.amount - (budget.totalSpend || 0)}
          </span>{" "}
          Remaining
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-primary rounded-full w-[40%]"
        ></div>
      </div>
    </div>
  );
};

export default BudgetItem;
