import { UserButton } from "@clerk/clerk-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface UserProfileDropdownProps {
  className?: string;
  onBillingClick: () => void;
}

export function UserProfileDropdown({ className, onBillingClick }: UserProfileDropdownProps) {
  const getAccessToken = useAction(api.schematic.getAccessToken);

  const handleTestToken = async () => {
    try {
      const token = await getAccessToken();
      console.log("Schematic token:", token);
    } catch (error) {
      console.error("Error getting token:", error);
    }
  };

  return (
    <div className={className}>
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-9 h-9",
            userButtonPopoverCard: "bg-white border border-gray-200 shadow-xl",
            userButtonPopoverActionButton: "text-gray-700 hover:bg-gray-50",
            userButtonPopoverActionButtonText: "text-gray-700",
            userButtonPopoverActionButtonIcon: "text-gray-500",
            userButtonPopoverFooter: "hidden",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Action 
            label="Billing & Subscription" 
            labelIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
            onClick={onBillingClick}
          />
          <UserButton.Action 
            label="Test Token" 
            labelIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onClick={handleTestToken}
          />
          <UserButton.Link 
            label="Help & Support" 
            href="/help"
            labelIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}