"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PenBoxIcon } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { db } from "@/utils/dbConfig"; // Ensure this is correctly configured
import { Budgets } from "@/utils/schema"; // Ensure schema is correct
import { eq } from "drizzle-orm";
import { toast } from "sonner";

const EditBudget = ({ budgetList, refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState(""); // Default emoji
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(""); // Default empty string
  const [amount, setAmount] = useState(0); // Default zero
  const { user } = useUser(); // Assuming user is being used somewhere later in the code

  // Update state when budgetList prop changes (if coming from an API or async source)
  useEffect(() => {
    if (budgetList && budgetList.length > 0) {
      setEmojiIcon(budgetList[0]?.icon || "💰"); // Fallback to default emoji if undefined
      setName(budgetList[0]?.name || "");
      setAmount(budgetList[0]?.amount || 0);
    }
  }, [budgetList]); // This will run when budgetList changes

  const onUpdateBudget = async () => {
    try {
      const result = await db
        .update(Budgets)
        .set({
          name: name,
          amount: amount,
          icon: emojiIcon,
        })
        .where(eq(Budgets.id, budgetList[0]?.id)) // Access id correctly
        .returning();

      if (result.length > 0) {
        refreshData();
        toast.success("Budget Updated !!"); // Toast success message
      } else {
        toast.error("Failed to update budget."); // Handle empty result
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("An error occurred while updating the budget.");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" variant="default" className="flex gap-2">
            <PenBoxIcon /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              Update your budget details below.
            </DialogDescription>

            <div className="mt-5">
              {/* Emoji Picker */}
              <div className="relative ">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-center px-4 py-4 border border-slate-300 rounded-full text-center bg-slate-100  transition-colors duration-200 hover:bg-gray-100"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  <span className="text-2xl">{emojiIcon}</span>
                </Button>
                {openEmojiPicker && (
                  <div className="absolute z-20 bg-white rounded-lg shadow-lg p-2 transition-all duration-200">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Budget Name Input */}
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Name</h2>
                <Input
                  placeholder="e.g. Home Decor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Budget Amount Input */}
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <Input
                  placeholder="e.g. 2000$"
                  value={amount}
                  type="number"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </DialogHeader>

          {/* Update Button */}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                className="mt-5 w-full"
                onClick={onUpdateBudget} // Handle update logic here
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBudget;
