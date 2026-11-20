O script `seed.mjs` é executado por `npm run db:seed` e precisa que `001-inicial.sql` já tenha sido aplicado. Defina `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` no `.env`; a senha precisa ter pelo menos 12 caracteres e é armazenada como hash scrypt.

O script cria o administrador apenas se o e-mail ainda não existir e insere clientes demonstrativos apenas se seus e-mails não existirem. Reexecutá-lo não duplica os registros nem redefine a senha existente. Não há credenciais padrão no repositório.
