import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { walletService } from '../services/wallet.service';
import { LoadingSpinner } from '../../../common/components/LoadingSpinner';
import { Button } from '../../../common/components/Button';
import { downloadBlobAsFile } from '../../../common/utils';
import { cn } from '../../../common/utils/styles.utils';
import { SortField, SortOrder } from '../types/wallet.types';
import { toast } from 'react-hot-toast';
interface ExportTransactionsButtonProps {
  className?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export const ExportTransactionsButton: React.FC<ExportTransactionsButtonProps> = ({ 
  className,
  sortBy = SortField.DATE,
  sortOrder = SortOrder.DESC,
}) => {
  const { walletId } = useWallet();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!walletId) return;

    setIsExporting(true);
    try {
      const blob = await walletService.exportTransactions(walletId, {
        sortBy,
        sortOrder,
      });
      if (blob instanceof Blob) {
        downloadBlobAsFile(blob, `wallet-transactions-${walletId}.csv`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to export transactions:', error);
      alert('Failed to export transactions. Please try again.');
    } finally {
      toast.success('Transactions exported successfully');
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={!walletId || isExporting}
      className={cn('flex items-center gap-2', className)}
    >
      {isExporting ? (
        <>
          <LoadingSpinner size="sm" />
          Exporting...
        </>
      ) : (
        'Export Transactions'
      )}
    </Button>
  );
}; 