# Correção do Backend - Repositório de Cursos com Dapper

## Problema Identificado
O erro `Unknown column 'Id' in 'where clause'` significa que suas queries SQL estão usando `@Id` mas a coluna correta é `@IdCursos` ou `IdCursos`.

## Implementação Correta do Repositório

```csharp
using System.Data;
using System.Data.SqlClient;
using Dapper;
using UniversidadeAPI.Models;

namespace UniversidadeAPI.Repositories
{
    public class CursoRepository
    {
        private readonly string _connectionString;

        public CursoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        // LISTAR TODOS OS CURSOS COM PROFESSORES
        public async Task<List<Curso>> ListarCursosAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sql = @"
                    SELECT 
                        c.IdCursos, 
                        c.Nome, 
                        c.CargaHoraria, 
                        c.Departamentos_idDepartamentos,
                        cp.ProfessorId
                    FROM Curso c
                    LEFT JOIN CursoProfessor cp ON c.IdCursos = cp.CursoId
                    ORDER BY c.IdCursos";

                var cursos = new Dictionary<int, Curso>();

                var resultado = await connection.QueryAsync<dynamic>(sql);

                foreach (var row in resultado)
                {
                    int cursoId = row.IdCursos;

                    if (!cursos.ContainsKey(cursoId))
                    {
                        cursos[cursoId] = new Curso
                        {
                            IdCursos = cursoId,
                            Nome = row.Nome,
                            CargaHoraria = row.CargaHoraria,
                            Departamentos_idDepartamentos = row.Departamentos_idDepartamentos,
                            Professores = new List<Professor>()
                        };
                    }

                    if (row.ProfessorId != null)
                    {
                        // Aqui você pode carregar o professor completo se necessário
                        cursos[cursoId].Professores.Add(new Professor { IdProfessores = row.ProfessorId });
                    }
                }

                return cursos.Values.ToList();
            }
        }

        // BUSCAR UM CURSO COM PROFESSORES
        public async Task<Curso?> BuscarPorIdAsync(int idCursos)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sql = @"
                    SELECT 
                        c.IdCursos, 
                        c.Nome, 
                        c.CargaHoraria, 
                        c.Departamentos_idDepartamentos,
                        cp.ProfessorId
                    FROM Curso c
                    LEFT JOIN CursoProfessor cp ON c.IdCursos = cp.CursoId
                    WHERE c.IdCursos = @IdCursos";

                var resultado = await connection.QueryAsync<dynamic>(sql, new { IdCursos = idCursos });

                if (!resultado.Any())
                    return null;

                var curso = new Curso
                {
                    IdCursos = resultado.First().IdCursos,
                    Nome = resultado.First().Nome,
                    CargaHoraria = resultado.First().CargaHoraria,
                    Departamentos_idDepartamentos = resultado.First().Departamentos_idDepartamentos,
                    Professores = new List<Professor>()
                };

                foreach (var row in resultado)
                {
                    if (row.ProfessorId != null)
                    {
                        curso.Professores.Add(new Professor { IdProfessores = row.ProfessorId });
                    }
                }

                return curso;
            }
        }

        // CRIAR CURSO COM PROFESSORES
        public async Task<int> CriarAsync(Curso curso)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // 1. Inserir curso
                        var sqlCurso = @"
                            INSERT INTO Curso (Nome, CargaHoraria, Departamentos_idDepartamentos)
                            VALUES (@Nome, @CargaHoraria, @DepartamentoId);
                            SELECT CAST(SCOPE_IDENTITY() as int)";

                        var cursoId = await connection.QuerySingleAsync<int>(sqlCurso,
                            new
                            {
                                Nome = curso.Nome,
                                CargaHoraria = curso.CargaHoraria,
                                DepartamentoId = curso.Departamentos_idDepartamentos
                            },
                            transaction);

                        // 2. Inserir professores (se houver)
                        if (curso.Professores != null && curso.Professores.Count > 0)
                        {
                            var sqlProf = @"
                                INSERT INTO CursoProfessor (CursoId, ProfessorId)
                                VALUES (@CursoId, @ProfessorId)";

                            foreach (var professor in curso.Professores)
                            {
                                await connection.ExecuteAsync(sqlProf,
                                    new { CursoId = cursoId, ProfessorId = professor.IdProfessores },
                                    transaction);
                            }
                        }

                        transaction.Commit();
                        return cursoId;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        // ATUALIZAR CURSO COM PROFESSORES
        public async Task<bool> AtualizarAsync(Curso curso)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // 1. Atualizar curso
                        var sqlCurso = @"
                            UPDATE Curso 
                            SET Nome = @Nome, 
                                CargaHoraria = @CargaHoraria, 
                                Departamentos_idDepartamentos = @DepartamentoId
                            WHERE IdCursos = @IdCursos";

                        var resultado = await connection.ExecuteAsync(sqlCurso,
                            new
                            {
                                IdCursos = curso.IdCursos,
                                Nome = curso.Nome,
                                CargaHoraria = curso.CargaHoraria,
                                DepartamentoId = curso.Departamentos_idDepartamentos
                            },
                            transaction);

                        if (resultado == 0)
                        {
                            transaction.Rollback();
                            return false;
                        }

                        // 2. Deletar professores antigos
                        var sqlDeleteProf = @"
                            DELETE FROM CursoProfessor 
                            WHERE CursoId = @CursoId";

                        await connection.ExecuteAsync(sqlDeleteProf,
                            new { CursoId = curso.IdCursos },
                            transaction);

                        // 3. Inserir novos professores
                        if (curso.Professores != null && curso.Professores.Count > 0)
                        {
                            var sqlProf = @"
                                INSERT INTO CursoProfessor (CursoId, ProfessorId)
                                VALUES (@CursoId, @ProfessorId)";

                            foreach (var professor in curso.Professores)
                            {
                                await connection.ExecuteAsync(sqlProf,
                                    new { CursoId = curso.IdCursos, ProfessorId = professor.IdProfessores },
                                    transaction);
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        // DELETAR CURSO (E SEUS PROFESSORES)
        public async Task<bool> DeletarAsync(int idCursos)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // 1. Deletar relacionamentos
                        var sqlDeleteProf = @"
                            DELETE FROM CursoProfessor 
                            WHERE CursoId = @IdCursos";

                        await connection.ExecuteAsync(sqlDeleteProf,
                            new { IdCursos = idCursos },
                            transaction);

                        // 2. Deletar curso
                        var sqlDeleteCurso = @"
                            DELETE FROM Curso 
                            WHERE IdCursos = @IdCursos";

                        var resultado = await connection.ExecuteAsync(sqlDeleteCurso,
                            new { IdCursos = idCursos },
                            transaction);

                        transaction.Commit();
                        return resultado > 0;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }
    }
}
```

