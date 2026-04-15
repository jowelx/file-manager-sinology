export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
}
export declare class FilePresenter {
    static success<T>(message: string, data: T): ApiSuccessResponse<T>;
    static error(message: string): ApiErrorResponse;
}
