## Ferramentas de Desenvolvimento

### Instalação

Para executar as ferramentas descritas aqui você deve ter `yarn`, `python`.

#### Ubuntu / Debian
```bash
sudo apt update
sudo apt install -y python3 python3-pip
sudo apt install -y curl gnupg
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo tee /etc/apt/trusted.gpg.d/yarn.asc > /dev/null
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install -y yarn
```

#### Fedora

```bash
sudo dnf install -y python3 python3-pip
sudo dnf install -y curl
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo dnf install -y yarn
```

#### Arch / Manjaro

```bash
sudo pacman -S --noconfirm python python-pip
sudo pacman -S --noconfirm yarn
```

### Executar site

Podemos executar o site esperando por mudanças no código assim:

```bash
bundle exec jekyll serve --watch
```

### SCSS Lint

Veja se o arquivo .scss está de acordo com as convenções:

```bash
bundle install
scss-lint <caminho.scss>
```

### Validar posts

Para validar que os posts estão seguindo as convenções você pode utilizar o script `scripts/validate_post.py` na raíz do projeto assim:

```bash
python scripts/validate_post.py
```

Ele mostrará as regras que estão sendo violadas e uma pequena descrição de cada violação.

### Playwright

Para testar o site:

```bash
yarn playwright test
```
