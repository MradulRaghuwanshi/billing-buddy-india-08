
import { useRef, useEffect, useState } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ScannerViewProps {
  onBarcodeDetected: (barcode: string) => void;
  onStartScanning: () => void;
  onStopScanning: () => void;
}

const ScannerView = ({ onBarcodeDetected, onStartScanning, onStopScanning }: ScannerViewProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);
  
  // Start video stream
  const startVideoStream = async () => {
    if (isCameraInitializing) return;
    
    setIsCameraInitializing(true);
    
    try {
      const constraints = {
        video: {
          facingMode: "environment", // Use the rear camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Camera started successfully");
                // Make video visible and ensure it's properly displayed
                if (videoRef.current) {
                  videoRef.current.style.display = 'block';
                  videoRef.current.style.width = '100%';
                }
                setIsScanning(true);
                onStartScanning();
              })
              .catch(e => {
                console.error("Error playing video:", e);
                toast({
                  title: "Camera error",
                  description: "Could not start video stream. Please try again.",
                });
              });
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      toast({
        title: "Camera access failed",
        description: "Could not access camera. Please check camera permissions in your browser settings and ensure you're using HTTPS.",
      });
    } finally {
      setIsCameraInitializing(false);
    }
  };

  // Stop video stream
  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    onStopScanning();
  };

  // Initialize barcode detection with more frequent scanning
  useEffect(() => {
    let scanInterval: number;
    
    if (isScanning && videoRef.current && canvasRef.current) {
      // Scan more frequently to improve detection chances
      scanInterval = window.setInterval(() => {
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          
          if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // Set canvas dimensions to match video feed
              canvas.height = video.videoHeight;
              canvas.width = video.videoWidth;
              
              // Draw the video feed on the canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Display the canvas containing the video feed
              canvas.style.display = 'block';
              
              // In a real implementation, we would use a barcode scanning library
              // For now, we'll improve the simulation to be more reliable
              if (scanAttempts < 30) { // Limit scan attempts to prevent excessive simulation
                simulateBarcodeScanning();
                setScanAttempts(prev => prev + 1);
              }
            }
          }
        } catch (error) {
          console.error("Error during barcode scanning:", error);
        }
      }, 200); // Scan more frequently (5 times per second)
    }
    
    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [isScanning, scanAttempts]);

  // Reset scan attempts when starting a new scan
  useEffect(() => {
    if (isScanning) {
      setScanAttempts(0);
    }
  }, [isScanning]);

  // Improved barcode simulation with better detection rates
  const simulateBarcodeScanning = () => {
    // Increase detection probability based on scan attempts
    const detectionProbability = Math.min(0.1 + (scanAttempts * 0.02), 0.5);
    
    if (Math.random() < detectionProbability) { 
      // Generate random barcode
      const randomBarcode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      onBarcodeDetected(randomBarcode);
      
      // Reset scan attempts after successful detection
      setScanAttempts(0);
      stopVideoStream();
    }
  };

  // Start scanning when component mounts
  useEffect(() => {
    startVideoStream();
    
    return () => {
      stopVideoStream();
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      {isCameraInitializing ? (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-2 text-sm text-muted-foreground">Initializing camera...</p>
        </div>
      ) : (
        <>
          <div className="relative rounded-lg overflow-hidden border-2 border-primary bg-black" style={{ width: "100%", height: "300px" }}>
            <video 
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover z-10"
              autoPlay
              playsInline
              muted
            />
            {/* Visible canvas that shows the camera feed for processing */}
            <canvas 
              ref={canvasRef} 
              className="absolute top-0 left-0 w-full h-full object-cover z-20"
              style={{ display: "block" }} 
            />
            {/* Improved alignment guide with better contrast */}
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              {/* Horizontal alignment line */}
              <div className="absolute left-0 right-0 h-0.5 bg-red-600"></div>
              {/* Vertical alignment line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-600"></div>
              {/* Scanning target box with high contrast */}
              <div className="border-2 border-red-600 w-64 h-16 opacity-80 relative">
                {/* Corner brackets for better alignment guidance */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600"></div>
              </div>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center z-40">
              <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                Align barcode within the red box {scanAttempts > 0 ? `(${scanAttempts})` : ''}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Position barcode within the red box and hold steady
          </p>
          
          <div className="flex justify-center mt-4">
            <Button onClick={() => {
              stopVideoStream();
              startVideoStream();
            }} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Reset Scanner
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ScannerView;
