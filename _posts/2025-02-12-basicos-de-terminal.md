---
author: Hytalo M. Bassi
date: 12-02-2025 10:00 -04000
layout: post
title: "Comandos básicos de Terminal Linux"
categories: linux study
image: "terminal.jpg"
authors: hytalo_bassi
---

Uma das coisas que mais assustam os principiantes de Linux é seu terminal. Antigamente, instalar aplicativos, mudar a fonte
do sistema e outras coisas eram praticamente todas no terminal. Mesmo depois de muitos anos, os sistemas Linux se tornando algo mais popular e simples, conhecimento de terminal pode ajudar a realizar tarefas e automatizar rotinas.

{: toc }

## Linha de Comando

Se você estiver no Ubuntu, para abrir o terminal basta apertar `Ctrl+Alt+T`. Uma tela com fundo roxo e letras coloridas irá aparecer para você. Este é o terminal. 

![Terminal do Ubuntu](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pimylifeup.com%2Fwp-content%2Fuploads%2F2021%2F03%2FOpen-Terminal-on-Ubuntu-Using-Keyboard-Shortcut.jpg&f=1&nofb=1&ipt=2af4bb7af6172838121bf1a30b0aaab5da31be0bdff8d2a8ae9066cd117bc8bd&ipo=images)

Você provavelmente verá algo como isso aqui:

```bash
pimylifeup@pimylifeup:~$
```

A primeira parte, antes do `@` é o nome do usuário. Este usuário é quem realiza os comandos, cria arquivos privados e tudo mais. Na maioria dos casos, você tem dois usuários principais: o seu usuário e o **super-usuário** `root`. O `root` tem permissão de fazer tudo no sistema(apagar usuários, deletar arquivos, parar o computador, instalar ou deletar programas...).

A segunda parte, depois do `@` é o nome da máquina. Este nome, ou `hostname`, é para identificação na rede de internet na sua casa. Se você procurar os dispositivos conectados, você verá este nome.

A terceira parte, depois do `:` é a pasta que você está (aqui é `~`). No Linux, você realiza comandos dentro de pastas, sempre, de forma que você às vezes nem consegue perceber. As pastas ou diretórios são onde vários arquivos ficam juntos, existem várias pastas padrões, como a `~` e que tem um significado.

## Pastas

Agora que você entendeu a estrutura básica de uma linha de comando, vamos trabalhar um conceito muito útil. As **pastas**.

Pastas têm um nome e guardam arquivos, geralmente semelhantes, em um lugar só. Uma pessoa organizada prefere deixar PDFs na pasta `Documentos` e fotos na pasta `Imagens`. Estas são pastas padrões, algumas mais estão listadas aqui:

> {: .highlight }
> **`~`**
>
> Pasta do usuário, onde todos os arquivos e pastas que o usuário têm ficam guardadas.
> 
> **`~/Downloads`**
>
> Pasta dos Downloads do usuário, arquivos que você baixa da internet vêm para cá.

Você deve ter percebido que na pasta `~/Downloads` existe um `~/` antes de `Downloads`. Essa `/` representa uma hierarquia, significa que o que vem antes da `/` guarda o que vem depois, por exemplo: `~/Downloads/imagens/foto.jpg` traduz-se para:
a pasta de usuário guarda a pasta `Downloads` que guarda a pasta `imagens` que guarda o arquivo `foto.jpg`.

## Comandos

Agora que você sabe a estrutura da linha de comando e como funciona as pasta. Vamos para a parte mais divertida. Os **comandos**.

Comandos são ordens que você dá ao computador e ele obedece. Comandos podem imprimir informações na tela, matar processos, ligar ou desligar a internet, abrir aplicativos e muito mais.

### Listar arquivos e pastas

Com o terminal aberto, escreva:

```bash
ls
```

Provavelmente apareceu vários nomes coloridos. Estes nomes são arquivos e pastas e eles se diferenciam pela cor. Em verde estão os arquivos e em azul as pastas.

Agora digamos que você queira ver o conteúdo de outra pasta, a pasta dentro de `Downloads` chamada `imagens`. Podemos fazer o mesmo assim:

```bash
ls Downloads/imagens
```

