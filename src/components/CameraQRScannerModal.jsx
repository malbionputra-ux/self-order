import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Flashlight, SwitchCamera, Upload, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CameraQRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  useEffect(() => {
    let currentStream = null;

    if (isOpen) {
      setCameraError(null);
      setScannedResult(null);

      // Attempt to access live camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode } 
        })
        .then((mediaStream) => {
          currentStream = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable:', err);
          setCameraError('Kamera fisik tidak terdeteksi atau izin belum diberikan. Mode Simulasi Kamera aktif!');
        });
      } else {
        setCameraError('Browser ini belum mendukung akses kamera langsung.');
      }
    } else {
      // Stop camera tracks when closed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleSimulateScan = (scannedTable = '08') => {
    setScannedResult(`Meja #${scannedTable}`);
    setTimeout(() => {
      onScanSuccess(scannedTable);
      onClose();
    }, 1200);
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-[#1A1412] rounded-3xl overflow-hidden w-full max-w-md shadow-2xl border border-white/10 flex flex-col relative text-white"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#2C221E]">
            <div className="flex items-center gap-2 font-brand font-bold text-sm text-white">
              <Camera className="w-4 h-4 text-[#C85A32]" />
              <span>Pindai QR Code Meja</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C85A32] text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Camera Viewfinder Area */}
          <div className="relative w-full h-80 bg-black flex items-center justify-center overflow-hidden">
            {/* Live Video Feed if camera available */}
            {!cameraError && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {/* Simulated Live Camera Backdrop if physical camera absent */}
            {cameraError && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2C221E] via-[#1A1412] to-black flex flex-col items-center justify-center p-6 text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-[#C85A32]/20 border border-[#C85A32]/50 flex items-center justify-center mb-3 shadow-lg shadow-[#C85A32]/30"
                >
                  <Camera className="w-10 h-10 text-[#C85A32]" />
                </motion.div>
                <span className="text-xs font-brand text-white/80 font-bold mb-1">
                  Kamera Viewfinder Aktif
                </span>
                <p className="text-[11px] text-white/50 leading-relaxed max-w-xs">
                  {cameraError}
                </p>
              </div>
            )}

            {/* Scanner Square Target Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-60 h-60 border-2 border-white/30 rounded-3xl relative shadow-2xl">
                {/* Corner Brackets */}
                <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-[#C85A32] rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-[#C85A32] rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-[#C85A32] rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-[#C85A32] rounded-br-xl" />

                {/* Laser Moving Scan Line */}
                <motion.div
                  animate={{ y: [0, 230, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-1 bg-gradient-to-r from-transparent via-[#C85A32] to-transparent shadow-lg shadow-[#C85A32]"
                />
              </div>
            </div>

            {/* Success Overlay when scanned */}
            <AnimatePresence>
              {scannedResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#C85A32]/90 backdrop-blur-md flex flex-col items-center justify-center text-white z-20"
                >
                  <CheckCircle2 className="w-16 h-16 text-white mb-2" />
                  <span className="font-brand font-extrabold text-lg">QR Code Terdeteksi!</span>
                  <span className="font-mono font-bold text-sm bg-white/20 px-3 py-1 rounded-full mt-1">
                    {scannedResult}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls Bar at bottom of viewfinder */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setIsTorchOn(!isTorchOn)}
                className={`p-2.5 rounded-full backdrop-blur-md border border-white/20 text-white transition-colors ${
                  isTorchOn ? 'bg-amber-400 text-black' : 'bg-black/50'
                }`}
              >
                <Flashlight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={toggleFacingMode}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                <SwitchCamera className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Quick Simulation Options Footer */}
          <div className="p-4 bg-[#2C221E] space-y-2 border-t border-white/10">
            <span className="text-[11px] text-white/60 font-brand font-bold block text-center uppercase tracking-wider">
              SIMULASI PINDAI MEJA
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['01', '08', '12'].map((tbl) => (
                <motion.button
                  key={tbl}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleSimulateScan(tbl)}
                  className="bg-[#C85A32]/20 hover:bg-[#C85A32] text-white font-brand font-bold py-2.5 px-3 rounded-xl border border-[#C85A32]/40 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" /> Meja #{tbl}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
