export class FilePresenter {
    static success(message, data) {
        return {
            success: true,
            message,
            data,
        };
    }
    static error(message) {
        return {
            success: false,
            message,
        };
    }
}
//# sourceMappingURL=file.presenter.js.map