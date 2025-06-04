import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you navigate the POS system. You can ask me about inventory management, billing, reports, or any other features.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    // Navigation questions
    "inventory": "To access Inventory Management, click on 'Inventory' in the sidebar. Here you can view products, add new items, scan barcodes, and manage stock levels.",
    "billing": "For Billing and POS operations, click on 'Billing' in the sidebar. You can create invoices, process payments, and manage customer transactions.",
    "dashboard": "The Dashboard shows your business overview with sales charts, recent transactions, and low stock alerts. Click 'Dashboard' in the sidebar to access it.",
    "reports": "To view Reports and analytics, click on 'Reports' in the sidebar. You'll find sales reports, inventory status, and business insights.",
    "users": "User management is available in the 'Users' section in the sidebar. You can manage staff accounts and permissions.",
    "settings": "Application settings can be found by clicking 'Settings' in the sidebar. Configure your business details, preferences, and system settings.",
    
    // Feature-specific questions
    "add product": "To add a new product: Go to Inventory → Click 'Add Product' button → Fill in product details like name, price, category, and stock quantity → Save.",
    "scan barcode": "To scan barcodes: Go to Inventory → Click 'Scan Barcode' button → Use your device camera to scan or enter barcode manually → Add product details.",
    "create invoice": "To create an invoice: Go to Billing → Select products from the grid → Add to cart → Enter customer details → Process payment → Generate receipt.",
    "view sales": "To view sales data: Go to Reports → Check the sales charts and recent transactions → Filter by date range for specific periods.",
    "low stock": "Low stock alerts appear on the Dashboard. You can also check inventory levels in the Inventory section and filter by stock status.",
    
    // General help
    "help": "I can help you with navigation, inventory management, billing operations, reports, and general POS features. What would you like to know?",
    "how to": "I can guide you through various tasks. Try asking 'how to add product', 'how to create invoice', or 'how to view reports'.",
    "navigation": "Use the sidebar menu to navigate between sections: Dashboard, Billing, Inventory, Reports, Users, and Settings. Each section has specific tools for different operations."
  };

  const findResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Check for exact matches or partial matches
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return response;
      }
    }
    
    // Check for common variations
    if (input.includes("product") && input.includes("add")) {
      return predefinedResponses["add product"];
    }
    if (input.includes("barcode") || input.includes("scan")) {
      return predefinedResponses["scan barcode"];
    }
    if (input.includes("invoice") || input.includes("bill")) {
      return predefinedResponses["create invoice"];
    }
    if (input.includes("sales") || input.includes("report")) {
      return predefinedResponses["view sales"];
    }
    if (input.includes("stock") && input.includes("low")) {
      return predefinedResponses["low stock"];
    }
    
    // Default fallback message
    return "I'm sorry, I couldn't find the answer to your question right now. For further assistance, please contact us at +91 94713 59517. We're here to help!";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 z-50"
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col border-0 overflow-hidden animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-semibold">POS Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 bg-gray-50">
            {/* Messages Area with Custom Scrolling */}
            <ScrollArea className="flex-1 px-4 py-3">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        message.isBot
                          ? 'bg-white text-gray-800 border border-gray-200'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about the POS..."
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
