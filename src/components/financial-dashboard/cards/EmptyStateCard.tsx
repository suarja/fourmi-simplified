export function EmptyStateCard() {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
        No Financial Data Yet
      </h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
        Start chatting with Fourmi to add your income, expenses, and loans
      </p>
      <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 text-left max-w-sm sm:max-w-md mx-auto">
        <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Try saying:</h4>
        <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
          <li>• "I earn 3000€ per month"</li>
          <li>• "My rent is 800€ monthly"</li>
          <li>• "I spend 300€ on groceries"</li>
          <li>• "I have a car loan of 250€/month"</li>
        </ul>
      </div>
    </div>
  );
}