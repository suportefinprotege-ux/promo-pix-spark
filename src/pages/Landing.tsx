import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import logo from "@/assets/achados-da-rita-logo.png";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#FFFFFF" }}>
      
      {/* Clean white background - no decorative elements */}

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-sm">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src={logo} 
            alt="Achados da Rita" 
            className="w-72 h-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Progress Section */}
        <div className="rounded-2xl p-5 mb-5 border" style={{ background: "rgba(255,255,255,0.7)", borderColor: "rgba(196,139,110,0.2)" }}>
          {/* Progress Bar */}
          <div className="w-full rounded-full h-3 mb-3 overflow-hidden" style={{ background: "rgba(196,139,110,0.15)" }}>
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: loadingComplete
                  ? "linear-gradient(90deg, #6B8E5A, #4A7A3A)"
                  : "linear-gradient(90deg, #C48B6E, #8B5E3C)",
              }}
            />
          </div>

          {/* Step Text */}
          <div className="flex items-center gap-2 justify-center min-h-[24px]">
            {loadingComplete ? (
              <CheckCircle2 className="w-4 h-4 animate-scale-in" style={{ color: "#4A7A3A" }} />
            ) : (
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#C48B6E", borderTopColor: "transparent" }} />
            )}
            <span className="text-sm font-medium" style={{ color: loadingComplete ? "#4A7A3A" : "#8B5E3C" }}>
              {steps[currentStep]}
            </span>
          </div>

          {/* Percentage */}
          <p className="text-center text-2xl font-bold mt-2" style={{ color: "#4A2C1A" }}>
            {Math.round(progress)}%
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex gap-4 justify-center mb-6">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8B7355" }}>
            <ShieldCheck className="w-4 h-4" style={{ color: "#6B8E5A" }} />
            <span>Site Seguro</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8B7355" }}>
            <Lock className="w-4 h-4" style={{ color: "#6B8E5A" }} />
            <span>Dados Protegidos</span>
          </div>
        </div>

        {/* CTA Button */}
        {loadingComplete ? (
          <button
            onClick={handleEnter}
            className="w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg animate-scale-in active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #C48B6E, #8B5E3C)", boxShadow: "0 8px 24px rgba(139,94,60,0.35)" }}
          >
            🛒 ACESSAR OFERTAS
          </button>
        ) : (
          <button
            disabled
            className="w-full py-4 font-bold text-lg rounded-xl cursor-not-allowed"
            style={{ background: "rgba(196,139,110,0.2)", color: "#C48B6E" }}
          >
            Aguarde...
          </button>
        )}

        {/* Footer */}
        <p className="text-[10px] mt-5 text-center" style={{ color: "#B8A08A" }}>
          Ao acessar, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </div>
  );
};

export default Landing;
