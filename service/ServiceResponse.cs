namespace Chatty.Services;

public class ServiceResponse<T>
{
    public string Message { get; set; } = String.Empty;
    public bool Success { get; set; } = true;
    public T? Data { get; set; }
}
