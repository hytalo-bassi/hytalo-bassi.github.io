---
layout: post
title: "2 formas de acessar o seu PC pela internet (Ngrok e Tunelamento SSH)"
categories: vps linux guide remote-access ssh
tags: ngrok ssh remote-access vps guide
excerpt: Aprenda como acessar seu PC pela internet utilizando o Ngrok ou túnel SSH com uma VPS. Veja como configurar ambas as ferramentas e melhorar o acesso remoto.
image: "ssh-tunneling.jpg"
date: 2025-03-03 19:00:00 -0400
authors: hytalo_bassi
---

Muitas vezes precisamos demonstrar como está ficando um site pro cliente de forma online. E enviar um vídeo ou print não passa muita confiança. Por isso, compartilhamos nosso serviço como se já estivesse em produção para verem com um simples link. Ou se você é que nem eu, fez um servidor local e seu provedor bloqueou o **direcionamento de portas**, você pode ainda assim acessar seu servidor de qualquer lugar do mundo usando túneis SSH e uma VPS.

## Ngrok

O Ngrok é uma ferramenta que permite expor um servidor local quase sem configuração podende ser acessado de qualquer lugar. Ele cria um túnel entre seu computador e os servidores do Ngrok de forma muito simples. Ideal para demonstrações rápidas.

### Instalando

Para instalar o Ngrok no Ubuntu:

```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update \
  && sudo apt install ngrok
```

No Alpine: `sudo apk add ngrok`

### Configurando

