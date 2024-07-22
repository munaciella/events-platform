/* eslint-disable react/prop-types */
import { Button } from "./button";

const Modal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  // return (
  //   <div className="fixed inset-0 flex items-center justify-center z-50">
  //     <div 
  //       className="fixed inset-0 bg-black opacity-50" 
  //       onClick={onClose}
  //       aria-hidden="true"
  //     ></div>
  //     <div className="relative bg-background dark:bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 sm:mx-0">
  //       <h2 className="text-xl font-semibold mb-4 text-card-foreground dark:text-card-foreground">
  //         {title}
  //       </h2>
  //       <p className="text-base mb-4 text-card-foreground dark:text-card-foreground whitespace-pre-wrap">
  //         {message}
  //       </p>
  //       <Button
  //         onClick={onClose}
  //         className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
  //       >
  //         Close
  //       </Button>
  //     </div>
  //   </div>
  // );

  
  const messageLines = message.split('\n');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-black opacity-50" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative bg-background dark:bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 sm:mx-0">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground dark:text-card-foreground">
          {title}
        </h2>
        {messageLines.map((line, index) => (
          <p key={index} className="text-base mb-2 text-card-foreground dark:text-card-foreground">
            {line}
          </p>
        ))}
        <Button
          onClick={onClose}
          className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default Modal;