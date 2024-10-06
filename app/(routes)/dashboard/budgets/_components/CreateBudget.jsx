"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const CreateBudget = () => {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const { user } = useUser();

  /**
   * Used to create new Budget
   */
  const onCreateBudget = async () => {
    // Attempt to insert a new budget entry into the database
    const result = await db
      .insert(Budgets) // Insert into the Budgets table/schema
      .values({
        // Define the values to insert
        name: name, // Budget name set by the user
        amount: Number(amount), // Ensure the amount is a number (cast from string if needed)
        createdBy: user?.primaryEmailAddress?.emailAddress, // Assign the budget to the currently logged-in user by their email
        icon: emojiIcon, // The emoji chosen by the user to represent the budget
      })
      .returning({ insertedId: Budgets.id }); // Return the ID of the newly inserted budget record
  
    // Check if the insert operation was successful
    if (result) {
      // If successful, show a toast notification to the user
      toast("New Budget Created 🎉");
    }
  };
  ;

  return (
    <div>
      {/* Dialog component */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new budget.
            </DialogDescription>
            <div className="mt-5">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emojiIcon}
              </Button>
              {openEmojiPicker && (
                <div className="absolute">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
              )}
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Name</h2>
                <Input
                  placeholder="e.g. Home Decor"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <Input
                  placeholder="e.g. 2000$"
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
            <Button
                disabled={!(name && amount > 0)}
                className="mt-5 w-full"
                onClick={onCreateBudget} // Corrected invocation
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBudget;
