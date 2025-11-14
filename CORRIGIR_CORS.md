# Como Corrigir o Erro de CORS

## Problema
```
Access to XMLHttpRequest at 'http://localhost:5019/api/auth/login' from origin 'http://localhost:63263' 
has been blocked by CORS policy
```

## Solução

Você precisa configurar o CORS no seu **backend (API .NET)**.

### Passo 1: Abra o arquivo `Program.cs` do seu projeto de API

### Passo 2: Adicione a configuração de CORS

**ANTES** da linha `var app = builder.Build();`, adicione:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:63263", "http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

### Passo 3: Use o CORS no pipeline

**DEPOIS** da linha `var app = builder.Build();` e **ANTES** de `app.UseAuthorization();`, adicione:

```csharp
app.UseCors("AllowAngular");
```

### Exemplo Completo do Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

// Adicione seus serviços aqui
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ ADICIONE ISSO - Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:63263", "http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure o pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ ADICIONE ISSO - Use o CORS (ORDEM IMPORTANTE!)
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### Passo 4: Reinicie a API

Após fazer as alterações:
1. Pare o servidor da API
2. Inicie novamente
3. Teste o login no Angular

## Por que isso acontece?

CORS é uma medida de segurança do navegador que bloqueia requisições entre diferentes origens (domínios/portas). Como o Angular está em `localhost:63263` e a API em `localhost:5019`, são consideradas origens diferentes.

## Outras Opções (se não funcionar)

Se você quiser permitir **qualquer origem** (apenas para desenvolvimento):

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

**⚠️ IMPORTANTE:** Não use `AllowAnyOrigin()` em produção! É inseguro.
