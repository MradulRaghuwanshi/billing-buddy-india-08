
import { Button } from "@/components/ui/button";
import { ScanBarcode, Camera } from "lucide-react";

interface CameraErrorViewProps {
  onRetry: () => void;
  onEnterManually: () => void;
}

const CameraErrorView = ({ onRetry, onEnterManually }: CameraErrorViewProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <ScanBarcode className="h-16 w-16 text-muted-foreground" />
      <div className="text-sm text-center space-y-4">
        <p className="text-muted-foreground">
          Camera access not available or permission denied.
        </p>
        <p>Please check:</p>
        <ul className="list-disc text-left ml-4">
          <li>You've granted camera permission in your browser</li>
          <li>You're using a secure connection (HTTPS)</li>
          <li>Your device has a working camera</li>
          <li>No other application is currently using the camera</li>
          <li>Try refreshing the page or reopening the browser</li>
        </ul>
        <p className="pt-2">You can try again or enter barcode manually.</p>
      </div>
      <div className="flex space-x-2">
        <Button onClick={onRetry}>
          <Camera className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" onClick={onEnterManually}>
          Enter Manually
        </Button>
      </div>
    </div>
  );
};

export default CameraErrorView;
