---
layout: post
title:  "Introdução ao Docker: O Guia Completo para Iniciantes"
date:   2025-03-15 18:30:00 -0400
categories: linux docker
description: "Aprenda o que é Docker, como utilizá-lo e criar containers para desenvolvimento eficiente. Guia prático com comandos e exemplos de Dockerfile."
image: "docker.png" 
---


## O que é o Docker?

Docker é uma ferramente de containerização, ele cria containers para facilitar o processo de desenvolvimento de forma rápida e eficiente. Mas, o que é um container?



> Containers são unidades executáveis de software que empacotam o código junto com suas bibliotecas e dependências, ou seja, eles virtualizam apenas os recursos que eles necessitam, sem emular um novo hardware como VMs fazem. Por isso, containers são tão leves, eles são apenas o suficiente para uma aplicação funcionar.

Agora, igual para criar VMs usamos ferramentas como Virtualbox, para criar containers usamos o Docker.


## Como utilizar o Docker?

Primeiro, é preciso instalar o Docker no seu sistema. Os processos de instalação podem ser encontrados no [site oficial](https://docs.docker.com/engine/install/ubuntu/). Para instalar no Ubuntu, escreva os comandos no terminal:

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Estrutura do Dockerfile

Com o Docker instalado, agora precisamos criar um container. Para criar um container, precisamos de dizer pro Docker o que nos queremos que o container contenha e para isso usamos o `Dockerfile`. Por exemplo:
```Dockerfile
FROM python:3.12.3-slim-bullseye

WORKDIR /usr/local/projeto_multitrilionario

COPY backend/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY backend/src .

CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0"]
```

Esse pequeno Dockerfile, tem uma função bem simples: baixar o python em um sistema, baixar o código fonte de um programa e instalar as dependências e hospedar um servidor com Flask. A estrutura de um Dockerfile sempre é parecida com isso:

| Síntaxe                              | Descrição |
|--------------------------------------|-----------|
| `FROM <imagem>`                      | Baixa uma imagem base do sistema operacional, contendo apenas o essencial para funcionar, como Kernel e algumas ferramentas. |
| `WORKDIR /caminho/desejado`         | Define um diretório de trabalho dentro do container, facilitando operações como cópia e movimentação de arquivos. Semelhante ao `cd` no Linux. |
| `COPY <origem> <destino>`           | Copia arquivos ou diretórios do host para o container. A origem é relativa ao local onde o Dockerfile está armazenado. |
| `RUN <comando>`                      | Executa comandos dentro do container durante o processo de build. Geralmente utilizado para instalação de pacotes ou compilação de código. |
| `CMD ["comando", "arg1", "arg2", ...]` | Define o comando principal que será executado quando o container iniciar. Se este comando falhar, o container será encerrado. |

### Construindo e Executando

Agora, com todos os comandos principais definidos, devemos construir o container:

```bash
sudo docker build -t "projeto_multitrilionario" .
```

Nessa fase, qualquer problema em relação a instalação do container, como uma imagem não localizada, um comando RUN falhando, um arquivo no host que não foi localizado, será relatado e, consequentemente, falhará. Isso pode demorar alguns minutos, mas é um tanto legal ver a velocidade que ele executa cada instrução e as barras progredindo.

Se este comando for executado com sucesso, você poderá ver que a imagem está instalada com o comando:

```bash
sudo docker image list | grep "projeto_multitrilionario"
```

Agora, só falta executar o container:

```bash
sudo docker run -d --name "container_multitrilionario" "projeto_multitrilionario"
```

Pode parecer um comando um pouco assustador, mas é simples. Primeiro, o comando run do docker tem a seguinte sintaxe:

```bash
docker run [ARG] <imagem>
```

Onde `[ARG]` é opcional e guarda informações de como executar o container, especificar espaços no disco, quantidade de memória utilizar, configurar redes e guardar o nome da máquina. Agora, a `<imagem>` é necessário e esta será a imagem que foi construída anteriormente pelo docker build, no caso: `"projeto_multitrilionario"`.

O argumento `-d` (ou `--detach`) fala ao Docker executar o container em segundo plano, o que permitirá você fazer outras tarefas no host ou, até mesmo, entrar no container usando o shell. O argumento `--name` diz que você quer nomear esse container. É bom dar nomes significativos aos containers, como `"db-mongo"` para o banco de dados do mongo.

## Docker Compose - Aumentando o horizonte

Agora que você aprendeu a criar um container com o `Dockerfile` e executar ele com o `docker run`, é hora de você aprender a usar o Docker Compose.

O Docker Compose é uma ferramenta que permite você trabalhar com mais de um container de forma extremamente rápida e escalável. Ele usa de uma estrutura simples de se aprender e utiliza os conceitos do `Dockerfile` anteriormente.

Para utilizar o Compose precisamos antes dizer como queremos utilizar os Containers. Para isso, usamos o arquivo `compose.yaml`:

```yaml
# compose.yaml
services:
  backend:
    build: 
      dockerfile: .
    environment:
      - DB_HOST=db
      - DB_PORT=27017
      - UPLOAD_FOLDER_FLASK=/usr/local/projeto_multitrilionario/uploads
    ports: 
      - "5000:5000"
    links:
      - "db:db"
    develop:
      watch:
        - action: sync
          path: ./backend/src
          target: /usr/local/projeto_multitrilionario/
  db:
    image: "mongo:latest"
    ports:
      - "27017:27017"
    restart: unless-stopped
    networks:
      - net
    volumes:
      - mongo_data:/data/db

networks:
  net:
    driver: bridge

volumes:
  mongo_data:
```

Ok, eu sei que é muita coisa. Mas vai tudo fazer sentido, eu espero... Vamos dar nome aos bois antes:

```yaml
services:
  backend:
    ...
  db:
    ...
```

O `services` especifica quais serviços (containers) vamos utilizar. Você pode perceber que tem dois nomes (`tags`) que estão abaixo do `services`, estes são os containers, ou melhor, o nomes deles, ao menos. O Compose irá ler isso e entender que você quer criar dois containers com os nomes `backend` e `db`. Mas, ele só sabe disso ainda... Agora, para entender de fato o que o container será vamos olhar em baixo das tags dos containers:

```yaml
...
   db:
     image: "mongo:latest"
     ports:
       - "27017:27017"
     restart: unless-stopped
     networks:
       - net
     volumes:
       - mongo_data:/data/db
```

Cada tag embaixo de `db` fala ao Compose como queremos que funcione o container `db`. Igual no `Dockerfile`, que baixamos uma imagem, o Compose define que o container `db` terá a imagem `mongo` na versão mais recente (`mongo:latest`). A tag `ports` modifica algo que não tinhamos visto anteriormente. O Compose identifica que nos queremos que o container tenha portas expostas para o host e cada linha com hifén em baixo de `ports` diz um par de portas. Neste caso, o Compose irá exportar a porta `27017` no container e deixará acessível ao host como `27017` (tem a sintaxe  `<container>:<porta para host>`).

A tag `restart` indica ao Compose quando que o container deve ser reiniciado. Caso um container morra por conta de um erro (que pode ser causado no `CMD` da imagem) o Compose pode querer reiniciá-lo. O valor `"unless-stopped"` diz ao Compose manter ligado o container db mesmo que o `CMD` falhe. Isso pode ser útil para fazer testes.

O `networks` indica ao Compose quais redes usar. Aqui rede é como se fosse sua rede local (LAN) onde você pode acessar outros dispositivos usando o IP local. Nesse caso, o Compose irá utilizar uma rede já definida com o nome `net`(como se fosse uma outra rede local). Isso se torna útil caso você queira que um container possa conversar com outro.

E por último, volumes são pontes entre o container e um diretório no host. **Mais informações podem ser consultadas no documentação**. 

Agora, se torna mais fácil entender que o container backend é um container com alguma imagem, que expõe a porta `5000` no container e `5000` no host. Mas ainda nos resta enteder o `build`, `develop`, `environment` e `links`.

```yaml
...
  build: 
      dockerfile: .
```

A tag `build` diz ao Compose que devemos construir uma imagem. Para construir a imagem, ele deve achar um `Dockerfile` que está no diretório `.` (mesmo diretório da onde ele for lançado). Então, se você executar o Compose no diretório `Downloads/projeto_multitrilionario` ele irá procurar o Dockerfile ai dentro. Simples, não?

```yaml
...
    environment:
      - DB_HOST=db
      - DB_PORT=27017
      - UPLOAD_FOLDER_FLASK=/usr/local/projeto_multitrilionario/uploads
```

A tag `environment` é um pouco diferente. Se você já definiu uma varíavel de ambiente no Linux com `export VAR=VALUE` você já deve ter sacado. O Compose, quando lê a tag `environment` define uma série de variáveis do ambiente, que podem ser utilizadas no programa para esconder segredos ou configurar a execução do projeto.


```yaml
...
    links:
      - "db:db"
```

Essa você já devia estar esperando. A tag `links` serve para linkar o atual container (`backend` no caso) com outro container, na mesma rede. Nesse caso, ele está deixando disponível o container `db` para o container `backend` com o nome `db`(a sintaxe é `<nome do container>:<hostname para o container>`). Desse jeito, é possível acessar o container `db` igual acessamos o `google.com` (só digitar esse endereço e o sistema o achará). Isso facilita muito o desenvolvimento, uma vez que podemos separar a lógica do programa de um banco de dados e um front-end e permitir acessos com hostnames invés de IPs.


```yaml
   ...
    develop:
      watch:
        - action: sync
          path: ./backend/src
          target: /usr/local/projeto_multitrilionario/
```

Essa é apenas uma utilidade. A tag `develop.watch` monitora mudanças em diretórios e, se houver alguma mudança desde a última vez que o container foi lançado, ela pode sincronizar a mudança com o container novamente. Nesse caso, quando a pasta `./backend/src` no host mudar, o Compose copiará as mudanças necessárias para a pasta `/usr/local/projeto_multitrilionario/` no container.

```yaml
networks:
  net:
    driver: bridge
```

Agora, saímos das definições do container e estamos configurando a rede como um todo. O Compose irá criar, assim que ver essa definição, uma nova rede com o nome `net` e deixará disponível para ser utilizada pelos containers. Desse jeito, você pode linkar vários containeres juntos, como vimos anteriormente, de uma forma simples e rápida.


### Como executar o Docker Compose

Agora que você já tem um Dockerfile pronto, um compose.yaml pronto só falta executar isso tudo. Para isso, só execute:

```bash
sudo docker compose up -d
```

Simples, não? O Docker Compose irá ler o `compose.yaml`, ver que precisa criar os containers, buildar um `Dockerfile` que está na mesma pasta de lançamento, configurar os volumes e redes para usar, configurar o ambiente de desenvolvimento, baixar umas imagens e pronto. Agora, seus containers estão todos ligados e em segundo plano (`-d`). Para ver os registros deles você pode escrever:

```bash
sudo docker compose logs
```

Para ver todos os logs. Agora, para ver de um container apenas:

```bash
sudo docker compose logs db
```

Caso você queira parar todos eles:

```bash
sudo docker compose stop
```

E é isso, espero que esse artigo seja útil para você. Tente adicionar o Docker em um projeto seu, talvez você goste do que [.devcontainers](https://containers.dev/) pode te oferecer :)
