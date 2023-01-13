using AutoMapper;
using Chatty.Models;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<RegisterDto, User>();
        CreateMap<LoginDto, User>();
        CreateMap<User, GetUserDto>().ReverseMap();
        CreateMap<Conversation, GetConversationDto>().ReverseMap();
        CreateMap<CreateMessageDto, Message>().ReverseMap();
        CreateMap<User, Friend>().ReverseMap();
    }
}
