<script>
  import NormaFrame from "../lib/NormaCodeFrame.svelte";
</script>

<div class="section">
  <h2>Maquina Norma</h2>
  <span
    >Maquina Norma é uma maquina de registradores proposta por Richard Bird em
    seu livro <i
      >Programs and Machines: An Introduction to the Theory of Computation</i
    > em 1976, essa maquina foi disseminada no estudo de teoria da computação e atualmente
    é muito utilizada por universidades brasileiras para o estudo desse conteúdo.
    Essa máquina funciona manipulando os valores guardados nos registradores atravez
    de comandos para incrementar ou decrementar o conteúdo e também permite fazer
    desvio de fluxo condicional conforme os registradores.
  </span>
</div>

<div class="section">
  <h2>Comandos</h2>
  <div class="subsection">
    <h3>Incremento</h3>
    <span
      >Na implementação da linguagem aceita por essa ferramenta o incremento de
      um registrador é feito usando o comando INC. A baixo pode ser conferido o
      diagrama de sintaxe do comando.</span
    ><br />
    <img src="inc.svg" alt="Diagrama de sintaxe do comando de incremento" />
    <div>
      Exemplo
      <div class="Frame">
        <NormaFrame
          slim
          fixedProgram={"inc a // Incrementa o registrador 'a'\ninc a // Incrementa o registrador 'a'\ninc a // Incrementa o registrador 'a'"}
        />
      </div>
    </div>
  </div>
  <div class="subsection">
    <h3>Decremento</h3>
    <span
      >Na implementação da linguagem aceita por essa ferramenta o decremento de
      um registrador é feito usando o comando DEC. A baixo pode ser conferido o
      diagrama de sintaxe do comando.
    </span><br />
    <img src="dec.svg" alt="Diagrama de sintaxe do comando de decremento" />
    <div>
      Exemplo
      <div class="Frame">
        <NormaFrame
          slim
          fixedProgram={"inc a // Incrementa o registrador 'a' (Apenas para demonstrar o decremento) \ninc a // Incrementa o registrador 'a' (Apenas para demonstrar o decremento)  \ndec a // Decrementa o registrador 'a' \ndec a // Decrementa o registrador 'a' \ndec a // Decrementa o registrador 'a' (Atenção na maquina norma os registradores somente permitem numeros naturais, portanto ao decrementar zero o registrador não ficará negativo)"}
        />
      </div>
    </div>
  </div>
  <div class="subsection">
    <h3>Saltos condicionais</h3>
    <span
      >Na implementação da linguagem aceita por essa ferramenta o salto
      condicional foi divido em dois comandos, com comparação igual e diferente
      a zero</span
    ><br />
    <h4>Igual</h4>
    <span
      >No caso da comparação igual a zera o comando a ser utilizado é o IFZ</span
    ><br />
    <img src="ifz.svg" alt="Diagrama de sintaxe do comando de ifz" />
    <div>
      Exemplo
      <div class="Frame">
        <NormaFrame
          slim
          fixedProgram={"ifz a (2,3)// Se o registrador 'a' está zerado vai para linha número 2 senão vai para linha número 3\ninc a (1)// Incrementa 'a' e vai para linha 1"}
        />
      </div>
    </div>
    <h4>Diferente</h4>
    <span
      >No caso da comparação igual a zera o comando a ser utilizado é o IFNZ</span
    ><br />
    <img src="ifnz.svg" alt="Diagrama de sintaxe do comando de ifnz" />
    <div>
      Exemplo
      <div class="Frame">
        <NormaFrame
          slim
          fixedProgram={"ifnz a (3,2)// Se o registrador 'a' não está zerado vai para linha número 2 senão vai para linha número 3\ninc a (1) //incrementa a"}
        />
      </div>
    </div>
  </div>
</div>

<div class="section">
  <h2>Outros aspectos da linguagem</h2>
  <h3>Linha Nomeada</h3>
  <span
    >Para facilitar a escrita dos programas é disponibilizado um recurso que
    permite nomear um linha</span
  ><br />
  <img src="statement.svg" alt="Diagrama de sintaxe de declarações" />

  <div>
    Exemplo
    <div class="Frame">
      <NormaFrame
        slim
        fixedProgram={"start:ifnz a (end,step)\nstep:inc a (start)\nend:"}
      />
    </div>
  </div>
</div>

<style>
  .section {
    padding: 20px;
    margin: 20px 0;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .subsection {
    padding: 20px;
    margin: 20px 0;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* H2 style */
  h2 {
    font-size: 2.5rem;
    font-weight: 100;
    color: #dd2c00;
    margin: 1.5rem 0 1rem;
    text-transform: uppercase;
  }

  /* H3 style */
  h3 {
    font-size: 2rem;
    font-weight: 100;
    color: #ff5722;
    margin: 1rem 0 0.5rem;
  }

  /* H4 style */
  h4 {
    font-size: 1.5rem;
    font-weight: 100;
    color: #ff8a65;
    margin: 0.5rem 0;
  }
</style>