## Pontos Críticos Corrigidos

1. **Nomes corretos das colunas:**
   - `IdCursos` (não `Id`)
   - `Departamentos_idDepartamentos` (mantém o underscore)
   - `IdProfessores` (não `ProfessorId`)

2. **Queries SQL corretas:**
   - `WHERE c.IdCursos = @IdCursos` (não `@Id`)
   - `WHERE IdCursos = @IdCursos` nas operações de DELETE/UPDATE

3. **Transações:**
   - Usadas em CREATE, UPDATE e DELETE para manter consistência
   - Se algo falhar, tudo é feito rollback

4. **JOIN correto:**
   - `LEFT JOIN CursoProfessor cp ON c.IdCursos = cp.CursoId`
   - Retorna cursos mesmo sem professores

## Próximos Passos

1. Copie esta implementação para seu `CursoRepository.cs` no backend
2. Adapte o seu `CursoController` para usar este repositório
3. Garanta que a tabela `CursoProfessor` existe:
   ```sql
   CREATE TABLE CursoProfessor (
       CursoId INT NOT NULL,
       ProfessorId INT NOT NULL,
       PRIMARY KEY (CursoId, ProfessorId),
       FOREIGN KEY (CursoId) REFERENCES Curso(IdCursos),
       FOREIGN KEY (ProfessorId) REFERENCES Professor(IdProfessores)
   );
   ```

4. Teste novamente!
