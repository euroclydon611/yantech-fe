import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface MaintenanceProps {
  onRetry?: () => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ onRetry }) => {
  const [countdown, setCountdown] = useState(2);
  const [isRetrying, setIsRetrying] = useState(false);
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanRetry(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = async () => {
    if (!canRetry) return;
    
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    }
    setTimeout(() => {
      setIsRetrying(false);
      setCanRetry(false);
      setCountdown(30);
      
      // Restart countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanRetry(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <img
                src="/images/epa-logo.png"
                alt="EPA Logo"
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 mb-4">
                {/* Dancing Teddy Bear SVG */}
                <svg
                  className="w-12 h-12 animate-bounce"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    animation: "teddyDance 1.5s ease-in-out infinite",
                  }}
                >
                  {/* Ears */}
                  <circle cx="18" cy="14" r="8" fill="#D4A574" />
                  <circle cx="18" cy="14" r="4" fill="#C4956A" />
                  <circle cx="46" cy="14" r="8" fill="#D4A574" />
                  <circle cx="46" cy="14" r="4" fill="#C4956A" />
                  
                  {/* Head */}
                  <circle cx="32" cy="24" r="16" fill="#D4A574" />
                  
                  {/* Muzzle */}
                  <ellipse cx="32" cy="28" rx="8" ry="6" fill="#E8D4B8" />
                  
                  {/* Nose */}
                  <ellipse cx="32" cy="26" rx="3" ry="2" fill="#4A3728" />
                  
                  {/* Eyes */}
                  <circle cx="26" cy="22" r="2.5" fill="#4A3728" />
                  <circle cx="38" cy="22" r="2.5" fill="#4A3728" />
                  <circle cx="26.5" cy="21.5" r="1" fill="white" />
                  <circle cx="38.5" cy="21.5" r="1" fill="white" />
                  
                  {/* Smile */}
                  <path
                    d="M28 30 Q32 34 36 30"
                    stroke="#4A3728"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  
                  {/* Body */}
                  <ellipse cx="32" cy="48" rx="14" ry="12" fill="#D4A574" />
                  
                  {/* Belly */}
                  <ellipse cx="32" cy="48" rx="8" ry="7" fill="#E8D4B8" />
                  
                  {/* Arms */}
                  <ellipse
                    cx="14" cy="44"
                    rx="6" ry="8"
                    fill="#D4A574"
                    style={{
                      transformOrigin: "20px 40px",
                      animation: "armWave 0.75s ease-in-out infinite alternate",
                    }}
                  />
                  <ellipse
                    cx="50" cy="44"
                    rx="6" ry="8"
                    fill="#D4A574"
                    style={{
                      transformOrigin: "44px 40px",
                      animation: "armWave 0.75s ease-in-out infinite alternate-reverse",
                    }}
                  />
                  
                  {/* Feet */}
                  <ellipse cx="24" cy="58" rx="6" ry="4" fill="#C4956A" />
                  <ellipse cx="40" cy="58" rx="6" ry="4" fill="#C4956A" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Under Maintenance
              </h1>

              <p className="text-lg text-gray-600 mb-2">
                We're currently working on improvements
              </p>

              <p className="text-sm text-gray-500">
                Our server is temporarily unavailable. We apologize for the inconvenience.
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    {canRetry ? "Ready to retry!" : "Please wait"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`bg-white px-4 py-2 rounded-lg border font-mono text-xl font-bold transition-colors duration-300 ${
                      canRetry 
                        ? "border-green-300 text-green-600" 
                        : "border-gray-200 text-blue-600"
                    }`}>
                      {canRetry ? "✓" : `${countdown}s`}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 transition-all duration-1000 ease-linear ${
                      canRetry ? "bg-green-500" : "bg-blue-600"
                    }`}
                    style={{
                      width: `${((30 - countdown) / 30) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleRetry}
                disabled={!canRetry || isRetrying}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  canRetry && !isRetrying
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transform hover:scale-[1.02]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <RefreshCw
                  className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`}
                />
                {isRetrying 
                  ? "Retrying..." 
                  : canRetry 
                    ? "Retry Now" 
                    : `Wait ${countdown}s to retry`
                }
              </button>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">
                  If the problem persists, please contact our support:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
                  <a
                    href="mailto:portal@epa.gov.gh "
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    portal@epa.gov.gh 
                  </a>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <a
                    href="tel:+233302664697"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    +233 302 664 697
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 w-full">
              <p className="text-xs text-gray-400">
                Environmental Protection Authority © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes teddyDance {
          0%, 100% {
            transform: rotate(-5deg) translateY(0);
          }
          25% {
            transform: rotate(5deg) translateY(-3px);
          }
          50% {
            transform: rotate(-5deg) translateY(0);
          }
          75% {
            transform: rotate(5deg) translateY(-3px);
          }
        }
        
        @keyframes armWave {
          0% {
            transform: rotate(-15deg);
          }
          100% {
            transform: rotate(15deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Maintenance;