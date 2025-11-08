---
authors:        hytalo_bassi
layout:         post
title:          "Instalando o simulador gem5 no Ubuntu"
date:           2025-10-22 7:00:00 -0400
categories:     SoftwareDevelopment
image:          "instalando_gem5_no_ubuntu-imagem_gerada_por_chatgpt.png"
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

Neste artigo, estaremos primariamente trabalhando na arquitetura RISC-V 32-bits, mas outras arquiteturas também são suportadas.

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

Depois de instalado e tudo ter dado certo, podemos fazer um simples teste `Hello World!` assim:

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

#### Estatísticas de energia

Por padrão, o gem5 não pega informações de energia

### Compilando um programa e simulando no gem5

Vamos para a parte mais interessante, como executar um programa no `gem5`. Como estamos usando o RISC-V precisamos compilar algum programa utilizando o compilador do RISC-V. Como estamos usando o RISC-V Bare-Metal de 32-bits, é necessário instalar a [`riscv-gnu-toolchain`](https://github.com/riscv-collab/riscv-gnu-toolchain) antes para compilar.


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
# você pode usar qualquer compilador aqui desde que seja o que você precisa e o gem5 tenho a arquitetura.
riscv32-unknown-elf-gcc test.c -O1 -march=rv32imafdc -o test 
```

Então simule com o gem5:
```bash
build/RISCV/gem5.opt configs/deprecated/example/se.py --cpu-type=AtomicSimpleCPU --mem-type=SimpleMemory  --mem-size=512MB --cmd=./test.elf
```

Você já deve ter percebido que o estamos usando uma configuração depreciada `configs/deprecated/example/se.py`. Estamos a usando aqui pois ela ainda funciona. Mas se você quer trabalhar seriamente com o gem5, vai ter que configurar ele do seu jeito...

### Configurando o gem5

O gem5 utiliza de uma interface de configuração em python para criar os modelos de CPU adequados, delimitando a memória e tudo necessário para simular.

Para configurar o gem5 é simples, basta criarmos um arquivo python e usá-lo quando quisermos usar a configuração:

```python
# simple_config.py
import m5
from m5.objects import *

binary = './test/approx' # troque pelo caminho do seu binário ou receba-o pelo CLI
system = System()
system.clk_domain = SrcClockDomain(clock='1GHz', voltage_domain=VoltageDomain())
system.mem_mode = 'atomic'
system.mem_ranges = [AddrRange('8192MiB')]
system.cpu = AtomicSimpleCPU()
system.cpu.numThreads = 1  
system.cpu.isa = [RiscvISA(riscv_type='RV32')] 
system.cpu.interrupts = [RiscvInterrupts()]  
system.membus = SystemXBar()
system.cpu.icache_port = system.membus.cpu_side_ports
system.cpu.dcache_port = system.membus.cpu_side_ports
system.system_port = system.membus.cpu_side_ports
system.mem_ctrl = MemCtrl()
system.mem_ctrl.dram = DDR3_1600_8x8()
system.mem_ctrl.dram.range = system.mem_ranges[0]
system.mem_ctrl.port = system.membus.mem_side_ports
system.workload = SEWorkload.init_compatible(binary)

process = Process()
process.cmd = [binary]
system.cpu.workload = process
system.cpu.createThreads()

root = Root(full_system=False, system=system)
m5.instantiate()
m5.simulate()
```

Estaremos utilizando esta configuração nas próximas seções do artigo. Para entender como funciona esta configuração e como configurar mais coisas, clique [aqui](https://www.gem5.org/documentation/learning_gem5/part1/simple_config/).

## Adicionando novas instruções no gem5

Você aprenderá nesta seção como o RISC-V define uma instrução, a forma que uma instrução tem na máquina, como fazer com que o gem5 reconheça e entenda a instrução, e adicionando uma instrução do tipo R no gem5.

### Entendendo como o RISC-V vê as instruções

O RISC-V divide as instruções em tipos, tendo cada tipo sua peculiaridade e contexto. Da mesma forma, o gem5 precisa entender o tipo de uma instrução para conseguir simulá-la. Abaixo está uma tabela com alguns dos tipos que o RISC-V usa, para que serve, algumas instruções que usam este tipo e como o gem5 chama este tipo:

| **Tipo**              |          **Opcode (Binário)**          | **Usado para**                                                                                        | **Instruções de exemplo**                       | **Nome no Gem5** |
| :-------------------- | :-----------------------------------: | :------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :--------------------------------------- |
| **R-type**            |               `0110011`               | Usado para aritmética com registradores. Requer dois registradores de informação e um de destino.            | `add`, `sub`, `and`, `or`, `sll`, `slt`, `mul` | `ROp`                                  |
| **I-type**            | `0010011`, `0000011`, `1100111`, etc. | Usado para aritmética imediata, carregamento e alguns controles de fluxo (JALR). Tem um registrador de informação e um imediato | `addi`, `andi`, `lw`, `jalr`, `lb`             | `IOp`                                  |
| **S-type**            |               `0100011`               | Usado para armazenar o resultado de instruções.                                               | `sw`, `sb`, `sh`                               | `Store`                                  |
| **B-type**            |               `1100011`               | Usados para fluxo condicional. O imediato controla o fluxo.                                               | `beq`, `bne`, `blt`, `bge`                     | `BOp`                                  |


Agora, como a instrução que iremos colocar é `R-type` devemos entender qual é a forma que uma instrução deste tipo assume na máquina. Abaixo está uma tabela com os nomes de cada parte que compõe a instrução (chamado bitfield) do tipo R, e quantos -- e quais -- bits são usados nela:

```csv
Divisão das partes (bitfields):
funct7 | rs2    | rs1    | funct3 | rd     | opcode | quadrant
31..25 | 24..20 | 19..15 | 14..12 | 11..7  | 6..2   | 1..0
```

Ou seja, uma instrução na máquina é apenas um grande número. Portanto, se uma instrução têm o número `02f585ab` em hexadecimal, para o RISC-V ela têm estes bitfields:

```csv
Divisão das partes:
funct7 | rs2    | rs1    | funct3 | rd     | opcode | quadrant
31..25 | 24..20 | 19..15 | 14..12 | 11..7  | 6..2   | 1..0

Divisão do nosso número:

02f585ab (hexa) -> 0000001 01111 01011 000 01011 01010 11 (binário dividido em bitfields)

funct7  | rs2   | rs1   | funct3 | rd    | opcode | quadrant
0000001 | 01111 | 01011 | 000    | 01011 | 01010  | 11

Quadrante  3 (3)
Opcode    26 (A)
Rd       585 (B) # varia de acordo com o registrador
Funct3     0 (0)
Rs1      585 (B) # varia de acordo com o registrador
Rs2      584 (F) # varia de acordo com o registrador
Funct7     1 (1)
```

> Observação: se você não sabe qual o número da instrução, mas já modificou o `riscv-gnu-toolchain` para suportar as suas instruções próprias, você pode descobrir o número assim:

```bash
riscv32-unknown-elf-gcc test.c -O1 -o test # compila o arquivo c utilizando a instrução
riscv32-unknown-elf-objdump -D test | grep "<nome da sua instrução>"
```

Isso deve retornar algo na seguinte forma:

```yaml
   101be: 02f585ab           <instrução> a5,a5,a4
[código_omitido]
```

O número da instrução é o que está no meio, neste caso `02f585ab`.

### Ensinando o gem5 a reconhecer e simular as instruções

Para adicionarmos uma nova instrução, é necessário alterar o arquivo `src/arch/riscv/isa/decoder.isa` do gem5. Este arquivo contém todas as instruções que o gem5 reconhece, juntamente com sua implementação. O gem5 usa um formato próprio `.isa` para descrever o comportamento das instruções. 

#### Síntaxe do `.isa`

A síntaxe `.isa` serve para reconhecer os padrões de instrução e saber diferenciar as instruções entre si. As keywords mais importantes para nós agora são responsáveis por reconhecer bitfields e formatos de instrução:

- `decode <NOME_DO_BITFIELD> [...] `: esta é responsável por ler bitfields.
- `format <FORMATO_DA_INSTRUÇÃO>`: esta é responsável por informar o tipo da instrução, o que muda a forma de implementação. 

Para ficar mais claro a função do `decode`, vamos olhar este exemplo:
{% raw %}
```python
# código muito simplificado
decode QUADRANT default Unknown::unknown() {
    0x3: decode OPCODE5 {
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
                }
            }
        }
    }
}
```
{% endraw %}

- O primeiro `decode QUADRANT` diz ao gem5 para ler os dois primeiros bits da instrução.
- Aninhado dentro do quadrante temos então `0x3: decode OPCODE5` que, para o gem5, significa que quando o `QUADRANT=0x3=0b11` ele vai começar a ler os 5 bits de 6..2 na instrução, que representa o bitfield opcode.
- Aninhado dentro do opcode temos `0x0c: decode FUNCT3`, que da mesma forma que a definição anterior vai começar a ler os 3 bits de 14..12.

Perceba também que, **os bitfields vão sendo decodificados da direita para a esquerda**, ou seja, primeiro vem o QUADRANT, segundo o OPCODE5, terceiro FUNCT3 e assim por diante até o FUNCT7 ou algum outro bitfield.

o `format ROp` apenas nos diz que a instrução é `R-Type`, portanto tem dois registradores de entrada `Rs1` e `Rs2` e um de destino `Rd`.

{% raw %}
E por útlimo, quando todos os campos da instrução foram definidos temos `0x0: add({{...}})`, onde o `0x0` é o último campo da instrução. É aqui que o gem5 realmente entende como simular a instrução.
Dentro de `add({{...}}` temos duas informações: 1. o nome da instrução, `add`; 2. a implementação da instrução dentro de `{{...}}`. A implementação é escrita em `C`.
{% endraw %}

#### Adicionando a instrução `addx`

Agora vamos por a mão na massa e escrever uma instrução de fato no gem5. Vamos usar a instrução de computação aproximada `addx` ([objeto de estudo](https://github.com/danielacatelan/Approximate-Instructions/blob/main/docs/APPROX_SETUP_PART_1.md)) que tinhamos descoberto a tabela de bitfields anteriormente:

```csv
02f585ab (hexa) -> 0000001 01111 01011 000 01011 01010 11 (binário dividido em bitfields)

funct7  | rs2   | rs1   | funct3 | rd    | opcode | quadrant
0000001 | 01111 | 01011 | 000    | 01011 | 01010  | 11

# ordem de decodificação
Quadrante  3 (3)
Opcode    10 (A)
Funct3     0 (0)
Funct7     1 (1)
```

A tabela já nos dá uma pista de como o `src/arch/riscv/isa/decoder.isa` deve estar. Primeiro decodificamos o QUADRANT para o valor `0x3`, depois decodificamos o OPCODE5 com o valor `0xa`, o FUNCT3 com `0x0` e por último o FUNCT7 com `0x1`.

Sendo assim, vamos procurar onde será o melhor lugar para colocar nossa instrução. Ao ler o arquivo vemos que algumas das decodificações já estão definidas:

{% raw %}
```python
[código_simplificado]
decode QUADRANT default Unknown::unknown() {
    [outras_definições]
    0x3: decode OPCODE5 {
        [mais_definições_de_instruções]
        [aqui_começa_a_instrução_addx]
        0xa: decode FUNCT3 {
          format ROp {
            0x0: decode FUNCT7 {
              0x1: addx({{ Rd_sd = Rs1_sd ^ Rs2_sd; }});
            }
          }
        }
        [aqui_termina_a_instrução_addx]
        [mais_definições_de_instruções]
    }
}
```
{% endraw %}

Entre `[aqui_começa_a_instrução_addx]` e `[aqui_termina_a_instrução_addx]` temos a instrução customizada `addx` que escrevemos. Perceba aqui que o `0xa` vem da nossa tabela e representa o `OPCODE5=0xa=0b01010`, como também o `0x0` representa o FUNCT3 e `0x1` o FUNCT7 (o bitfield mais a esquerda).

Com isso, já podemos fechar o arquivo e salvá-lo. Agora, para que as modificações entrem em ação precisamos reconstruir o `gem5`:

```bash
scons build/RISCV/gem5.opt -j $(nproc)
```

Depois de construído, já podemos testar.

#### Testando a instrução `addx`

Para garantirmos que as instruções estão realmente funcionando, vamos criar um programa em C utilizando a instrução, compilar com o devido compilador do RISC-V, e depois testar no gem5.

Primeiro, escreva o programa teste em `c`:

```c
// approx.c
#include <stdio.h>

int main(){
    int a, b, addx_result;
    a = 5;
    b = 2;
    
    asm volatile (
        "addx   %[z], %[x], %[y]\n\t"
        : [z] "=r" (addx_result)
        : [x] "r" (a), [y] "r" (b)
    );

    printf("ADDX => 5+2=%d\n", addx_result);
    return 0;
}
```

Segundo, compile o código e garanta que a instrução está no programa:

```bash
riscv32-unknown-elf-gcc approx.c -O1 -march=rv32imafdc -o approx 
riscv32-unknown-elf-objdump -D approx | grep addx # deve retornar alguma linha mostrando a instrução
```

Agora, só simular (estamos usando a configuração da [seção anterior](#configurando-o-gem5)):

```bash
build/RISCV/gem5.opt simple_config.py
```

Ele deve retornar, se tudo deu certo, algo parecido com:

```
ADDX => 5+2=7
```

> Este artigo foi inspirado grandemente por meio da documentação do gem5 e fórums onlines. Além disso, o artigo no Medium do Nick Felker ([Extending Gem5 with custom RISC-V commands](https://fleker.medium.com/extending-gem5-with-custom-risc-v-commands-653eeefe83b8)) foi extremamente precioso para adicionar novas instruções no gem5.
