import { TransactionType } from "../types/wallet.types";
import { cn } from "../../../common/utils/styles.utils";

interface TransactionTypeButtonProps {
    type: TransactionType;
    selected: boolean;
    onClick: () => void;
  }
  
export const TransactionTypeButton: React.FC<TransactionTypeButtonProps> = ({
    type,
    selected,
    onClick
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 py-2 px-4 rounded-md',
        selected && type === TransactionType.CREDIT && 'bg-green-600 text-white',
        selected && type === TransactionType.DEBIT && 'bg-red-600 text-white',
        !selected && 'bg-gray-200 text-gray-700'
      )}
    >
      {type === TransactionType.CREDIT ? 'Credit' : 'Debit'}
    </button>
  ); 