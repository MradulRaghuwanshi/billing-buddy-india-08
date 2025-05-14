
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          <div className="ml-4 hidden md:block">
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 py-2 focus-visible:ring-blue-500" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Today: {new Date().toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
