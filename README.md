# Sistema de Gerenciamento de Tarefas

Sistema criado para o desafio técnico proposto pela Pitang para a vaga de Frontend.

O projeto foi desenvolvido com Angular na versão 17.3.2.

## Início

Para inicializar o projeto, primeiro instale as dependências com o comando `npm install`.
Após a instalação das dependências, execute o comando `npm start`, onde irá ser executado tanto a compilação da aplicação quanto a inicialização do banco de dados interno criado para armazenar as informações.

## Testes

Foram adicionados testes unitários para os arquivos do projeto, que atualmente conta com a seguinte cobertura:

```
=============================== Coverage summary ===============================
Statements   : 69.91% ( 86/123 )
Branches     : 57.14% ( 16/28 )
Functions    : 67.3% ( 35/52 )
Lines        : 68.1% ( 79/116 )
================================================================================
```

- Para visualizar os testes unitários, execute o comando `npm run test`;
- Para conferir a cobertura, execute o comando `ng test --code-coverage`.

## Observações

- A aplicação segue padrões modernos de desenvolvimento, embarcando conceitos de programação reativa e assíncrona através da biblioteca RXJS, responsividade e abordagens de principios como: YAGNI, DRY, KISS e SOLID.
  
- O projeto está com comentários nos métodos escritos de forma didática, mas que não refletem necessariamente a necessidade dos comentários em questão.