export interface IActionResult<T> {
    action: String,
    message: String,
    success: Boolean,
    data: T
}