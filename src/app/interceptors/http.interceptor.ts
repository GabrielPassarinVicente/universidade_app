import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🌐 Requisição HTTP:', {
    method: req.method,
    url: req.url,
    headers: req.headers.keys(),
    body: req.body
  });

  return next(req).pipe(
    tap({
      next: (event: any) => {
        if (event.type === 4) {
          console.log('✅ Resposta recebida:', {
            url: req.url,
            status: event.status,
            body: event.body
          });
        }
      },
      error: (error) => {
        console.error('❌ Erro na requisição:', {
          url: req.url,
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          corpoEnviado: req.body
        });

        if (error.status === 400) {
          console.error('❌ ERRO 400 - Detalhes da validação:', JSON.stringify(error.error, null, 2));
        }
      }
    })
  );
};
