import { PiggyBank, ReceiptText, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";

const CardInfo = ({ budgetList = [] }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [budgetCount, setBudgetCount] = useState(0);

  /**
   * Calculate total budget, total spend, and budget count.
   */
  const calculateCardInfo = () => {
    console.log(budgetList);

    if (budgetList.length > 0) {
      // Calculate total budget
      let totalBudget_ = 0;
      budgetList.forEach((element) => {
        // Ensure to parse the amount as a number, fallback to 0 if parsing fails
        const amount = Number(element?.amount);
        totalBudget_ += !isNaN(amount) ? amount : 0; // Check for NaN and fallback to 0
      });

      // Calculate total spend
      const totalSpend = budgetList.reduce(
        (acc, budget) => acc + (budget?.totalSpend || 0),
        0
      );

      // Count total budgets
      const budgetCount = budgetList?.length;

      // Update the state with the calculated values
      setTotalBudget(totalBudget_); // Use the correct variable
      setTotalSpend(totalSpend);
      setBudgetCount(budgetCount);
    } else {
      // Reset state if no budgets available
      setTotalBudget(0);
      setTotalSpend(0);
      setBudgetCount(0);
    }
  };

  useEffect(() => {
    calculateCardInfo();
  }, [budgetList]);

  return (
    <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div className="p-7 border rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-sm">Total Budget</h2>
          <h2 className="font-bold text-2xl">${totalBudget}</h2>{" "}
          {/* Format totalBudget */}
        </div>
        <PiggyBank className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
      </div>

      <div className="p-7 border rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-sm">Total Spend</h2>
          <h2 className="font-bold text-2xl">${totalSpend}</h2>{" "}
          {/* Format totalSpend */}
        </div>
        <ReceiptText className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
      </div>

      <div className="p-7 border rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-sm">Number of Budgets</h2>
          <h2 className="font-bold text-2xl">
            {budgetCount.toLocaleString()}
          </h2>{" "}
          {/* Format budgetCount */}
        </div>
        <Wallet className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
      </div>
    </div>
  );
};

export default CardInfo;
