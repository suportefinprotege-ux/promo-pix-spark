import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const STORE_LOGO = "https://panpannovapromo.site/ofertas/pratos/images/logo_oxford.png";

const ProductPageDescription = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-3 py-3">
      {/* Store Info */}
      <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
        <img src={STORE_LOGO} alt="Oxford" className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Oxford</span>
            <span className="bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Loja Verificada</span>
          </div>
          <p className="text-xs text-muted-foreground">1706 produtos • 100% recomenda</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Confiança</p>
          <p className="text-success font-bold text-sm">100%</p>
        </div>
      </div>

      {/* Description */}
      <h2 className="text-base font-bold mb-2">
        Conjunto de Pratos Fundos Com 06 Peças 22,5cm Ryo Maresia Oxford
      </h2>

      <p className="text-sm text-foreground/80 mb-3">
        O wabi-sabi é um conceito japonês que valoriza o imperfeito, do processo de criação até o seu acabamento. Exaltar o irregular, o impermanente e o incompleto é uma homenagem da linha Ryo à esta sabedoria japonesa. A coleção Ryo Maresia traz uma composição que valoriza a beleza das praias, o toque da areia e o frescor do mar.
      </p>

      {expanded && (
        <div className="space-y-3 text-sm text-foreground/80">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Destaques do produto:</h3>
            <ul className="space-y-1">
              <li>✅ Pintura artesanal: tinta reagente aplicada à mão nas bordas</li>
              <li>✅ Peças únicas: variações intencionais que garantem exclusividade</li>
              <li>✅ Design inspirado na natureza: praias, areia e frescor do mar</li>
              <li>✅ Estética funcional: design elegante em branco, ergonômico</li>
              <li>✅ Durável e prático: resistente a micro-ondas e lava-louças</li>
              <li>✅ Fácil empilhamento</li>
              <li>✅ Produto original Oxford Porcelanas</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-1">Itens Inclusos:</h3>
            <ul className="space-y-1">
              <li>• 06 Pratos Fundos 22,5 cm</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-1">Características Gerais do Produto:</h3>
            <ul className="space-y-1">
              <li>- Decoração: Branco com Dourado;</li>
              <li>- Formato: Sinuoso;</li>
              <li>- Material: Porcelana;</li>
              <li>- Resistente a Micro-Ondas e Lava-Louças: Sim;</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Garantia: 03 Meses Contra Defeitos De Fabricação.
          </p>

          <p className="text-sm font-medium">
            🚚 Envio rápido e seguro para todo o Brasil!
          </p>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-primary text-sm font-medium mt-2"
      >
        {expanded ? "Ver menos" : "Ver mais"}
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ProductPageDescription;
