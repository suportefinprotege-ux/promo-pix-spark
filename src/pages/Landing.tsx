import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, CheckCircle2, Star, Package } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Verificando disponibilidade...",
    "Reservando oferta exclusiva...",
    "Validando cupom de desconto...",
    "Preparando sua experiência...",
    "Oferta liberada!",
  ];

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setLoadingComplete(true);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(stepInterval);
  }, []);

  const handleEnter = () => {
    navigate("/loja");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center px-4 text-white">
      {/* Logo / Brand */}
      <div className="mb-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
          <Package className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Ofertas Exclusivas</h1>
        <p className="text-sm text-gray-400 mt-1">Acesso liberado por tempo limitado</p>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-sm bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              background: loadingComplete
                ? "linear-gradient(90deg, #22c55e, #16a34a)"
                : "linear-gradient(90deg, #f97316, #ef4444)",
            }}
          />
        </div>

        {/* Step Text */}
        <div className="flex items-center gap-2 justify-center min-h-[24px]">
          {loadingComplete ? (
            <CheckCircle2 className="w-4 h-4 text-green-400 animate-scale-in" />
          ) : (
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          )}
          <span
            className={`text-sm font-medium ${
              loadingComplete ? "text-green-400" : "text-gray-300"
            }`}
          >
            {steps[currentStep]}
          </span>
        </div>

        {/* Percentage */}
        <p className="text-center text-2xl font-bold mt-3">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>Site Seguro</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Lock className="w-4 h-4 text-green-400" />
          <span>Dados Protegidos</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>4.7 ★</span>
        </div>
      </div>

      {/* CTA Button */}
      {loadingComplete ? (
        <button
          onClick={handleEnter}
          className="w-full max-w-sm py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 animate-scale-in active:scale-95 transition-transform"
        >
          🔓 ACESSAR OFERTAS
        </button>
      ) : (
        <button
          disabled
          className="w-full max-w-sm py-4 bg-white/10 text-gray-500 font-bold text-lg rounded-xl cursor-not-allowed"
        >
          Aguarde...
        </button>
      )}

      {/* Footer Info */}
      <p className="text-[10px] text-gray-600 mt-6 text-center max-w-xs">
        Ao acessar, você concorda com nossos termos de uso e política de privacidade.
      </p>
    </div>
  );
};

export default Landing;
