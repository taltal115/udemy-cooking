import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/do'

@Injectable()
export class LoginInterceptor implements HttpInterceptor{
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do(
      event => console.log('Login Interceptor: ', event)
    );
  }
}
