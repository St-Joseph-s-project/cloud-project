import React, { useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  problemTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  problemTitle,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setConfirmTitle("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    if (confirmTitle === problemTitle) {
      onConfirm();
      onClose();
    } else {
      setError("Problem title does not match.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel centering trick */}
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {step === 1 ? (
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600 dark:text-red-500"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3
                  className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                  id="modal-title"
                >
                  Delete Problem
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Do you want to delete this problem? This action cannot be
                    undone.
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={handleFirstConfirm}
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  onClick={onClose}
                >
                  No, Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600 dark:text-red-500"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  Confirm Deletion
                </h3>
                <div className="mt-2 text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Please type the exact name of the problem:
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-4 select-all bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 text-center">
                    {problemTitle}
                  </p>
                  <input
                    type="text"
                    value={confirmTitle}
                    onChange={(e) => {
                      setConfirmTitle(e.target.value);
                      setError("");
                    }}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 p-2"
                    placeholder="Type problem name here"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                    confirmTitle === problemTitle
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                  disabled={confirmTitle !== problemTitle}
                  onClick={handleFinalConfirm}
                  title={
                    confirmTitle !== problemTitle
                      ? "Type the exact problem name to enable"
                      : ""
                  }
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
