import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from "@nestjs/common";
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(exception)
    const message = exception instanceof Error ? exception.message : exception.message.error || "Something went wrong, please contact support";
    console.log("Exception Message ::: ____________ ", message);

    const statusCode = exception.status;
    const data = exception.response ? exception.response.data : null;
    // console.log("exception inside filter", exception, typeof exception);
    // console.log('userid', request.user,exception)
    // this.Log.error(request.url, {message,userId: request.user? request.user.id: null});
    let finalMessage = "";
    if(message.search('authentication strategy') != -1) {
      finalMessage = "You are not authorized to access. Please login to continue."
    } else {
      finalMessage = message;
    }
    response.status(status).json({
      code: status || statusCode,
      timestamp: new Date().toISOString(),
      status: false,
      message: finalMessage,
      data: data ? data : null
    });
  }
}
