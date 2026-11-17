O módulo contém autenticação, autorização, serviço e repositório MySQL de usuários. Senhas usam scrypt com salt aleatório e nunca são retornadas pelo IPC.

Os níveis são `admin` e `atendente`. Ambos podem consultar, cadastrar e editar clientes; somente `admin` pode excluir. A sessão existe em memória no processo Main e é encerrada ao sair do aplicativo ou chamar logout. Para criar o primeiro administrador, use o seed configurado pelo `.env`.
