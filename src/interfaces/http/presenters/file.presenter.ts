export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
}

export class FilePresenter {
    static success<T>(message: string, data: T): ApiSuccessResponse<T> {
        return {
            success: true,
            message,
            data,
        };
    }

    static error(message: string): ApiErrorResponse {
        return {
            success: false,
            message,
        };
    }
}