Primeiro, você deve criar uma conta **gratuita** clicando [aqui](https://dashboard.ngrok.com/signup), depois clicar em "Accept All" e seguir o procedimento padrão de criar conta.

Depois de logado, clique em "Your Authtoken" na barra lateral à esquerda e então clique no ícone de olho fechado. Deverá aparecer um conjunto de caracteres bem longo. Este é seu **token e você deve copiá-lo**.

Agora, volte ao terminal e escreva: `ngrok config add-authtoken <seu_token>`

Pronto, agora é só compartilhar a porta que você quer. Por exemplo, para compartilhar a porta `80` do seu PC:
`ngrok http 80`

## Tunelamento SSH (SSH Tunneling)

Agora, se você quer total controle de como quer deixar disponível o seu PC e não quer utilizar o Ngrok, o tunelamento SSH é sua opção. Ele funciona passando trafégo da rede pelo protocolo SSH, como HTTP, FTP ou outros protocolos. Já foi usado para proteger protocolos como FTP.

Existem 3 formas de tunelamento SSH:

- Encaminhamento de Porta Local (a requisição sai da sua máquina e vai para o remoto).
- Encaminhamento de Porta Remota (a requisição sai do remoto e vai para sua máquina, que é o que faremos).
- Encaminhamento Dinâmico de Portas (configura um proxy SOCKS).

Para conseguirmos liberar acesso na internet, precisamos de uma máquina que esteja disponível na rede. Para isso, estaremos usando uma VPS, um servidor virtual de baixos recursos, que está disponível na internet.

### Conseguindo uma VPS
 
Precisamos de um servidor que esteja disponível na internet e que possamos utilizar o SSH. Para essa tarefa, iremos utilizar a AWS.

1. Crie a conta na [AWS](https://signin.aws.amazon.com/signup?request_type=register).
2. Entre no Console Home da AWS.
3. Na barra de navegação superior, clique no penúltimo item e selecione `South-America (São Paulo)` ou qualquer outro servidor que estiver mais próximo de você.
4. Clique em EC2.
5. Clique em "Lançar Instância".
6. Coloque algum nome como `SSH Tunnel` no campo de nome.
7. Selecione `Amazon Linux` ou um sistema que seja melhor e não cobre tanto.
8. Na sessão "Key Pair" (Par de Chaves), clique em "Criar nova Par de Chaves" e coloque um nome qualquer no primeiro campo, deixe selecionado "RSA" no tipo do Par de Chaves e clique em "Criar Par de Chaves". **Um novo arquivo será baixado**.
9. Envie o arquivo para um lugar seguro no seu PC ou servidor.
10. Na sessão "Configurações de Rede", clique na checkbox "Permitir tráfego SSH de" e clique no dropdown ao lado e selecione "Qualquer Lugar (0.0.0.0/0)".
11. Clique em "Lançar".

Pronto! Você agora tem uma instância de um servidor na internet da AWS em São Paulo!

### Permitindo acesso as portas de serviço da AWS

Por padrão a AWS bloqueia o tráfego em todas as portas, exceto a SSH que você permitiu anteriormente. Para liberarmos a sua porta de serviço devemos ir ao console de gerencimanto da instância:

1. Clique na instância que você tinha criado (deve estar disponível como i-99999999 nas instâncias da EC2).
2. Clique no link em azul com o mesmo ID que você tinha clicado no passo 1.
3. Vá um pouco mais para baixo até achar a tab "Segurança", clique nela.
4. Na sessão "Detalhes de Segurança" clique no link em azul escrito algo como `sg-...`.
5. Na sessão "Regras de Entrada" clique no último botão "Editar Regras de Entrada".
6. No dropdown Tipo clique nele e selecione `TCP Customizado`.
8. No dropdown "Intervalo de Porta" escreva a porta do seu serviço da máquina local.
7. No penúltimo campo com uma lupinha clique no dropdown e selecione `0.0.0.0/0`.
8. Clique no botão "Salvar Regras".

### Instalar e configurar SSH

Essa é a parte mais importante do post. Precisamos instalar a ferramente SSH no PC ou servidor, se já não estiver instalado, e configurar o túnel SSH.

#### Instalando o SSH

Se o SSH já estiver instalado na sua máquina, pule esta etapa.

**Como instalar no Ubuntu**:

```bash
sudo apt update && sudo apt upgrade
sudo apt install openssh-server openssh-client
```

**Como instalar no Alpine (servidores)**:

```bash
sudo apk add openssh
```

#### Configurando SSH

Precisamos permitir que as portas do nosso serviço estejam disponíveis para o SSH e que ele esteja rodando. Para configurar as portas devemos alterar o arquivo `/etc/ssh/sshd_config` na **VPS**:

`GatewayPorts yes`

Para entrar na VPS e configurar o arquivo será necessário o arquivo que foi baixado anteriormente e acessar a máquina com o SSH (substitua o caminho pelo arquivo):

```bash
ssh -i <caminho_para_as_chaves>.pem <usuário_da_IAM>@<url_ou_ip_público_da_aws>
```

> **Não sabe o usuário ou o URL ou IP público da AWS? Não se preocupe, com o próprio console da AWS você consegue descobrir tudo isso. Siga os seguintes passos:**

> 1. Clique na instância que você tinha criado (deve estar disponível como i-99999999 nas instâncias da EC2).
> 2. Clique no link em azul com o mesmo ID que você tinha clicado no passo 1.
> 3. Clique no botão "Conectar" em baixo do título.
> 4. Clique na tab Cliente SSH.
> 5. Em baixo você verá um exemplo que pode ser usado por você. Copie a última parte, deve ser algo como `ec2-user@ec2-....compute.amazonaws.com`, e substitua na última parte do comando para conectar o túnel.

É possível colocar esta linha no final do arquivo com o comando `sudo echo GatewayPorts yes >> /etc/ssh/sshd_config`.

Depois disso, reinicie o SSH da VPS com o comando:

```bash
sudo systemctl restart sshd
```

### Iniciando o túnel

Na máquina local, você deverá iniciar o túnel e se credenciar utilizando aquele arquivo que você baixou no começo. Este arquivo é um par de chaves e ele, meio que, abre a porta para acessar o SSH no servidor remoto. *Lembre-se, isso é apenas uma chave e, se cair nas mãos erradas, ela continuará permitindo acesso no seu **servidor***.

Primeiro, devemos dizer a nossa máquina local que o arquivo têm permissões adequadas. Para isso, escrevemos no terminal `chmod 400 <caminho_para_o_arquivo_que_você_salvou>.pem`.

Se você quiser, por exemplo, fazer com o que o servidor redirecione a porta `80` do remoto para a porta `1000` da máquina local, você pode escrever (**substitua o caminho, usuário e endereço de forma correta**):

```bash
ssh -i <caminho_para_as_chaves>.pem -N -R 80:localhost:1000 <usuário_da_IAM>@<url_ou_ip_público_da_aws>
```

A opção `-N` bloqueia a execução de comando, mantendo apenas o túnel aberto. Já a opção `-R` indica o tipo de tunelamento. Como estamos usando o encaminhamento de porta remota usamos o `-R`, mas se fosse o local ou dinámico seria `-L` ou `-D`.


