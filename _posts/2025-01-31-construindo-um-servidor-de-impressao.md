---
author: Hytalo M. Bassi
title: "Como construir um Servidor de Impressão no Alpine com Samba e Cups"
date: 2025-01-31 09:39:12 -0400
toc: true
layout: post
categories: server
image: "server2.jpg"
---

Há alguns dias atrás mostrei [como configurar um servidor de arquivos com Samba no Alpine](/server/2025/01/29/construindo-um-servidor-de-arquivos.html) e decidi agora ensinar como criar um servidor de impressão. **Você precisa já ter o Samba instalado e configurado para funcionar**.

## 1. Instalar e configurar o CUPS

O CUPS é um sistema de impressão para Linux extremamente avançado e moderno e estaremos utilizando ele no nosso servidor para conseguir imprimir arquivos tanto no Linux, como no macOs e Windows.

Para baixar o CUPS execute:

{% highlight bash %}
sudo apk add cups
{% endhighlight %}

Para configurar, é da mesma forma como no Samba. Abra o arquivo `/etc/cups/cupsd.conf` e escreva o seguinte:
```
# cupsd.conf

LogLevel debug
PageLogFormat
MaxLogSize 1m

ErrorPolicy stop-printer

Listen localhost:631
Listen 192.168.15.100:631
Listen /run/cups/cups.sock

Browsing Yes
BrowseLocalProtocols dnssd

DefaultAuthType Basic

IdleExitTimeout 60

<Location />
  Order allow,deny
  Allow localhost
  Allow 192.168.15.*
</Location>
```

