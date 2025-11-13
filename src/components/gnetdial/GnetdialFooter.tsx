
export function GnetdialFooter() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="mt-12 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
          <p>Copyright © {currentYear} Gnetdial Ltd. All rights reserved. <span className="mx-2">|</span> <a href="#" className="hover:underline">Terms of Use</a> <span className="mx-2">|</span> <a href="#" className="hover:underline">Privacy Policy</a></p>
        </div>
      </footer>
    );
  }
  