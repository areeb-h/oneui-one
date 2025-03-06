"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getApp } from "@/lib/actions/apps";
import { 
  ArrowLeft, Shield, AlertTriangle, Loader2, 
  RefreshCcw, Command, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppViewer() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load app data
  useEffect(() => {
    let mounted = true;

    async function fetchAppDetails() {
      try {
        setLoading(true);
        const appData = await getApp(slug);
        
        if (!mounted) return;

        if (!appData) {
          setError("Application not found");
        } else {
          setApp(appData);
          document.title = `${appData.name} - OneUI`;
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load app");
          console.error(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAppDetails();
    
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Function to handle iframe reload without page refresh
  const handleReloadApp = () => {
    if (iframeRef.current) {
      setIsAppLoaded(false);
      try {
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = "about:blank";
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc;
          }
        }, 100);
      } catch (error) {
        console.error("Error reloading iframe:", error);
        setIsAppLoaded(true);
      }
    }
  };

  // Function to toggle controls
  const handleToggleControls = () => {
    setShowControls(prev => !prev);
  };

  // Function to navigate back
  const handleGoBack = () => {
    router.push('/dashboard/apps');
  };

  // Error state
  if (error || !app) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="max-w-md w-full bg-card p-8 rounded-xl border shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Application Error</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The application could not be found"}
            </p>
            <Button size="lg" onClick={() => router.push('/dashboard/apps')}>
              Return to Apps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-xl font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      {/* App Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-4 z-20 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border flex items-center"
      >
        <Shield className="h-3.5 w-3.5 mr-1.5 text-green-500" />
        <span className="text-xs font-medium">{app.name}</span>
        <span className="mx-1.5 text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">{app.status}</span>
      </motion.div>
      
      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 bg-card/95 backdrop-blur-sm border rounded-full shadow-lg flex"
          >
            <button
              className="h-10 px-4 flex items-center justify-center hover:bg-accent transition-colors rounded-l-full"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Back</span>
            </button>
            
            <div className="h-10 border-r mx-0.5"></div>
            
            <button
              className="h-10 px-4 flex items-center justify-center hover:bg-accent transition-colors"
              onClick={handleReloadApp}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              <span className="text-sm">Reload</span>
            </button>
            
            <div className="h-10 border-r mx-0.5"></div>
            
            <button
              onClick={handleToggleControls}
              className="h-10 px-4 flex items-center justify-center rounded-r-full bg-primary text-primary-foreground"
            >
              <ChevronUp className="h-4 w-4" />
              <span className="text-sm ml-2">Hide</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {!isAppLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 bg-background flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mb-6 relative"
              >
                <div className="h-20 w-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold text-primary">{app.name.charAt(0)}</span>
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 bg-green-100 dark:bg-green-950 rounded-full p-1 border border-green-200 dark:border-green-900"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </motion.div>
              </motion.div>
              <h2 className="text-xl font-medium mb-2">{app.name}</h2>
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Helper Button */}
      {!showControls && (
        <button
          ref={buttonRef}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 p-3 rounded-full shadow-lg bg-primary text-primary-foreground"
          onClick={handleToggleControls}
        >
          <Command className="h-5 w-5" />
        </button>
      )}

      {/* Main App Content */}
      <iframe
        ref={iframeRef}
        src={app.appUrl}
        title={app.name}
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
        allow="fullscreen"
        onLoad={() => setIsAppLoaded(true)}
      />
    </div>
  );
}