Com essa configuração já é possível registrar possíveis erros e acessar o site web para configurar as impressoras dentro
da sua rede e deixar disponível na rede impressoras que forem compartilhadas. Mais informações e configurações úteis estão disponíveis na [documentação oficial](https://www.cups.org/doc/man-cupsd.conf.html).

## 2. Localizar impressoras na rede


Muitas impressoras hoje em dia utilizam um protocolo chamado [Bonjour](https://developer.apple.com/bonjour/) para serem localizadas na rede (elas recebem um endereço `<impressora>.local`). No Linux, vamos utilizar o [Avahi](https://avahi.org/) para localizar as impressoras e ficar visíveis na rede. **Para praticidade, só iremos tratar o caso de sua impressora estar na rede e não cabeada. Além disso, faremos uma configuração simples com o udhcpd e NetworkManager, consulte o [site do Alpine](https://wiki.alpinelinux.org/wiki/MDNS) caso precise fazer diferente, garanta de permitir a porta 5353 no firewall.**

Para baixar o Avahi, execute os comandos

{% highlight bash %}
sudo apk add avahi avahi-tools avahi-daemon avahi2dns
{% endhighlight %}

### 2.1 Configurar Avahi

Para fazer o Avahi resolver o DNS (`<impressora>.local`), precisamos encaminhar as requisições que terminem com `.local` para o `avahi2dns` Para isso, usaremos as ferramentas `openresolv` e `unbound`:

{% highlight bash %}
sudo apk add openresolv unbound
{% endhighlight %}

Agora, crie o arquivo `/etc/resolvconf.conf` e escreva:
```
name_servers=127.0.0.1
unbound_conf=/etc/unbound/unbound.conf.d/resolvconf.conf
```

Isso diz ao sistema usar um nameserver local e passar para o `unbound`. Agore, crie o arquivo `/etc/unbound/unbound.conf.d/avahi-local.conf` e escreva:

```
 forward-zone:
       name: "local"
       forward-addr: 127.0.0.1@5354
 server:
       do-not-query-localhost: no
       domain-insecure: "local"

```

Isso irá mandar as requisições `.local` para o `avahi2dns`. Agora precisamos executar os serviços com o comando:

{% highlight bash %}
sudo rc-update add avahi-daemon
sudo rc-service avahi-daemon start
sudo rc-update add avahi2dns
sudo rc-service avahi2dns start
sudo rc-update add unbound
sudo rc-service unbound start
{% endhighlight %}

### 2.2 Configurar o cliente DHCP

Com o `udhcpd` instalado, crie o arquivo `/etc/udhcpc/udhcpc.conf`:
```
RESOLV_CONF="/etc/udhcpc-resolv.conf"
```

Depois, crie o arquivo `/etc/udhcpc/post-bound/resolvconf`:
```
#!/bin/sh
cat /etc/udhcpc-resolv.conf | resolvconf -a $interface
```

e o deixe executável:
{% highlight bash %}
sudo chmod 755 /etc/udhcpc/post-bound/resolvconf
{% endhighlight %}

Além disso, reescreva o arquivo `/etc/nsswitch.conf` e mude a linha `hosts` para ter `mdns_minimal [NOTFOUND=return]` antes de `dns` e `files`:
```
hosts: mdns_minimal [NOTFOUND=return] files dns
```

### 2.3 Teste o Avahi

Para achar sua impressora com o Avahi:

{% highlight bash %}
avahi-browse -rt _ipp._tcp
{% endhighlight %}

Isso deve mostrar várias informações, procure por algo como:
```
...
= eth0 IPv4 <Nome da Impressora>
  hostname = [<impressora>.local]
...
```

Agora que você tem o `hostname` da sua impressora, tente alcançar ela:
{% highlight bash %}
ping <impressora>.local
{% endhighlight %}

Se tudo estiver certo, o ping não vai dar erro. Caso contrário, provavelmente o sistema para resolver DNS está mal configurado, garanta que você configurou tudo certo e que você não está usando NetworkManager e o firewall está liberado na porta `53353`.

## 3. Baixar os Drivers

Essa parte é um tanto chata, por que ela varia de impressora a impressora. Se você está usando uma impressora HP então instale o pacote `hplip`, se estiver usando uma Canon talvez o `gutenprint` ou `foomatic-db-engine` e `foomatic-db-ppds`. Ou, apenas utilize [essa poderosa ferramenta](https://www.google.com/search?q=qual+driver+linux+baixar+para+impressora+%3Cnome+da+impressora%3E&oq=qual+driver+linux+baixar+para+impressora+%3Cnome+da+impressora%3E) para achar o driver da sua impressora.

Para baixar os drivers da `gutenprint`:

{% highlight bash %}
sudo apk add gutenprint
{% endhighlight %}

## 4. Iniciar o CUPS e configurar impressora

Para fazer o CUPS iniciar junto com o sistema:
{% highlight bash %}
sudo rc-update add cupsd
sudo rc-service cupsd start
{% endhighlight %}

Agora, entre no seu navegador e digite o IP do seu servidor junto com a porta assim `https://192.168.X.Y:631/`, mude `X` e `Y` pelo resto de seu IP. Deverá abrir a página inicial do CUPS. Clique em `'Administration' > 'Add Printer'`, coloque o
nome de usuário do seu servidor e a senha e então cadastre sua impressora. Não se esqueça de compartilhar ela clicando na checkbox `Share this printer`. 

*Lembre-se que as vezes adicionar a impressora automaticamente descoberta da rede pode te atrapalhar posteriormente. Se possível adicione manualmente sua impressora clicando em 'Internet Printing Protocol (ipp)' > escreva ipp://\<impressora\>.local/ipp/print trocando \<impressora\> pelo hostname do avahi e continue configurando a impressora*

## 5. Configurando o Samba para ser um Servidor de Impressão

Antes de tudo, verifique se o Samba que foi instalado tem suporte para CUPS:
{% highlight bash %}
smbd -b | grep "HAVE_CUPS"
{% endhighlight %}

Se responder alguma coisa com `HAVE_CUPS` o Samba tem suporte. Caso contrário, o Samba foi compilado com a flag `--disable-cups` ou o Samba não pode achar os scripts necessários para o CUPS. Para detalhes, [leia isso](https://wiki.samba.org/index.php/Package_Dependencies_Required_to_Build_Samba).

Entre no `/etc/samba/smb.conf` e escreva :
```
[global]
...
rpc_server:spoolss = external
rpc_daemon:spoolssd = fork

printing = CUPS
...

[printers]
       path = /var/tmp
       printable = yes
```

Depois, reinicie o Samba:
{% highlight bash %}
doas rc-service samba restart
{% endhighlight %}



## 6. Conclusão

Você conseguiu já montar seu servidor de impressão. Ele é muito útil para fazer aquela impressora antiga, que não tem
recursos tão modernos como AirPrint e impressão por WiFi passar a ter. Agora você pode imprimir qualquer arquivo do seu
iPhone ou Mac utilizando o AirPrint do próprio dispositivo, em Android e Linux você claramente consegue também.

No iPhone é só compartilhar o arquivo que você quer imprimir e apertar em 'Imprimir', selecionar o nome da impressora e
voilà, você está imprimindo. Não precisa configurar nenhum driver nem tipo de papel.
