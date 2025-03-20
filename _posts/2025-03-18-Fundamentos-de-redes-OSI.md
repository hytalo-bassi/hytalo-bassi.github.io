---
author: Michel Leonardo
layout: post
title:  "Introdução a Redes: Modelos de Rede e Modelo OSI"
date:   2025-03-17 18:30:00 -0400
categories: redes
description: "Aprenda o que é um Modelo de Rede e entenda de vez por todas o que é o famoso Modelo OSI"
image: "server3.jpg" 
---
## O que é um Modelo de Rede?

Um **Modelo de Rede** é um esquema que nos ajuda a entender melhor como organizar a comunicação entre diferentes dispositivos. Estudar esses modelos facilita a compreensão de como dois ou mais dispositivos se comunicam entre si ou com a rede. Assim, implementar os mais diversos protocolos se torna mais fácil, uma vez que se entende o funcionamento desses modelos.

Existem dois principais modelos que descrevem como os dispositivos devem se conectar: o modelo OSI (Open Systems Interconnection) e o modelo TCP/IP. No artigo de hoje, daremos enfoque apenas no modelo OSI.

## Modelo OSI

O Modelo OSI tem a função de classificar os protocolos em camadas, onde cada uma possui uma função própria, garantindo uma comunicação mais organizada e a padronização dos processos. Ele foi desenvolvido pela International Organization for Standardization (ISO) no final dos anos 1970, quando ficou evidente a necessidade de uma padronização para a comunicação entre redes.

Ele é dividido em **7 camadas**, e cada uma se preocupa apenas com a camada imediatamente inferior. Em cada camada, podem ser utilizados vários protocolos, cada qual com suas regras. Neste post, focaremos apenas na parte teórica, deixando de lado a especificidade de cada protocolo.

## Camadas do Modelo OSI

### **Camada 7: Application Layer**
No topo do modelo, temos a **Application Layer**, que define como um humano ou software pode interagir com a rede. É importante notar que, neste contexto, “application” não se refere a um programa, mas sim à forma como o software recebe os dados. Por exemplo, essa camada entra em ação quando abrimos um site ou baixamos algo. De forma simplificada, podemos dizer que toda a informação que passa pela Application Layer é composta de dados.

Quando abrimos o Google para pesquisar algo, enviamos e recebemos e-mails ou utilizamos algum serviço de streaming, é essa camada que viabiliza a troca dos dados necessários. Normalmente, são utilizados protocolos como HTTP/HTTPS (para navegação web), SMTP, IMAP, POP3 (para e-mails), FTP/SFTP (para transferência de arquivos) e diversos outros.

### **Camada 6: Presentation Layer**
A **Presentation Layer** é responsável por receber os dados da camada inferior e reorganizá-los para que a Application Layer possa apresentá-los ao usuário de forma adequada. Criptografia, compactação e transformação de dados são exemplos dos processos realizados nessa camada.

Por exemplo, quando acessamos um site seguro (com HTTPS), os dados passam por uma camada de criptografia utilizando SSL/TLS para evitar que sejam interceptados. Da mesma forma, arquivos compactados, como os em formato ZIP, podem ser descompactados por essa camada antes de serem lidos.

### **Camada 5: Session Layer**
Na **Session Layer** residem os protocolos que iniciam, mantêm e terminam conexões entre múltiplos computadores. Essas conexões são frequentemente chamadas de sessões (session, em inglês). Durante chamadas de vídeo no Zoom ou WhatsApp, é essa camada que garante uma sessão de comunicação estável.

### **Camada 4: Transport Layer**
Essa camada é responsável por garantir que os dados cheguem na ordem correta do dispositivo A para o dispositivo B. Ela controla erros, informa ao dispositivo se algum dado precisa ser reenviado por ter se perdido na rede e gerencia a quantidade de dados enviados, evitando que a rede seja sobrecarregada.

Por exemplo, ao fazermos download de um arquivo muito grande, como um jogo na Steam, essa camada gerencia os pacotes para assegurar que nenhum dado seja perdido e que o download seja concluído com sucesso. Normalmente, são utilizados os protocolos TCP ou UDP para realizar essas transferências.

### **Camada 3: Network Layer**
A **Network Layer** se preocupa em fazer a informação viajar entre duas ou mais redes diferentes, realizando funções de roteamento e envio de mensagens. Quando você acessa um site hospedado nos Estados Unidos, a Network Layer utiliza o endereço IP do servidor para enviar os dados pela internet, passando por diversos roteadores até chegar ao destino.

### **Camada 2: Data Link Layer**
A principal função dessa camada é transmitir **quadros de dados** entre dispositivos que estão fisicamente conectados na mesma rede. Os protocolos utilizados definem as regras para iniciar, manter e terminar a comunicação entre esses dispositivos, além de realizar a detecção e correção de erros.  
Dentro da Data Link Layer, temos duas subcamadas:
- **Media Access Control (MAC):** Determina como e quando os dispositivos podem se comunicar.
- **Logical Link Control (LLC):** Controla o fluxo de dados e lida com os erros que podem ocorrer nessa camada.

Quando dois computadores estão conectados via cabo Ethernet na mesma rede, essa camada define como os pacotes devem ser transmitidos de um para o outro sem interferências. Normalmente, são utilizados os protocolos Ethernet (IEEE 802.3) para redes cabeadas, Wi-Fi (IEEE 802.11) para redes sem fio ou PPP (utilizado em conexões diretas, como VPNs).

### **Camada 1: Physical Layer**
Nesta camada, os dados são transmitidos por meios físicos, como fios. Ela é responsável por transmitir os bits de forma física, utilizando diferentes tipos de sinais, como eletricidade, ondas de rádio e luz. Por exemplo, quando você usa um cabo de rede para conectar seu computador ao roteador, essa camada define como os bits são transmitidos pelo cabo.

## Resumo

Resumindo o Modelo OSI, começamos com a **Physical Layer**, que define como as transmissões no meio físico devem ocorrer (por exemplo, com ondas de rádio, eletricidade ou luz). Em seguida, a **Data Link Layer** estabelece como dispositivos fisicamente conectados na mesma rede devem se comunicar e transmitir os dados. A **Network Layer** determina o fluxo de informação entre diferentes redes. A **Transport Layer** realiza o controle de qualidade, garantindo que a informação chegue conforme o esperado. A **Session Layer** orquestra a conexão entre os dispositivos. A **Presentation Layer** transforma os dados em um formato compreensível para a camada acima, que é a **Application Layer**, responsável por entregar o conteúdo final ao usuário.

![OSI Diagram](https://www.alura.com.br/artigos/assets/uploads/2017/12/image_0.jpg) 

