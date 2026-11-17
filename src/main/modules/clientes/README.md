O módulo implementa entidade contratual, validação, serviço e repositório MySQL para listar, criar, atualizar e excluir clientes. A UI acessa operações exclusivamente pelo preload tipado e IPC; o Main exige sessão e reserva exclusão para administradores.

CPF e CEP são persistidos somente com dígitos. E-mail e CPF são opcionais; o CPF usa validação dos dígitos verificadores, e os demais campos e limites de tamanho são validados antes da persistência.