Agora os arquivos e pastas em `~/Downloads/imagens` vão ser mostrados. Você pode querer mostrar cada arquivo em uma linha por vez:

```bash
ls -1 Downloads/imagens
```

Você ainda pode imprimir o tamanho, dono dos arquivos, tipo de arquivos e muito mais com o comando `ls`, vamos deixar para outra hora.

### Se movendo em pastas

Agora que você sabe ver quais arquivos e sub-pastas estão em qualquer pasta, vamos começar a entrar nestas pastas. Para entrar na pasta `Downloads/images` da mesma forma que anteriormente:

```bash
cd Downloads/images
```

Ou você pode subir a hierarquia da onde você está. Se você está em `Downloads/images` e quer ir para `Downloads`, você pode fazer de duas formas, uma chamada de relativa e outra absoluta:

```bash
cd ..
cd ~/Downloads
```

A primeira, com `..`, sobe a hierarquia a partir da onde você está. Se o caminho que você está é `~/Documentos/notas_fiscais/2025`, escrever `cd ..` vai te deixar antes da última barra, em `~/Documentos/notas_fiscais`

A segunda coloca o caminho completo, ela vai diretamente para onde você quer, não importa onde esteja. Se você está em `Downloads/` e quer ir para `Documentos/notas_fiscais` você pode escrever 

```bash
cd ~/Documentos/notas_fiscais
```

{: .important }
> **Voltando ao `ls` dentro de uma pasta**
>
> Se você escreveu `cd Downloads`, você está em `Downloads`. Agora, escrever `ls` vai te mostrar todo o conteúdo da pasta que você está, a `Downloads`. O `ls` sempre mostra o conteúdo da pasta que você está, se você escreve-lô sozinho.

## Criação, deleção e manipulação de ...

### Arquivos

Queremos escrever nossa rotina diária em um arquivo na pasta `Documents/`. Para isso, criamos o arquivo com:

```bash
touch Documents/rotina.txt
```

