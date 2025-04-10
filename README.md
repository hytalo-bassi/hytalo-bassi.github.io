## Ferramentas de Desenvolvimento

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
