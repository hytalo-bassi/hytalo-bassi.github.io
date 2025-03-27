---
layout: post
title:  "Como construir um servidor de arquivos com Alpine Linux"
date:   2025-01-29 14:54:00 -0400
categories: server
image: "server1.jpg"
authors: hytalo_bassi
---

Você trocou seu velho computador e não sabe o que fazer com ele? Pois, então o use como servidor.

## TL;DR

***Essa seção é pensada para usuários já familiarizados com o sistema que sabem exatamente o que precisam fazer,
caso você não conheça cada passo adequadamente, pule para [1. Instalação do Alpine Linux
](#usb)***

### Instalar o sistema no pendrive

{% highlight bash %}
sudo umount /dev/sdX
sudo mkfs.vfat -F 32 /dev/sdX
sudo dd if=/path/to/file.iso of=/dev/sdX bs=4M status=progress
sync
sudo eject /dev/sdX
{% endhighlight %}


### Instalação e configuração dos serviços

*Depois de instalado o sistema, reiniciado e logado no usuário cadastrado `usuario`*

{% highlight bash %}
sudo apk update
sudo apk add openssh samba
sudo rc-service sshd start
sudo rc-update add sshd
sudo mkdir -p /srv/samba/guest
sudo chmod 0777 /srv/samba/guest
smbpasswd -a usuario              
sudo addgroup staff
sudo adduser usuario staff
sudo echo '[global]
   workgroup = WORKGROUP

   server string = Armazenamento
   server role = standalone server
   # Mantém compatibilidade com versões mais antigas
   server min protocol = SMB2
   server max protocol = SMB3

   # Importante para segurança
   client signing = mandatory

   disable netbios = yes
   map to guest = bad user

   log file = /var/log/samba/%m.log
   log level = 1
   max log size = 50
   
   # Mantém compatibilidade com o iOS
   vfs objects = streams_xattr fruit catia

   dns proxy = no


[public]
   comment = Público
   path = /data/public
   public = yes
   writable = no
   printable = no
   write list = @staff

[usuario]
   path = /home/usuario
   public = no
   browsable = no
   writable = yes
   printable = no
   write list = usuario' > /etc/samba/smb.conf
sudo rc-service samba start
sudo rc-update add samba
{% endhighlight %}

## <a name="usb"></a>1. Instalação do Alpine Linux

O Alpine Linux é uma distribuição muito leve e extremamente básica de Linux. Por conta disso, ela é perfeita para se
utilizar em um servidor.

### 1.1 Criar um pendrive bootável

Antes de tudo, teremos que criar um pendrive bootável com o Alpine; agora existem várias formas de instalar um sistema
num pendrive. A mais comum é com [Balena Etcher](https://etcher.balena.io/), mas se seu pendrive tiver um pouco
mais de armazenamento e não tiver nenhum outro melhor uso, você pode instalar múltiplos sistemas com o [Ventoy](https://www.ventoy.net/en/index.html). No entanto, estaremos utilizando uma ferramenta de linha de comando simplesmente para
instalar um sistema no USB, pela praticidade. 

*Lembre-se de substituir `sdX` pelo seu atual dispositivo (corra `lsblk` para descobrir
os dispositivos disponíveis), **escolher o dispositivo errado pode fazer você perder dados***:

{% highlight bash %}
sudo umount /dev/sdX
sudo mkfs.vfat -F 32 /dev/sdX
sudo dd if=/path/to/file.iso of=/dev/sdX bs=4M status=progress
sync
sudo eject /dev/sdX
{% endhighlight %}


### <a name="first-time"></a> 1.2 Iniciar e Instalar o Sistema

Iniciar o sistema vária de computador a computador, geralmente as teclas `F2, F3, Del, F12` servem para
entrar ou na BIOS ou na lista de dispositivos bootáveis (para descobrir exatamente qual é a combinação utilize esta
[ferramenta](https://www.google.com/search?q=Qual+combina%C3%A7%C3%A3o+de+teclas+para+entrar+no+boot+do+%3CMARCA+E+MODELO+DO+SEU+COMPUTADOR+DA+NASA%3E&sca_esv=a210ba99409b9731&sxsrf=AHTn8zpwxXWlU2BUrnrsgAE5yj19pRXsew%3A1738178325800&ei=FX-aZ6i_MJTU5OUPgJe4mQs&ved=0ahUKEwjonant0puLAxUUKrkGHYALLrMQ4dUDCBI&uact=5&oq=Qual+combina%C3%A7%C3%A3o+de+teclas+para+entrar+no+boot+do+%3CMARCA+E+MODELO+DO+SEU+COMPUTADOR+DA+NASA%3E&gs_lp=Egxnd3Mtd2l6LXNlcnAiXVF1YWwgY29tYmluYcOnw6NvIGRlIHRlY2xhcyBwYXJhIGVudHJhciBubyBib290IGRvIDxNQVJDQSBFIE1PREVMTyBETyBTRVUgQ09NUFVUQURPUiBEQSBOQVNBPjIFECEYoAEyBRAhGKABMgUQIRigATIFECEYoAFI5KMBUKZOWK2gAXAFeAGQAQCYAfUBoAHAH6oBBjAuMTguNLgBA8gBAPgBAZgCD6ACrhDCAgoQABiwAxjWBBhHwgIEECMYJ8ICCBAAGIAEGKIEwgIFEAAY7wWYAwCIBgGQBgiSBwU1LjUuNaAHl2k&sclient=gws-wiz-serp).

Com o sistema inicializado, o seu computador já deve ter pedido o login se tudo foi bem. Coloque o usuário do computador
como `root` e quando pedir a senha só aperte `Enter`.

![Tela de Login do Alpine](https://www.addictivetips.com/app/uploads/2023/08/alpine-login-root-1.jpg)

A instalação deixarei a cargo do leitor descobrir, no entanto ficará [aqui](https://wiki.alpinelinux.org/wiki/Installation#Installation_Step_Details) a documentação original. *Lembre-se de garantir escolher um IP Fixo para seu servidor tanto no
sistema tanto no seu roteador ([referência para escolher IP Fixo no Alpine](https://wiki.alpinelinux.org/wiki/Configure_Networking))*, se não toda vez que alguma mudança ocorrer na rede o IP estará diferente.

## 2. Instalação dos Serviços

Iremos instalar apenas dois serviços aqui, o `ssh` para controlar remotamente o servidor e o `samba` para compartilhamento
de arquivos atráves da rede. Nos outros serviços para compartilhar arquivos através da rede temos o `NFS`, que não
utilizaremos para manter compatibilidade com o Windows.

### 2.1 Instalar SSH

Caso já tenha instalado o SSH na [seção anterior](#first-time), ignore essa seção e vá para a próxima.

Para controlar remotamente seu servidor precisamo baixar os pacotes necessários para o SSH e ativar o
seu serviço. Tudo pode ser feito com os comandos:

{% highlight bash %}
sudo apk update
sudo apk add openssh
sudo rc-service sshd start
sudo rc-update add sshd
{% endhighlight %}

Agora, em outro computador na mesma rede abra o terminal e escreva `ssh 192.168.X.Y` substituindo `X` e `Y` pelo
restante do IP do servidor. Coloque seu usuário e senha e então poderá utilizar normalmente o terminal diretamente
no servidor.

### 2.2 Instalar Samba

Esta é a parte mais importante. Após feito isso é possível já utilizar seu servidor normalmente.

Devemos instalar o Samba, configurar ele e então ativar o seu serviço, para que corra assim que ligar o servidor.
Para instalar, escreva o comando:

{% highlight bash %}
sudo apk add samba

{% endhighlight %}

Agora precisamos configurar o samba e as pastas que você quer compartilhar. A estrutura para compartilhamento das
pastas não é muito padronizado. Utilizaremos aqui duas pastas compartilhadas, a privada (do seu usuário) e a pública (para convidados.

Durante a execução aparecerá um prompt te pedindo a senha para o usuario no Samba, coloque a mesma senha que você tinha
configurado no sistema. Altere `usuario` pelo nome configurado:

{% highlight bash %}
sudo mkdir -p /srv/samba/guest     # cria uma pasta para os convidados
sudo chmod 0777 /srv/samba/guest
smbpasswd -a usuario              
sudo addgroup staff                # cria um grupo para administração
sudo adduser usuario staff         # e adiciona um usuario nele
{% endhighlight %}

Para configurar o caminho das pastas e todas as coisas do samba devemos alterar o arquivo `/etc/samba/smb.conf` para
melhor se encaixar nas nossas necessidades. *O arquivo de configuração tem muitas opções que valem a pena olhar no site
do [samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html).*


Altere `usuario` pelo nome configurado:

smb.conf
```
[global]
   workgroup = WORKGROUP

   server string = Armazenamento
   server role = standalone server
   # Mantém compatibilidade com versões mais antigas
   server min protocol = SMB2
   server max protocol = SMB3

   # Importante para segurança
   client signing = mandatory

   disable netbios = yes
   map to guest = bad user

   log file = /var/log/samba/%m.log
   log level = 1
   max log size = 50
   
   # Mantém compatibilidade com o iOS
   vfs objects = streams_xattr fruit catia

   dns proxy = no


[public]
   comment = Público
   path = /data/public
   public = yes
   writable = no
   printable = no
   write list = @staff

[usuario]
   path = /home/usuario
   public = no
   browsable = no
   writable = yes
   printable = no
   write list = usuario
```

Por último, devemos adicionar o Samba nos serviços de Boot do nosso servidor. Para isso, coloque os comandos:

{% highlight bash %}
sudo rc-service samba start
sudo rc-update add samba
{% endhighlight %}

### 3. Conclusão

Pronto! Você criou seu servidor de arquivos. Para acessar ele você deve baixar um cliente SMB e colocar o usuário
e senha do sistema, que havia sido definido na instalação do sistema.

#### 3.1 Para acessar no Arch Linux

{% highlight bash %}
sudo pacman -Sy smbclient cifs-utils
sudo mkdir /mnt/mountpoint
sudo mount --mkdir -t cifs //192.168.X.Y/usuario /mnt/mountpoint -o "username=usuario,iocharset=utf8,uid=60466,vers=3.0"
{% endhighlight %}

#### 3.2 Para acessar no iPhone

1. Abra o aplicativo `Arquivos` na mesma rede que seu servidor.
2. Clique nos três pontinhos no canto superior direito.
3. Clique em 'Conectar a um servidor'
4. Digite na primeira entrada `smb://192.168.X.Y/usuario`; altere `X` e `Y` pelo restante do IP do servidor e `usuario` pelo usuário cadastrado no `Samba`.
5. Coloque seu usuário e a senha em baixo
6. Pronto!

![Ilustração da primeira parte](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftidbits.com%2Fuploads%2F2019%2F08%2FFiles-iOS-13.jpg&f=1&nofb=1&ipt=13f452df5cb445d2bd0d3d7285ee8d5276134501837b1c8150edc32f1e94e67b&ipo=images)