Pronto, agora precisamos escrever o arquivo. Existem várias formas que você pode escrever um arquivo; uma é usando um editor
que será o que iremos fazer, outra é utilizando um recurso avançado no terminal chamado [redirecionamento](https://www.gnu.org/software/bash/manual/html_node/Redirections.html).

De uma gama de editores (`nvim`, `vim`, `emacs` e outros) iremos utilizar o `nano`. Para abrirmos e editarmos o arquivo `rotina.txt` com o nano:

```bash
nano Documents/rotina.txt
```

Fazemos as edições e apertamos `Ctrl+W` e apertamos `Enter` e pronto.
Agora, para lermos o conteúdo do arquivo fazemos:

```bash
cat Documents/rotina.txt
```

E você irá ver o conteúdo no arquivo. *Perceba que o comando `cat`, `nano`, `touch` e todos os outros comandos que você irá usar na vida funcionam igual o `ls` para receber o caminho. Você pode escrever o caminho relativo se você já estiver em `Documents`.*

E por último, você decidiu mudar e não colocar sua rotina num arquivo. Para deletar ele podemos usar o `rm`:

```bash
rm Documents/rotina.txt
```

Guarde bem estes comandos, eles vão ser utilizados muitas e muitas vezes.

### Pastas

Você já aprendeu ler o conteúdo de uma pasta com `ls`. Falta criar, renomear ou mover e deletar.

Na nossa velha história, vamos supor que você queira guardar suas rotinas de segunda a segunda em 7 arquivos, como `rotina-segunda.txt` ou `rotina-sabado.txt` em uma pasta chamada `rotinas` em `Documents`:

{% highlight bash linenos %}
mkdir Documents/rotinas
touch Documents/rotinas-{segunda,terca,quarta,quinta,sexta,sabado,domingo}.txt
{% endhighlight %}

O `mkdir` cria pastas (ou diretórios). O último nome, depois da última barra é o nome que terá a pasta (`rotinas`). Observe que na linha 2 uma coisa diferente é utilizada que não foi explicada. O nome disso é [expansão de chaves](https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html) e também um recurso avançado que não será tratado aqui. Apenas saiba que essa expansão consegue passar múltiplos caminhos para o mesmo comando, o que pode fazer ele realizar uma tarefa em todos os caminhos delimitados pelas chaves, ***e pode ser usado por muitos outros comandos***.

Se você não quiser que a pasta `rotinas` fique em `Documents` e sim na pasta do usuário você pode utilizar o comando:

```bash
mv Documents/rotinas ~
```

Dessa forma, a pasta não estará mais visível com `ls Documents` e estará na pasta de usuário. Além disso, todos os arquivos da pasta continuam com ela.

Para **renomear** o esquema é o mesmo, apenas mudando a terceira parte do comando pelo nome que você quer colocar na pasta. Se você quiser mudar o nome de rotina para tarefas:

```bash
mv rotinas tarefas # observe que eu não estou usando o caminho absoluto ~/rotinas pois estou na pasta de usuário
```

Por último, para deletar uma pasta e todos os seus arquivos, vamos utilizar um comando já visto antes:

```bash
rm -r tarefas
```

O `-r` significa que é para apagar todos os arquivos e a pasta. Esse hífen na frente do 'r' mostra que queremos usar a opção de deletar pasta. Toda vez que ver um hífen na frente de alguma letra ou palavra significa opção.

## Sudo

Muitas vezes, você terá que fazer tarefas que só podem ser feitas pelo usuário `root`. Seja editar um arquivo protegido, realizar ações administrativas e outros.

Lembra que o `~` é a pasta padrão do usuário? Na verdade, ela não é exatamente isso. A real pasta é `/home/<usuario>` e `~` nada mais é que um sinônimo para facilitar. Da mesma forma que um usuário tem uma pasta, o `root` tem uma pasta também.

A pasta do `root` é o `/`. Ela é a raíz de todos os programas, configurações, serviços e as vezes até guarda outros usuários. A maioria das coisas nesta pasta, exceto de fato a pasta de usuário, são protegidas e só podem ser modificados pelo `root`.

Para executar algo como `root`, só precisamos colocar `sudo` na frente do comando que queremos.

```bash
sudo touch /teste.txt # sudo [comando]
```

## Estrutura básica de comandos

Todos os comandos têm uma estrutura básica que é mantida no Linux:

```bash
<comando> [-opt1 -opt2 ...] [arg1 arg2 ...]
```

Aqui, `<comando>` representa o comando que você quer (`sudo`, `mv`, `cp`, `echo`, ...). Já a parte as partes delimitadas por `[...]` são partes que às vezes são opcionais e que você pode omitir. As opções `-opt1 ...` são uma forma de instruir como um comando deve realizar alguma tarefa e, as vezes, qual tarefa. Os argumentos `arg1...` informam ao comando quais insformações utilizar para realizar alguma tarefa. Por exemplo:

```bash
ls # Comando de listar arquivos e pastas. Opções: nenhuma; argumentos: nenhum (definido para a pasta aberta atualmente)
ls ../Downloads # Comando de listar arquivos e pastas. Opções: nenhuma; argumentos: caminho ../Downloads
ls -1 ../Downloads # Comando de listar arquivos e pastas. Opções: um arquivo ou pasta por linha; argumento: caminho ../Downloads
```

Outros comandos também seguem esta estrutura.

## Recap

Resumindo...

* A **Linha de comando** é composta por três partes, o usuário (antes do `@`), o hostname (depois do `@`) e caminho aberto (depois do `:`). Dessa forma:

```bash
pimylifeup@pimylifeup:~$
```
* **Pastas** são organizadas de forma hierárquica, onde uma pasta é contida dentro de outra e tudo mais. Guardam arquivos também.
* Listar arquivos com `ls [caminho]` e se mover nos diretórios com `cd <caminho>`
* Criar arquivos com `touch <nome_do_arquivo>`, editar arquivos com `nano <nome_do_arquivo>`, ler arquivos com `cat <nome_do_arquivo>` e remover arquivos com `rm <nome_do_arquivo>`.
* Criar pastas com `mkdir <caminho>`, remover pastas e seus conteúdos com `rm -r <caminho>` e mover com `mv <caminho_antigo> <caminho_novo>`
* Executar comandos como *super-usuário* com `sudo ...`.
* Comandos sempre têm a forma <comando> [-opt1 -opt2 ...] [arg1 arg2 ...]
