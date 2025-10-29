---
authors:        hytalo_bassi
layout:         post
title:          "Instalando o simulador gem5 no Ubuntu"
date:           2025-10-22 7:00:00 -0400
categories:     SoftwareDevelopment
description:    "Aprenda como instalar o simulador gem5 no Ubuntu"
---

## O que é o simulador gem5?

O gem5 é um simulador de arquitetura de computadores. Ele auxilía o estudo e testes  de arquiteturas específicas ou customizadas de CPU. Além disso, ele vem acompanhado de modelos de CPU customizáveis, simulação de cache e memória, e também estatísticas de performance.

## Como instalar no Ubuntu

A instalação a seguir foi realizada em um Ubuntu 24.04, para versões mais antigas é recomendado ler o [site oficial (em inglês)](https://www.gem5.org/documentation/general_docs/building).

> Os passos foram retirados do [repositório oficial do gem5](github.com/gem5/gem5). Para instalar em outras plataformas você deve achar as dependências descritas abaixo para sua plataforma. Tirando isso, o processo de instalação é o mesmo.

### Instalando as dependências

```bash
sudo apt update # sempre bom estar com os repositórios atualizados antes de baixar qualquer coisa
sudo apt upgrade
sudo apt install build-essential scons python3-dev git pre-commit zlib1g zlib1g-dev \
    libprotobuf-dev protobuf-compiler libprotoc-dev libgoogle-perftools-dev \
    libboost-all-dev  libhdf5-serial-dev python3-pydot python3-venv python3-tk mypy \
    m4 libcapstone-dev libpng-dev libelf-dev pkg-config wget cmake doxygen clang-format
```

> O motivo de baixar cada uma dessas dependências está descrito no [site oficial (em inglês)](https://www.gem5.org/documentation/general_docs/building).

### Baixando o repositório

Para baixar o código-fonte do gem5:
```bash
git clone --single-branch --depth=1 https://github.com/gem5/gem5
cd gem5
```

### Construindo o gem5 para RISC-V

```bash
scons build/RISCV/gem5.opt -j $(nproc) # detecta número de cores disponíveis
# ou ainda scons build/{ISA}/gem5.{variant} -j {cpu}
# sendo {ISA} algum Instruction Set Architecutre válido, {variant} uma variante do ISA e {cpu} o número de cores
# para realizar a build. Mais informações abaixo:
```

Estamos fazendo a build para o RISC-V utilizando a variante `opt`. No entanto, é possível escolher entre todas estas ISAs listadas aqui abaixo (escolha a que for melhor para o seu caso):

- ALL - instala todas as ISAs disponíveis e têm todos os protocolos Ruby
- ARM - instala a ISA do ARM
- NULL
- MIPS
- POWER
- RISCV - essa que estamos utilizando agora (baixa tanto a versão de 32 bits como a de 64)
- SPARC
- X86


Já para a variante temos:

- **debug**: focada para ser utilizado com ferramentas como o `gdb` e `valgrind`, é mais lento;
- **opt**: mais otimizada que a **debug**, porém mantendo algumas informações úteis;
- **fast**: a mais otimizada de todas, utilizada apenas quando você já tem certeza que tudo está funcionando.

> Observação: a compilação pode levar +2 hrs dependendo do seu hardware.

## Utilizando o gem5

Depois de instalado e tudo ter dado certo, podemos fazer um simples `Hello World!` teste assim:

```bash
build/RISCV/gem5.opt configs/learning_gem5/part1/simple-riscv.py
```

Se tudo tiver dado certo, ele deve ter imprimido `Hello World!`.

> Observação: a CPU utilizada neste exemplo anterior foi a de 64 bits.

### Estatísticas do gem5

O gem5 gera automaticamente vários arquivos de estatísticas da simulação depois de simular alguma coisa. Todos os arquivos de estatísticas estão disponíveis na pasta `m5out/`. Dentre todos os arquivos, os que vamos lidar mais são:

- `config.ini`: guardam informações a cerca do tipo de CPU, a ISA utilizada, cache disponível, quantidade de bits e muito mais. Ajuda a saber se você está simulando o que deveria estar.
- `stats.txt`: guardam as estatística da simulação, como o tempo da simulação, número de ticks, ciclos da CPU, IPC (Instructions Per Cycle) da CPU, informações sobre a Cache L1 e outros. É o arquivo mais importante para se utilizar.


#### Entendendo as métricas

No arquivo `stats.txt` você verá diversas métricas e informações úteis dependendo do seu caso. Na maioria dos casos, não precisamos saber algumas certas informações em detalhes, porém métricas como tempo de simulação e uso do cache geralmente
são úteis. 

As métricas seguem esta síntaxe:

```
<nome da métrica>       <valor da métrica>
```

Exemplo:

```
simSeconds                      0.000076
simInsts                        111732
...
```

As métricas mais úteis são:

- `system.cpu.numCycles`: número total de ciclos
- `simSeconds`: tempo total da simulação em segundos
- `simInsts`: número total de instruções simuladas
- `system.cpu.ipc`: Instructions-per-Cycle

Outras métricas que podem ser úteis são referentes ao tipo de instruções:

- `system.cpu.commitStats0.numFpInsts`: Número de instruções float
- `system.cpu.commitStats0.numIntInsts`: Número de instruções inteiras
- `system.cpu.commitStats0.numLoadInsts`: Número de instruções de carregamento
- `system.cpu.commitStats0.numStoreInsts`: Número de instruções de armazenamento
- `system.cpu.commitStats0.numVecInsts`: Número de instruções de vetores.

### Compilando um programa e simulando no gem5

Vamos para a parte mais interessante, como executar um programa no `gem5`. Como estamos usando o RISC-V precisamos compilar algum programa utilizando o compilador do RISC-V. Para isso, baixe ou construa a ferramente `riscv64-linux-gnu-gcc`:

```bash
sudo apt install gcc-riscv64-linux-gnu
```

Depois disso, escreva um simples código `c`:

```c
// test.c
#include <stdio.h>

int main() {
    int a = 5;
    int b = 3;

    printf("O resultado é %d", a+b);
    return 0;
}
```

E compile:
```bash
riscv64-linux-gnu-gcc -static test.c -o test.elf
```

Então simule com o gem5:
```bash
build/RISCV/gem5.opt configs/deprecated/example/se.py --cpu-type=AtomicSimpleCPU --mem-type=SimpleMemory  --mem-size=512MB --cmd=./test.elf
```

## Adicionando novas instruções no gem5

> Esta seção ainda está em construção e necessita de melhor desenvolvimento sobre como adicionar novas instruções no gem5 e especificação do formato do `decoder.isa`.

Para adicionarmos uma nova instrução, é necessário alterar o arquivo `src/arch/riscv/isa/decoder.isa` do gem5. Este arquivo contém todas as instruções que o gem5 reconhece, juntamente com sua implementação. O gem5 usa um formato próprio `.isa` para descrever o comportamento das instruções. 

Quando vamos colocar uma nova instrução é necessário saber qual será o tipo dela, para então saber por no `decoder.isa`. Estes são os alguns dos tipos de instrução:


| **Tipo**              |          **Opcode (Binário)**          | **Usado para**                                                                                        | **Instruções de exemplo**                       | **Nome no Gem5** |
| :-------------------- | :-----------------------------------: | :------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :--------------------------------------- |
| **R-type**            |               `0110011`               | Usado para aritmética com registradores. Requer dois registradores de informação e um de destino.            | `add`, `sub`, `and`, `or`, `sll`, `slt`, `mul` | `ROp`                                  |
| **I-type**            | `0010011`, `0000011`, `1100111`, etc. | Usado para aritmética imediata, carregamento e alguns controles de fluxo (JALR). Tem um registrador de informação e um imediato | `addi`, `andi`, `lw`, `jalr`, `lb`             | `IOp`                                  |
| **S-type**            |               `0100011`               | Usado para armazenar o resultado de instruções.                                               | `sw`, `sb`, `sh`                               | `Store`                                  |
| **B-type**            |               `1100011`               | Usados para fluxo condicional. O imediato controla o fluxo.                                               | `beq`, `bne`, `blt`, `bge`                     | `BOp`                                  |

```python
0x0c: decode FUNCT3 {
            format ROp {
                0x0: decode KFUNCT5 {
                    0x00: decode BS {
                        0x0: add({{
                            Rd = rvSext(Rs1_sd + Rs2_sd);
                        }});
                        0x1: sub({{
                            Rd = rvSext(Rs1_sd - Rs2_sd);
                        }});
                    }
...
```
