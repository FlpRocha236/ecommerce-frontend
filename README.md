# 🛍️ E-commerce Frontend

![Angular](https://img.shields.io/badge/Angular-21-red)
![Angular Material](https://img.shields.io/badge/Angular_Material-21-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

Frontend do projeto E-commerce API desenvolvido em Angular com design inspirado naquela marca famosa da maça.

## 🚀 Tecnologias

- Angular 21
- TypeScript 5
- Angular Material
- RxJS
- CSS puro com design system customizado

## 📦 Funcionalidades

- ✅ Listagem de produtos com cards visuais
- ✅ Criação e edição de produtos
- ✅ Adição de produtos ao carrinho
- ✅ Gestão do carrinho com remoção de itens
- ✅ Finalização de pedido com endereço e observações
- ✅ Listagem de pedidos por cliente
- ✅ Pagamento e cancelamento de pedidos
- ✅ Design responsivo inspirado na Apple Store
- ✅ Feedback visual com snackbars

## ⚙️ Como executar localmente

### Pré-requisitos

- Node.js 20+
- Angular CLI 21+
- [ecommerce-api](https://github.com/FlpRocha236/ecommerce-api) rodando na porta 8080

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/FlpRocha236/ecommerce-frontend.git
cd ecommerce-frontend

# Instale as dependências
npm install

# Execute o projeto
ng serve
```

Acesse em:

```
http://localhost:4200
```

## 📁 Estrutura do projeto

```
src/app/
├── components/
│   └── navbar/        ← Barra de navegação
├── pages/
│   ├── products/      ← Página da loja
│   ├── cart/          ← Página do carrinho
│   └── orders/        ← Página de pedidos
├── services/
│   ├── product.ts     ← Integração com API de produtos
│   ├── cart.ts        ← Integração com API do carrinho
│   └── order.ts       ← Integração com API de pedidos
└── models/
    └── product.model.ts  ← Interfaces TypeScript
```

## 🔗 Projetos relacionados

- [ecommerce-api](https://github.com/FlpRocha236/ecommerce-api) — Backend Spring Boot

## 🖼️ Páginas

### Loja

- Grid de produtos com emojis dinâmicos por categoria
- Botão de adicionar ao carrinho
- Formulário de criação e edição inline

### Carrinho

- Lista de itens com subtotais
- Resumo com frete grátis
- Formulário de endereço e observações
- Finalização de pedido integrada

### Pedidos

- Lista de pedidos em acordeão
- Badges de status e pagamento coloridos
- Ações de pagamento e cancelamento

## 👨‍💻 Autor

**Felipe Rocha**
[GitHub](https://github.com/FlpRocha236)
