/* eslint-disable react/prop-types */
import { Button } from "./button";

const Modal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <div className="bg-white rounded-lg p-6 relative z-10 max-w-md mx-auto dark:bg-primary dark:text-black">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center">
        <Button
          onClick={onClose}
          className="px-4 py-2 bg-primary dark:bg-black text-white"
        >
          Close
        </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;