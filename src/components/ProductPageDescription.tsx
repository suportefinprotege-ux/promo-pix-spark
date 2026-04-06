import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductPageDescription = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-3 py-3">
      <h2 className="text-sm font-bold mb-2 uppercase">
        CONJUNTO DE PRATOS FUNDOS COM 06 PEÇAS 22,5CM RYO MARESIA OXFORD
      </h2>

      <p className="text-sm text-foreground/80 mb-3">
        O wabi-sabi é um conceito japonês que valoriza o imperfeito, do processo de criação até o seu acabamento. Exaltar o irregular, o impermanente e o incompleto é uma homenagem da linha Ryo à esta sabedoria japonesa. A coleção Ryo Maresia traz uma composição que valoriza a beleza das praias, o toque da areia e o frescor do mar.
      </p>

      {expanded && (
        <div className="space-y-3 text-sm text-foreground/80">
          <p>
            Todas as peças da coleção Ryo Maresia recebem aplicação de esmalte com pigmentação e de um filete reagente aplicado de forma manual garantindo a unicidade de cada peça. Produzido em porcelana, o conjunto de pratos fundos Ryo Maresia é composto por 6 pratos fundos, que podem ser levados ao micro-ondas e à máquina de lavar louças.
          </p>

          <p className="text-xs text-muted-foreground">
            OBS.: Peças decoradas manualmente, cada uma com sua singularidade, trazendo uma arte única e especial.
          </p>

          <div>
            <h3 className="font-bold text-foreground mb-1">Itens Inclusos:</h3>
            <p>06 Pratos Fundos - 22,5cm.</p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-1">Características Gerais do Produto:</h3>
            <ul className="space-y-1">
              <li>- Decoração: Branco com Dourado;</li>
              <li>- Formato: Sinuoso;</li>
              <li>- Material: Porcelana;</li>
              <li>- Resistente a Micro-Ondas e Lava-Louças: Sim;</li>
            </ul>
          </div>

          <p>
            <span className="font-bold text-foreground">Garantia:</span> 03 Meses Contra Defeitos De Fabricação.
          </p>

          <p className="font-bold text-foreground text-sm">
            Todos os nossos produtos são novos e originais, acompanham nota fiscal, que é enviada juntamente com a sua compra.
          </p>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center gap-1 text-foreground text-sm font-medium mt-3 w-full"
      >
        {expanded ? "Ver menos" : "Ver mais"}
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ProductPageDescription;
