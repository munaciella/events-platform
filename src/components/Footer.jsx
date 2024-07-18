import { FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaThreads } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col md:flex-row justify-between items-center py-3 md:py-6 px-4 mt-20 md:mb-2">
      <div className="w-full md:w-auto text-center md:text-left md:flex md:items-center md:justify-start mb-4 md:mb-0">
        <h4 className="text-primary md:ml-4">
          &copy; {new Date().getFullYear()} EventSphere.
        </h4>
      </div>
      <div className="flex justify-center md:justify-end items-center order-first md:order-last w-full md:w-auto mb-4 md:mb-0 space-x-4 md:space-x-2 md:mr-4">
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="inline-block text-2xl text-primary hover:text-destructive">
          <FaXTwitter />
          <span className="sr-only">X</span>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="inline-block text-2xl text-primary hover:text-destructive">
          <FaInstagram />
          <span className="sr-only">Instagram</span>
        </a>
        <a href="https://www.threads.net/" target="_blank" rel="noopener noreferrer" className="inline-block text-2xl text-primary hover:text-destructive">
          <FaThreads />
          <span className="sr-only">Threads</span>
        </a>
      </div>
      <div className="w-full text-center md:w-auto md:text-right">
        <span className="text-primary">
          Made with <span className="text-primary">♡</span> in Mcr
        </span>
      </div>
    </footer>
  );
};