import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductDescription = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-3 py-3 border-t border-border">
      <h2 className="text-base font-bold mb-2">
        Aparelho de Jantar e Chá Porcelana 30 Peças Ryo Maresia Oxford
      </h2>

      <p className="text-sm text-foreground/80 mb-3">
        O wabi-sabi é um conceito japonês que valoriza o imperfeito. A coleção Ryo Maresia traz uma composição que valoriza a beleza das praias, o toque da areia e o frescor do mar.
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
              <li>• 06 Pratos Rasos 27,5 cm</li>
              <li>• 06 Pratos Fundos 22,5 cm</li>
              <li>• 06 Pratos de Sobremesa 21,5 cm</li>
              <li>• 06 Xícaras de Chá 220 ml</li>
              <li>• 06 Pires de Chá 16 cm</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Garantia: 90 dias contra defeitos de fabricação.
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

export default ProductDescription;
