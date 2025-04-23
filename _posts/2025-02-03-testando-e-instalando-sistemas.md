---
title: "3 formas rápidas de instalar sistemas no Linux + Como usar máquinas virtuais"
date: 2025-02-03 13:46:00 -0400
layout: post
categories: SoftwareDevelopment DevOps
image: "linux.jpg"
authors: hytalo_bassi
redirect_from:
    - /linux/guide/2025/02/03/testando-e-instalando-sistemas.html
---

# Introdução

Muitas pessoas levam seus computadores para técnicos para trocar o sistema sem saber que isso pode ser feito por qualquer um, apenas com um pendrive. Irei mostrar várias formas de instalar outros sistemas com o Linux e como Testar no VirtualBox

## Instalar o sistema em um pendrive

Existem vários softwares para ajudar a instalar um sistema no pendrive. Se seu pendrive tiver bastante memória e você quiser testar vários sistemas ou manter para segurança, o Ventoy é a melhor opção. Se você só quer baixar o sistema, o Balena Etcher ou o 'dd' vão te ajudar com isso.

### Balena Etcher — Jeito Fácil

#### Instalando

1. Vá para o site do [Balena Etcher](https://etcher.balena.io/#download-etcher) e instale a versão 64-bit para Linux.
2. Descompacte o aplicativo com `unzip <balenaEtcher>.zip` no terminal. Substitua `<balenaEtcher>` pelo arquivo do Balena.
3. Entre na pasta descompactada e execute o Balena com `cd balenaEtcher-linux-x64 && ./balena-etcher`
4. Clique em 'Flash from File' e escolha o arquivo ISO do sistema.
5. Clique em 'Select Target' e escolha o seu pendrive.
6. Clique em 'Flash' e espere terminar a instalação.

![Imagem do Balena Etcher](https://b1501109.smushcdn.com/1501109/wp-content/uploads/sites/7/2023/02/Balena-Etcher.png?lossy=1&strip=1&webp=1)

### Ventoy — Múltiplos sistemas

Se você já tem convivência com instalar sistemas e tem aquele pendrive com bastante espaço, o Ventoy pode te ajudar. Como muitos amigos meus me pedem para instalar outros sitemas, e também eu tenho que entrar com `arch-chroot` no meu notebook de vez em quando, o Ventoy te ajuda a ter vários sistemas no mesmo lugar.

1. Vá na [página de instalação](https://github.com/ventoy/Ventoy/releases) e baixe o arquivo `ventoy-x.y.z-linux.tar.gz`
2. Descompacte e entre na pasta com `tar -xvzf ventoy-x.y.z-linux.tar.gz && cd ventoy-x.y.z`.
3. Instale o Ventoy no pendrive com `sudo ./Ventoy2Disk.sh -i /dev/sdX`. ***Lembre-se de trocar sdX por seu dispositivo, utilize `lsblk` se não souber.***
4. Depois que concluido, monte seu pendrive no PC com o comando `sudo mkdir /media/USB && sudo mount /dev/sdX /media/USB`.
5. Salve os arquivos de ISO em `/media/USB` utilizando os comando `sudo mv ...`, `sudo cp ...` ou utilizando um gerenciador de arquivos qualquer.

### Linux 'dd' — jeito rústico

Se você não quiser usar nenhuma das formas é possível instalar tudo direto do terminal com os comandos:

{% highlight bash %}
sudo umount /dev/sdX
sudo dd if=~/Downloads/sistema.iso of=/dev/sdX bs=4M status=progress
sync
sudo eject /dev/sdX
{% endhighlight %}

O `dd` copia os arquivos de uma forma diferente mais profunda que o `cp` faz (mais informações disponíveis [aqui](https://en.wikipedia.org/wiki/Dd_(Unix))). O `sync` garante que todos os arquivos foram escritos (leia [aqui](https://unix.stackexchange.com/questions/706359/when-and-why-should-i-sync-a-file-in-linux) para mais sobre) e o `eject` permite uma remoção segura do pendrive.


## <a name="bootloader"></a>Entrar no sistema

Entrar no sistema varia de PC em PC. Em alguns notebooks Lenovo, você pode pegar uma agulha e apertar um botão no lado da carcaça com o notebook desligado para ele mostrar a tela de dispositivos bootáveis. Na maioria dos outros dispositivos, você aperta alguma tecla como `F2`, `F11`, `F12`, `Del`. A forma certa pode variar muito para seu pc, utilize [esta poderosa ferramenta](https://www.google.com/search?q=Como+entrar+no+boot+do+computador+%3Cmeu+computador+da+nasa%3E) para descobrir qual a combinação do seu pc.

Após isso, se tudo deu certo deve aparecer um lista mostrando alguns dispositivos. Selecione o seu USB, as vezes aparece como Ventoy ou Linux.

![Imagem do Menu de Boot](https://4ddig.tenorshare.com/br/images/win-data-recovery/15-toshiba-boot-menu.jpg?w=596&h=320)


E pronto, o sistema irá iniciar.

## Testando sistemas em máquinas virtuais

Uma máquina virtual é literalmente como uma segunda máquina dentro da sua máquina. Isso é ótimo para testar novos sistemas, manter privacidade e segurança, e utilizar aplicativos específicos de Windows ou Mac. Para utilizar uma máquina virtual estaremos utilizando o aplicativo VirtualBox.

### Instalando o VirtualBox

Instale o virtualbox com:
{% highlight bash %}
sudo apt install virtualbox -y
{% endhighlight %}

Agora, o execute com `virtualbox`.

### Instalando sistema no VirtualBox.

1. Com o VirtualBox já carregado, aperte `Alt+m` ou clique no botão 'Machine' no canto superior esquerdo.
2. Clique em 'New'
3. Dê um nome, por exemplo: Arch
4. Em 'ISO Image', no terceiro campo, clique em outro e selecione o arquivo ISO do seu sistema.
5. Clique em 'Finalizer' no canto inferior direito.
6. A tela principal deve ter aberto e um novo sistema apareceu na lista ao lado esquerdo, selecione o seu sistema e aperte na seta verde escrito 'Iniciar'.

![Imagem do VirtualBox](https://news-cdn.softpedia.com/images/news2/virtualbox-6-0-officially-released-with-major-new-features-here-s-what-s-new-524331-3.jpg)

#### Caso aconteça o erro 'Kernel driver not installed'

Muito provavelmente os módulos não foram instalados. Para termos certeza corra o comando:

{% highlight bash %}
modinfo -n vboxdrv
{% endhighlight %}

Se aparecer um erro significa que realmente são os módulos e precisamos instala-los.

Se você estiver no ubuntu:
{% highlight bash %}
sudo apt-get install gcc make perl virtualbox-ext-pack
sudo /sbin/vboxconfig
{% endhighlight %}

Se você estiver no Arch siga a [Wiki](https://wiki.archlinux.org/title/VirtualBox)
