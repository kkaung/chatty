using AutoMapper;
using Chatty.Models;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<RegisterDto, User>();
        CreateMap<LoginDto, User>();
        CreateMap<User, GetUserDto>().ReverseMap();
        CreateMap<UserNoFirends, User>().ReverseMap();
        CreateMap<Conversation, GetConversationDto>().ReverseMap();
        CreateMap<Friend, User>().ReverseMap();
        CreateMap<CreateMessageDto, Message>().ReverseMap();
        CreateMap<Friend, UserNoFirends>().ReverseMap();
    }
}
